const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/privacyFaceController');

// All routes require authentication
router.use(protect);

// ============ Privacy Vault Routes ============
router.get('/alerts', ctrl.getPrivacyAlerts);
router.get('/vault', ctrl.getVaultPhotos);
router.patch('/:photoId/move-to-vault', ctrl.moveToVault);
router.patch('/:photoId/remove-from-vault', ctrl.removeFromVault);
router.patch('/:photoId/dismiss', ctrl.dismissAlert);

module.exports = router;
