// dwellio/models/Referral.js
import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Person who listed the property
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Person who rented it (set when rental happens)
  },
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    default: null // Set when contract is created
  },
  status: {
    type: String,
    enum: ['pending', 'rented', 'commission_paid', 'expired'],
    default: 'pending'
  },
  commissionRate: {
    type: Number,
    default: 5.0 // 5% commission rate
  },
  commissionAmount: {
    type: Number,
    default: 0 // Calculated when rental happens
  },
  rentAmount: {
    type: Number,
    default: 0 // First month rent amount
  },
  paymentDate: {
    type: Date,
    default: null // When commission was paid
  },
  notes: { type: String },
  expiryDate: {
    type: Date,
    default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from creation
  }
}, { timestamps: true });

// Calculate commission when rent amount is set
referralSchema.pre('save', function(next) {
  if (this.isModified('rentAmount') && this.rentAmount > 0) {
    this.commissionAmount = (this.rentAmount * this.commissionRate) / 100;
  }
  next();
});

// Index for efficient queries
referralSchema.index({ referrerId: 1, status: 1 });
referralSchema.index({ propertyId: 1 });
referralSchema.index({ status: 1, expiryDate: 1 });

const Referral = mongoose.model('Referral', referralSchema);
export default Referral;
