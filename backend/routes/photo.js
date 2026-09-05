const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const {
  uploadPhoto,
  getAllPhotos,
} = require("../controllers/photoController");

// Upload multiple photos
router.post("/upload", upload.array("images", 10), uploadPhoto);

// Get all photos
router.get("/", getAllPhotos);

module.exports = router;