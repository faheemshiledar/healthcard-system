const express = require('express');
const router = express.Router();
const { updateProfile, getScanHistory, triggerSOS } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.put('/update', updateProfile);
router.get('/scans', getScanHistory);
router.post('/sos', triggerSOS);

module.exports = router;
