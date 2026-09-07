"""
PixMind AI Service — Main Flask Application
Provides face detection and privacy scanning endpoints.
"""

import os
import sys
import traceback
from flask import Flask, request, jsonify
from config import Config

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Ensure required directories exist
os.makedirs(Config.FACE_CROP_FOLDER, exist_ok=True)

# ============================================================
# Lazy-load heavy models (only when first request comes)
# ============================================================
_ocr_reader = None
_face_app = None


def get_ocr_reader():
    """Lazy-load EasyOCR reader (downloads model on first use, ~200MB)."""
    global _ocr_reader
    if _ocr_reader is None:
        print("[AI] Loading EasyOCR model (first time may take a few minutes)...")
        import easyocr
        _ocr_reader = easyocr.Reader(Config.OCR_LANGUAGES, gpu=False)
        print("[AI] EasyOCR loaded successfully!")
    return _ocr_reader


def get_face_app():
    """Lazy-load InsightFace model (downloads model on first use, ~300MB)."""
    global _face_app
    if _face_app is None:
        print("[AI] Loading InsightFace model (first time may take a few minutes)...")
        import insightface
        _face_app = insightface.app.FaceAnalysis(
            name='buffalo_l',
            providers=['CPUExecutionProvider']
        )
        _face_app.prepare(ctx_id=0, det_size=(640, 640))
        print("[AI] InsightFace loaded successfully!")
    return _face_app


# ============================================================
# Routes
# ============================================================

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'ok',
        'service': 'PixMind AI Service',
        'version': '1.0.0'
    })


@app.route('/ai/privacy-scan', methods=['POST'])
def privacy_scan():
    """
    Scan an uploaded image for sensitive documents.
    Expects: multipart/form-data with 'image' file
    Returns: { is_sensitive, findings[], keyword_matches[] }
    """
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'error': 'Empty filename'}), 400

        # Read image bytes
        import numpy as np
        import cv2

        file_bytes = np.frombuffer(image_file.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({'error': 'Could not decode image'}), 400

        # Run OCR
        reader = get_ocr_reader()
        ocr_results = reader.readtext(img)

        # Combine all detected text
        full_text = ' '.join([result[1] for result in ocr_results])

        # Scan for sensitive patterns
        from privacy_scanner import scan_text_for_privacy
        scan_result = scan_text_for_privacy(full_text)

        # Add OCR confidence info
        scan_result['ocr_text_length'] = len(full_text)
        scan_result['ocr_detections'] = len(ocr_results)

        return jsonify(scan_result)

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/ai/detect-faces', methods=['POST'])
def detect_faces():
    """
    Detect faces in an uploaded image.
    Expects: multipart/form-data with 'image' file
    Returns: { faces: [{ bbox, embedding, confidence }] }
    """
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'error': 'Empty filename'}), 400

        # Read image
        import numpy as np
        import cv2

        file_bytes = np.frombuffer(image_file.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({'error': 'Could not decode image'}), 400

        # Detect faces
        face_app = get_face_app()
        faces = face_app.get(img)

        results = []
        for i, face in enumerate(faces):
            bbox = face.bbox.astype(int).tolist()

            # Save face crop
            x1, y1, x2, y2 = bbox
            # Add some padding to the crop
            h, w = img.shape[:2]
            pad = 20
            x1_pad = max(0, x1 - pad)
            y1_pad = max(0, y1 - pad)
            x2_pad = min(w, x2 + pad)
            y2_pad = min(h, y2 + pad)
            face_crop = img[y1_pad:y2_pad, x1_pad:x2_pad]

            # Generate unique filename for the crop
            import uuid
            crop_filename = f"face_{uuid.uuid4().hex[:12]}.jpg"
            crop_path = os.path.join(Config.FACE_CROP_FOLDER, crop_filename)
            cv2.imwrite(crop_path, face_crop)

            results.append({
                'index': i,
                'bbox': bbox,
                'confidence': float(face.det_score),
                'embedding': face.embedding.tolist(),
                'crop_filename': crop_filename
            })

        return jsonify({
            'face_count': len(results),
            'faces': results
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ============================================================
# Run
# ============================================================
if __name__ == '__main__':
    print(f"🧠 PixMind AI Service starting on port {Config.PORT}...")
    print(f"   Health check: http://localhost:{Config.PORT}/health")
    print(f"   Privacy scan: POST http://localhost:{Config.PORT}/ai/privacy-scan")
    print(f"   Face detect:  POST http://localhost:{Config.PORT}/ai/detect-faces")
    print()
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
