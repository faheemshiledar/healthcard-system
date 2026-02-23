const express = require('express');
const User = require('../models/User');

const router = express.Router();

// POST /api/scan/:qrToken - Log a QR scan
router.post('/:qrToken', async (req, res) => {
  try {
    const { location } = req.body;
    
    const user = await User.findOne({ qrToken: req.params.qrToken });
    if (!user) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const scanEntry = {
      timestamp: new Date(),
      ipAddress: req.ip || req.headers['x-forwarded-for'],
      userAgent: req.headers['user-agent'],
      location: location || null,
    };

    // Keep last 200 scan logs
    if (user.scanLogs.length >= 200) {
      user.scanLogs = user.scanLogs.slice(-199);
    }
    
    user.scanLogs.push(scanEntry);
    user.scanCount = (user.scanCount || 0) + 1;
    user.lastScanned = new Date();

    await user.save({ validateBeforeSave: false });

    res.json({ message: 'Scan logged', scanCount: user.scanCount });
  } catch (error) {
    console.error('Scan log error:', error);
    // Don't fail the emergency page because of logging errors
    res.json({ message: 'Logged' });
  }
});

module.exports = router;
