const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const EmergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  relationship: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  isPrimary: { type: Boolean, default: false },
});

const ScanLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ip: { type: String },
  userAgent: { type: String },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    city: { type: String },
    country: { type: String },
  },
});

const MedicalDocumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['prescription', 'report', 'insurance', 'other'] },
  uploadDate: { type: Date, default: Date.now },
  notes: { type: String },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  password: { type: String, required: true, minlength: 6 },
  publicId: { type: String, unique: true, default: () => uuidv4() },
  avatar: { type: String, default: '' },
  
  // Medical Profile
  bloodGroup: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown'
  },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
  weight: { type: Number },
  height: { type: Number },
  
  allergies: [{ type: String, trim: true }],
  conditions: [{ type: String, trim: true }],
  medications: [{
    name: { type: String, trim: true },
    dosage: { type: String, trim: true },
    frequency: { type: String, trim: true },
  }],
  
  emergencyContacts: [EmergencyContactSchema],
  medicalDocuments: [MedicalDocumentSchema],
  
  // Organ donor status
  isOrganDonor: { type: Boolean, default: false },
  organDonorNotes: { type: String },
  
  // Insurance info (not shown publicly)
  insuranceProvider: { type: String },
  insurancePolicyNumber: { type: String },
  
  // Doctor info
  primaryDoctor: {
    name: { type: String },
    phone: { type: String },
    hospital: { type: String },
  },
  
  // Additional notes for emergency responders
  emergencyNotes: { type: String, maxlength: 500 },
  
  // QR & scan tracking
  qrScans: [ScanLogSchema],
  totalScans: { type: Number, default: 0 },
  
  // Profile visibility
  isPublic: { type: Boolean, default: true },
  showOrganDonor: { type: Boolean, default: true },
  showDoctorInfo: { type: Boolean, default: true },
  
  // Account
  isVerified: { type: Boolean, default: false },
  lastLogin: { type: Date },
  profileCompleteness: { type: Number, default: 0 },
  
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Calculate profile completeness
UserSchema.pre('save', function(next) {
  let score = 0;
  if (this.name) score += 10;
  if (this.bloodGroup && this.bloodGroup !== 'Unknown') score += 20;
  if (this.dateOfBirth) score += 5;
  if (this.allergies && this.allergies.length > 0) score += 15;
  if (this.conditions && this.conditions.length > 0) score += 10;
  if (this.medications && this.medications.length > 0) score += 10;
  if (this.emergencyContacts && this.emergencyContacts.length > 0) score += 20;
  if (this.primaryDoctor && this.primaryDoctor.name) score += 10;
  this.profileCompleteness = Math.min(score, 100);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Return safe public data (no email, password, insurance)
UserSchema.methods.toPublicJSON = function() {
  return {
    publicId: this.publicId,
    name: this.name,
    bloodGroup: this.bloodGroup,
    dateOfBirth: this.dateOfBirth,
    gender: this.gender,
    weight: this.weight,
    height: this.height,
    allergies: this.allergies,
    conditions: this.conditions,
    medications: this.medications,
    emergencyContacts: this.emergencyContacts.map(c => ({
      name: c.name,
      relationship: c.relationship,
      phone: c.phone,
      isPrimary: c.isPrimary,
    })),
    isOrganDonor: this.showOrganDonor ? this.isOrganDonor : undefined,
    organDonorNotes: this.showOrganDonor ? this.organDonorNotes : undefined,
    primaryDoctor: this.showDoctorInfo ? this.primaryDoctor : undefined,
    emergencyNotes: this.emergencyNotes,
    totalScans: this.totalScans,
  };
};

// Return profile for authenticated user
UserSchema.methods.toProfileJSON = function() {
  return {
    id: this._id,
    publicId: this.publicId,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    bloodGroup: this.bloodGroup,
    dateOfBirth: this.dateOfBirth,
    gender: this.gender,
    weight: this.weight,
    height: this.height,
    allergies: this.allergies,
    conditions: this.conditions,
    medications: this.medications,
    emergencyContacts: this.emergencyContacts,
    isOrganDonor: this.isOrganDonor,
    organDonorNotes: this.organDonorNotes,
    insuranceProvider: this.insuranceProvider,
    insurancePolicyNumber: this.insurancePolicyNumber,
    primaryDoctor: this.primaryDoctor,
    emergencyNotes: this.emergencyNotes,
    isPublic: this.isPublic,
    showOrganDonor: this.showOrganDonor,
    showDoctorInfo: this.showDoctorInfo,
    profileCompleteness: this.profileCompleteness,
    totalScans: this.totalScans,
    qrScans: this.qrScans.slice(-10),
    createdAt: this.createdAt,
    lastLogin: this.lastLogin,
  };
};

module.exports = mongoose.model('User', UserSchema);
