const Photo = require('../models/Photo');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const md5File = require('md5-file');
const { triggerAIScan } = require('./privacyFaceController');

// ===============================
// Upload Multiple Photos
// ===============================
const uploadPhoto = async (req, res) => {
  try {
    // Check if files exist
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image.",
      });
    }

    const uploadedPhotos = [];
    const duplicatePhotos = [];

    // Loop through uploaded files
    for (const file of req.files) {
      // Read image metadata
      const metadata = await sharp(file.path).metadata();

      // Generate unique hash for image
      const hash = await md5File(file.path);

      // Check duplicate in MongoDB for THIS user
      const existingPhoto = await Photo.findOne({ hash, user: req.userId });

      if (existingPhoto) {
        duplicatePhotos.push(file.originalname);
        console.log("Duplicate skipped:", file.originalname);
        continue;
      }

      // Save photo in MongoDB
      const photo = await Photo.create({
        user: req.userId, // Connect to logged-in user
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size,
        hash, // Save hash
        metadata: {
          width: metadata.width,
          height: metadata.height,
          camera: metadata.model || "Unknown",
          location: "Unknown",
        },
        aiTags: [],
        isArchived: false,
        isFavorite: false,
      });

      uploadedPhotos.push(photo);

      // Trigger AI Scan in the background (fire and forget)
      triggerAIScan(photo._id, req.userId);
    }

    res.status(201).json({
      success: true,
      message: `${uploadedPhotos.length} photo(s) uploaded successfully!`,
      uploaded: uploadedPhotos,
      duplicates: duplicatePhotos,
    });
  } catch (error) {
    console.error("Upload Error:", error);

    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};

// ===============================
// Get All Photos
// ===============================
const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ 
      user: req.userId,
      isPrivate: { $ne: true }, // Don't show vault photos in main gallery
      isDeleted: { $ne: true }  // Don't show trashed photos
    }).sort({ createdAt: -1 }).limit(100);

    // Count duplicate hashes (across user's photos)
    const hashCount = {};

    photos.forEach((photo) => {
      if(photo.hash) {
        hashCount[photo.hash] = (hashCount[photo.hash] || 0) + 1;
      }
    });

    // Add isDuplicate field
    const updatedPhotos = photos.map((photo) => ({
      ...photo.toObject(),
      isDuplicate: photo.hash ? (hashCount[photo.hash] > 1) : false,
    }));

    res.status(200).json({
      success: true,
      data: updatedPhotos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch photos",
      error: error.message,
    });
  }
};

// ===============================
// Move Photos to Trash (Soft Delete)
// ===============================
const deletePhotos = async (req, res) => {
  try {
    const { photoIds } = req.body;
    
    if (!photoIds || !Array.isArray(photoIds) || photoIds.length === 0) {
      return res.status(400).json({ success: false, message: "Provide an array of photoIds to delete" });
    }

    const result = await Photo.updateMany(
      { _id: { $in: photoIds }, user: req.userId },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );

    res.status(200).json({
      success: true,
      message: `Successfully moved ${result.modifiedCount} photo(s) to trash`,
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete photos",
      error: error.message,
    });
  }
};

// ===============================
// Get Trash Photos
// ===============================
const getTrashPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ 
      user: req.userId,
      isDeleted: true
    }).sort({ deletedAt: -1 });

    res.status(200).json({
      success: true,
      data: photos,
    });
  } catch (error) {
    console.error("Get Trash Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch trash photos" });
  }
};

// ===============================
// Restore Photos from Trash
// ===============================
const restorePhotos = async (req, res) => {
  try {
    const { photoIds } = req.body;
    if (!photoIds || !Array.isArray(photoIds) || photoIds.length === 0) {
      return res.status(400).json({ success: false, message: "Provide photoIds to restore" });
    }

    const result = await Photo.updateMany(
      { _id: { $in: photoIds }, user: req.userId },
      { $set: { isDeleted: false, deletedAt: null } }
    );

    res.status(200).json({
      success: true,
      message: `Restored ${result.modifiedCount} photo(s)`,
    });
  } catch (error) {
    console.error("Restore Error:", error);
    res.status(500).json({ success: false, message: "Failed to restore photos" });
  }
};

// ===============================
// Empty Trash (Hard Delete)
// ===============================
const emptyTrash = async (req, res) => {
  try {
    const { photoIds } = req.body;
    let query = { user: req.userId, isDeleted: true };
    if (photoIds && Array.isArray(photoIds) && photoIds.length > 0) {
      query._id = { $in: photoIds };
    }

    const photos = await Photo.find(query);
    if (photos.length === 0) {
      return res.status(200).json({ success: true, message: "Trash is already empty" });
    }

    const fs = require('fs');
    const path = require('path');
    let deletedCount = 0;

    for (const photo of photos) {
      await Photo.findByIdAndDelete(photo._id);
      
      try {
        const filePath = path.join(__dirname, '..', photo.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error(`Failed to delete file from disk: ${photo.url}`, err);
      }
      deletedCount++;
    }

    res.status(200).json({
      success: true,
      message: `Permanently deleted ${deletedCount} photo(s)`,
    });
  } catch (error) {
    console.error("Empty Trash Error:", error);
    res.status(500).json({ success: false, message: "Failed to empty trash" });
  }
};

// ===============================
// Export Controllers
// ===============================
module.exports = {
  uploadPhoto,
  getAllPhotos,
  deletePhotos,
  getTrashPhotos,
  restorePhotos,
  emptyTrash,
};