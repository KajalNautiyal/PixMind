const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: false,
  default: null,
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
  unique: true,
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

module.exports = mongoose.model('Photo', photoSchema);
