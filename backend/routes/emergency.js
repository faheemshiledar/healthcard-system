const express = require('express');
const router = express.Router();
const { getPublicProfile } = require('../controllers/profileController');

router.get('/:publicId', getPublicProfile);
router.post('/:publicId/scan', getPublicProfile);

module.exports = router;
