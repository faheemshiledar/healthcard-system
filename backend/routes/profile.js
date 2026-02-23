const express = require('express');
const router = express.Router();
const { updateProfile, getScanHistory, triggerSOS } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.put('/update', protect, updateProfile);
router.get('/scans', protect, getScanHistory);
router.post('/sos', protect, triggerSOS);

module.exports = router;
