const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'bloodGroup', 'dateOfBirth', 'gender', 'weight', 'height',
      'allergies', 'conditions', 'medications', 'emergencyContacts',
      'isOrganDonor', 'organDonorNotes', 'insuranceProvider', 'insurancePolicyNumber',
      'primaryDoctor', 'emergencyNotes', 'isPublic', 'showOrganDonor', 'showDoctorInfo'
    ];
    
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, message: 'Profile updated successfully', user: user.toProfileJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ publicId: req.params.publicId });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Emergency card not found' });
    }
    
    if (!user.isPublic) {
      return res.status(403).json({ success: false, message: 'This emergency card is private' });
    }
    
    // Log the scan
    const scanLog = {
      timestamp: new Date(),
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      location: req.body.location || {},
    };
    
    user.qrScans.push(scanLog);
    user.totalScans += 1;
    
    // Keep only last 100 scans
    if (user.qrScans.length > 100) {
      user.qrScans = user.qrScans.slice(-100);
    }
    
    await user.save({ validateBeforeSave: false });
    
    res.json({ success: true, data: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getScanHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('qrScans totalScans');
    res.json({
      success: true,
      totalScans: user.totalScans,
      recentScans: user.qrScans.slice(-20).reverse(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.triggerSOS = async (req, res) => {
  try {
    const { location, message } = req.body;
    const user = await User.findById(req.user._id);
    
    // Mock SOS - in production, integrate Twilio or similar
    const contacts = user.emergencyContacts.filter(c => c.phone);
    
    console.log(`🚨 SOS ALERT for ${user.name}`);
    console.log(`Location: ${JSON.stringify(location)}`);
    console.log(`Message: ${message}`);
    console.log(`Notifying contacts: ${contacts.map(c => c.phone).join(', ')}`);
    
    res.json({
      success: true,
      message: 'SOS alert sent to emergency contacts',
      contactsNotified: contacts.length,
      contacts: contacts.map(c => ({ name: c.name, phone: c.phone })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
