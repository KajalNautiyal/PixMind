const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/privacyFaceController');

// All routes require authentication
router.use(protect);

// ============ Face/People Routes ============
router.get('/people', ctrl.getPeople);
router.get('/person/:personId', ctrl.getPersonPhotos);
router.patch('/person/:personId/rename', ctrl.renamePerson);

module.exports = router;
