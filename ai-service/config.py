import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    PORT = int(os.getenv('AI_PORT', 5001))
    DEBUG = os.getenv('AI_DEBUG', 'True').lower() == 'true'
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'backend', 'uploads')
    FACE_CROP_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'backend', 'uploads', 'faces')
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB max

    # OCR Settings
    OCR_LANGUAGES = ['en', 'hi']

    # Face Detection Settings
    FACE_SIMILARITY_THRESHOLD = 0.6  # cosine similarity threshold for same person
