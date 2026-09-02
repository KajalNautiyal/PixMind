const express = require('express');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadPhoto, getPhotos, deletePhoto } = require('../controllers/photoController');

const router = express.Router();

// All photo routes are protected
router.use(protect);

router.post('/upload', upload.single('photo'), uploadPhoto);
router.get('/', getPhotos);
router.delete('/:id', deletePhoto);

module.exports = router;
