const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  uploadPhoto,
  getAllPhotos,
  deletePhotos,
  getTrashPhotos,
  restorePhotos,
  emptyTrash,
} = require("../controllers/photoController");

// All photo routes require authentication
router.use(protect);

// Upload multiple photos
router.post("/upload", upload.array("images", 10), uploadPhoto);

// Get all photos
router.get("/", getAllPhotos);

// Delete photos (move to trash)
router.post("/delete-bulk", deletePhotos);

// Trash routes
router.get("/trash", getTrashPhotos);
router.post("/restore", restorePhotos);
router.delete("/empty-trash", emptyTrash);

module.exports = router;