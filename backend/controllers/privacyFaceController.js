const Photo = require('../models/Photo');
const Face = require('../models/Face');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

// ============================================================
// Privacy Vault
// ============================================================

/**
 * GET /api/privacy/alerts
 * Get all photos with privacy findings for the logged-in user
 */
exports.getPrivacyAlerts = async (req, res) => {
  try {
    const photos = await Photo.find({
      user: req.userId,
      'privacyFindings.0': { $exists: true }, // has at least 1 finding
      isPrivate: false,
      isDeleted: { $ne: true }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: photos.length,
      data: photos,
    });
  } catch (error) {
    console.error('Privacy alerts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch privacy alerts' });
  }
};

/**
 * GET /api/privacy/vault
 * Get all photos in the privacy vault
 */
exports.getVaultPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({
      user: req.userId,
      isPrivate: true,
      isDeleted: { $ne: true }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: photos.length,
      data: photos,
    });
  } catch (error) {
    console.error('Vault error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch vault photos' });
  }
};

/**
 * PATCH /api/privacy/:photoId/move-to-vault
 * Move a photo to the privacy vault
 */
exports.moveToVault = async (req, res) => {
  try {
    const photo = await Photo.findOne({
      _id: req.params.photoId,
      user: req.userId,
    });

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    photo.isPrivate = true;
    await photo.save();

    res.json({ success: true, message: 'Photo moved to vault', data: photo });
  } catch (error) {
    console.error('Move to vault error:', error);
    res.status(500).json({ success: false, message: 'Failed to move photo to vault' });
  }
};

/**
 * PATCH /api/privacy/:photoId/remove-from-vault
 * Remove a photo from the privacy vault (back to gallery)
 */
exports.removeFromVault = async (req, res) => {
  try {
    const photo = await Photo.findOne({
      _id: req.params.photoId,
      user: req.userId,
    });

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    photo.isPrivate = false;
    await photo.save();

    res.json({ success: true, message: 'Photo removed from vault', data: photo });
  } catch (error) {
    console.error('Remove from vault error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove photo from vault' });
  }
};

/**
 * PATCH /api/privacy/:photoId/dismiss
 * Dismiss a privacy alert (keep finding but hide from alerts)
 */
exports.dismissAlert = async (req, res) => {
  try {
    const photo = await Photo.findOne({
      _id: req.params.photoId,
      user: req.userId,
    });

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    photo.isDismissed = true;
    await photo.save();

    res.json({ success: true, message: 'Alert dismissed', data: photo });
  } catch (error) {
    console.error('Dismiss alert error:', error);
    res.status(500).json({ success: false, message: 'Failed to dismiss alert' });
  }
};

// ============================================================
// AI Scan (called after photo upload)
// ============================================================

/**
 * Trigger AI scan on a photo (privacy + face detection)
 * This is called internally after a photo is uploaded.
 */
exports.triggerAIScan = async (photoId, userId) => {
  try {
    const photo = await Photo.findOne({ _id: photoId, user: userId });
    if (!photo) return;

    // Update status
    photo.aiScanStatus = 'processing';
    await photo.save();

    const filePath = path.join(__dirname, '..', photo.url);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`[AI Scan] File not found: ${filePath}`);
      photo.aiScanStatus = 'failed';
      await photo.save();
      return;
    }

    // --- Privacy Scan ---
    try {
      const privacyForm = new FormData();
      privacyForm.append('image', fs.createReadStream(filePath));

      const privacyRes = await axios.post(
        `${AI_SERVICE_URL}/ai/privacy-scan`,
        privacyForm,
        { headers: privacyForm.getHeaders(), timeout: 30000 }
      );

      if (privacyRes.data.is_sensitive) {
        photo.privacyFindings = privacyRes.data.findings.map((f) => ({
          type: f.type,
          label: f.label,
          confidence: f.confidence,
          redacted_text: f.redacted_text,
        }));
      }
    } catch (err) {
      console.error('[AI Scan] Privacy scan failed:', err.message);
    }

    // --- Face Detection ---
    try {
      const faceForm = new FormData();
      faceForm.append('image', fs.createReadStream(filePath));

      const faceRes = await axios.post(
        `${AI_SERVICE_URL}/ai/detect-faces`,
        faceForm,
        { headers: faceForm.getHeaders(), timeout: 60000 }
      );

      if (faceRes.data.faces && faceRes.data.faces.length > 0) {
        photo.facesDetected = faceRes.data.face_count;

        // Save each face to the Face collection
        for (const faceData of faceRes.data.faces) {
          // Try to find a matching person
          const personId = await findMatchingPerson(userId, faceData.embedding);

          await Face.create({
            user: userId,
            photo: photoId,
            personId: personId,
            embedding: faceData.embedding,
            bbox: {
              x1: faceData.bbox[0],
              y1: faceData.bbox[1],
              x2: faceData.bbox[2],
              y2: faceData.bbox[3],
            },
            confidence: faceData.confidence,
            cropFilename: faceData.crop_filename,
          });
        }
      }
    } catch (err) {
      console.error('[AI Scan] Face detection failed:', err.message);
    }

    // Mark as completed
    photo.aiScanStatus = 'completed';
    await photo.save();

    console.log(`[AI Scan] Completed for photo ${photoId}`);
  } catch (error) {
    console.error('[AI Scan] Error:', error.message);
    try {
      await Photo.findByIdAndUpdate(photoId, { aiScanStatus: 'failed' });
    } catch (e) {}
  }
};

// ============================================================
// Face Grouping Helper
// ============================================================

/**
 * Find a matching person by comparing face embedding with existing faces.
 * Uses cosine similarity. Returns personId or generates a new one.
 */
async function findMatchingPerson(userId, newEmbedding) {
  const THRESHOLD = 0.6;

  // Get one representative face per person group
  const existingFaces = await Face.aggregate([
    { $match: { user: userId, personId: { $ne: null } } },
    { $group: { _id: '$personId', embedding: { $first: '$embedding' }, personName: { $first: '$personName' } } },
  ]);

  let bestMatch = null;
  let bestScore = -1;

  for (const face of existingFaces) {
    const score = cosineSimilarity(newEmbedding, face.embedding);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = face._id;
    }
  }

  if (bestScore >= THRESHOLD && bestMatch) {
    return bestMatch;
  }

  // No match found — create new person group
  return `person_${uuidv4().slice(0, 8)}`;
}

/**
 * Calculate cosine similarity between two vectors.
 */
function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

// ============================================================
// Face/People Endpoints
// ============================================================

/**
 * GET /api/faces/people
 * Get all unique people (grouped faces) for the user
 */
exports.getPeople = async (req, res) => {
  try {
    const people = await Face.aggregate([
      { $match: { user: req.userId } },
      {
        $group: {
          _id: '$personId',
          personName: { $first: '$personName' },
          photoCount: { $sum: 1 },
          isLabeled: { $first: '$isLabeled' },
          sampleCrop: { $first: '$cropFilename' },
          createdAt: { $first: '$createdAt' },
        },
      },
      { $sort: { photoCount: -1 } },
    ]);

    res.json({ success: true, count: people.length, data: people });
  } catch (error) {
    console.error('Get people error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch people' });
  }
};

/**
 * GET /api/faces/person/:personId
 * Get all photos of a specific person
 */
exports.getPersonPhotos = async (req, res) => {
  try {
    const faces = await Face.find({
      user: req.userId,
      personId: req.params.personId,
    }).populate('photo');

    const photos = faces
      .filter((f) => f.photo)
      .map((f) => ({
        ...f.photo.toObject(),
        faceBbox: f.bbox,
        faceConfidence: f.confidence,
        cropFilename: f.cropFilename,
      }));

    res.json({ success: true, count: photos.length, data: photos });
  } catch (error) {
    console.error('Get person photos error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch person photos' });
  }
};

/**
 * PATCH /api/faces/person/:personId/rename
 * Rename a person
 */
exports.renamePerson = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    await Face.updateMany(
      { user: req.userId, personId: req.params.personId },
      { personName: name.trim(), isLabeled: true }
    );

    res.json({ success: true, message: `Person renamed to "${name.trim()}"` });
  } catch (error) {
    console.error('Rename person error:', error);
    res.status(500).json({ success: false, message: 'Failed to rename person' });
  }
};
