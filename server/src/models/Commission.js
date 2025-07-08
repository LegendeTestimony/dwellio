// dwellio/models/Commission.js
import mongoose from 'mongoose';

const commissionSchema = new mongoose.Schema({
  referralId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Referral',
    required: true
  },
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  rentAmount: {
    type: Number,
    required: true // The rent amount this commission is based on
  },
  commissionRate: {
    type: Number,
    required: true,
    default: 5.0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid', 'disputed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'mobile_money', 'wallet', 'check'],
    default: null
  },
  paymentReference: {
    type: String,
    default: null
  },
  paymentDate: {
    type: Date,
    default: null
  },
  // Bank details for payout
  payoutDetails: {
    accountName: { type: String },
    accountNumber: { type: String },
    bankName: { type: String },
    bankCode: { type: String }
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Admin who approved
  },
  approvedAt: {
    type: Date,
    default: null
  },
  notes: { type: String },
  disputeReason: { type: String }
}, { timestamps: true });

// Indexes for efficient queries
commissionSchema.index({ referrerId: 1, status: 1 });
commissionSchema.index({ status: 1, createdAt: -1 });
commissionSchema.index({ paymentDate: -1 });

const Commission = mongoose.model('Commission', commissionSchema);
export default Commission;
