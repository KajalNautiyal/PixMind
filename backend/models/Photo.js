const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    hash: {
      type: String,
      required: true,
    },
    metadata: {
      width: Number,
      height: Number,
      camera: String,
      location: String,
    },
    aiTags: [String],
    isArchived: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    // Privacy Vault
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isDismissed: {
      type: Boolean,
      default: false,
    },
    privacyFindings: [
      {
        type: { type: String },       // 'aadhaar', 'pan', 'credit_card', etc.
        label: String,                // 'Aadhaar Card', 'PAN Card'
        confidence: Number,
        redacted_text: String,
      },
    ],
    // Face Detection
    facesDetected: {
      type: Number,
      default: 0,
    },
    // AI Processing Status
    aiScanStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Compound index: fast per-user duplicate lookups, allows same hash across different users
photoSchema.index({ user: 1, hash: 1 }, { unique: true });

// Index for gallery queries (user + not private, sorted by date)
photoSchema.index({ user: 1, isPrivate: 1, createdAt: -1 });

module.exports = mongoose.model('Photo', photoSchema);

