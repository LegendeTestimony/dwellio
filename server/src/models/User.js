// dwellio/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['tenant', 'landlord', 'admin'],
      default: 'tenant',
    },
    // Tenant-specific fields
    tenantProfile: {
      occupation: { type: String },
      employerName: { type: String },
      monthlyIncome: { type: Number },
      emergencyContactName: { type: String },
      emergencyContactPhone: { type: String },
      guarantorName: { type: String },
      guarantorPhone: { type: String },
      guarantorEmail: { type: String },
      // Current residence information
      currentResidence: {
        address: { type: String },
        landlordName: { type: String },
        landlordPhone: { type: String },
        moveInDate: { type: Date },
        rentAmount: { type: Number },
        isCurrentlyRenting: { type: Boolean, default: false }
      },
      // Verification documents
      documents: [{
        type: { type: String, enum: ['id_card', 'utility_bill', 'bank_statement', 'employment_letter', 'passport'] },
        url: { type: String },
        filename: { type: String },
        uploadDate: { type: Date, default: Date.now },
        verified: { type: Boolean, default: false }
      }],
      // Move-out intent
      moveOutIntent: {
        intendedDate: { type: Date },
        reason: { type: String },
        preferredAreas: [{ type: String }],
        budgetRange: {
          min: { type: Number },
          max: { type: Number }
        },
        propertyType: { type: String },
        facilitationRequested: { type: Boolean, default: false },
        status: { type: String, enum: ['pending', 'searching', 'matched', 'completed'], default: 'pending' }
      }
    },
    // Verification status
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    trustScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    profilePhoto: {
      type: String,
    },
    preferredContactMethod: {
      type: String,
      enum: ['email', 'sms', 'whatsapp'],
      default: 'email',
    },
    status: {
      type: String,
      enum: ['active', 'banned', 'pending'],
      default: 'active',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  // Generate fullName from firstName and lastName
  if (this.firstName && this.lastName) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
  
  // Hash password if it's modified
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
