const mongoose = require('mongoose');

const faceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    photo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Photo',
      required: true,
    },
    personId: {
      type: String,
      default: null,
      index: true,
    },
    personName: {
      type: String,
      default: 'Unknown',
    },
    embedding: {
      type: [Number],
      required: true,
    },
    bbox: {
      x1: Number,
      y1: Number,
      x2: Number,
      y2: Number,
    },
    confidence: {
      type: Number,
      required: true,
    },
    cropFilename: {
      type: String,
    },
    isLabeled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for finding faces by person
faceSchema.index({ user: 1, personId: 1 });

module.exports = mongoose.model('Face', faceSchema);
