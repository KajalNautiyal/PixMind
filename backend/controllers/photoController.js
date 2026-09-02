const Photo = require('../models/Photo');
const path = require('path');
const fs = require('fs');

/**
 * @desc    Upload new photo
 * @route   POST /api/v1/photos/upload
 * @access  Private
 */
const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    // Determine the URL for the frontend to access the file
    // For local dev, it's just /uploads/filename
    // In production, this would be an S3 URL
    const fileUrl = `/uploads/${req.file.filename}`;

    const newPhoto = await Photo.create({
      user: req.userId,
      filename: req.file.originalname,
      url: fileUrl,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    res.status(201).json({
      success: true,
      data: newPhoto,
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ success: false, message: 'Server error during upload' });
  }
};

/**
 * @desc    Get all photos for logged-in user
 * @route   GET /api/v1/photos
 * @access  Private
 */
const getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ user: req.userId })
      .sort({ createdAt: -1 }) // Newest first
      .limit(50); // Pagination can be added later

    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos,
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ success: false, message: 'Server error fetching photos' });
  }
};

/**
 * @desc    Delete a photo
 * @route   DELETE /api/v1/photos/:id
 * @access  Private
 */
const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    // Ensure user owns the photo
    if (photo.user.toString() !== req.userId) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this photo' });
    }

    // Delete file from local filesystem
    // Extract filename from the URL (e.g., /uploads/filename -> filename)
    const filename = photo.url.split('/').pop();
    const filePath = path.join(__dirname, '../uploads', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await photo.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Photo deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ success: false, message: 'Server error deleting photo' });
  }
};

module.exports = {
  uploadPhoto,
  getPhotos,
  deletePhoto,
};
