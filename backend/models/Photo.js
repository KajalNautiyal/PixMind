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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Photo', photoSchema);
