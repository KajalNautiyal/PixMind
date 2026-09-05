const Photo = require("../models/Photo");
const sharp = require("sharp");
const md5File = require("md5-file");

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

      // Check duplicate in MongoDB
      const existingPhoto = await Photo.findOne({ hash });

      if (existingPhoto) {
        duplicatePhotos.push(file.originalname);
        console.log("Duplicate skipped:", file.originalname);
        continue;
      }

      // Save photo in MongoDB
      const photo = await Photo.create({
        user: null, // Later connect logged-in user
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
// Get All Photos
const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });

    // Count duplicate hashes
    const hashCount = {};

    photos.forEach((photo) => {
      hashCount[photo.hash] = (hashCount[photo.hash] || 0) + 1;
    });

    // Add isDuplicate field
    const updatedPhotos = photos.map((photo) => ({
      ...photo.toObject(),
      isDuplicate: hashCount[photo.hash] > 1,
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
// Export Controllers
// ===============================
module.exports = {
  uploadPhoto,
  getAllPhotos,
};