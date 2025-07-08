// dwellio/models/Property.js
import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  state: { type: String, required: true },
  city: { type: String, required: true },
  lga: { type: String, required: true },
  address: { type: String, required: true },
  gps: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, { _id: false });

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['flat', 'duplex', 'bungalow', 'studio', 'shop', 'office'],
    required: true,
  },
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Now optional since anyone can list
  },
  // Referral System Fields
  listedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Who actually created this listing
  },
  isOwnerListing: {
    type: Boolean,
    default: false // True if landlord listed it themselves
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'needs_verification'],
    default: 'pending'
  },
  rejectionReason: { type: String },
  // Contact Information (for non-owner listings)
  landlordContact: {
    phone: { type: String },
    email: { type: String },
    name: { type: String }
  },
  isInEstate: {
    type: Boolean,
    default: false
  },
  estateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estate',
    default: null
  },
  location: locationSchema,
  media: [{ type: String }],
  sharedFacilities: [{ type: String }],
  description: { type: String },
  status: {
    type: String,
    enum: ['listed', 'occupied', 'hidden', 'pending_review'],
    default: 'pending_review'
  }
}, { timestamps: true });

const Property = mongoose.model('Property', propertySchema);
export default Property;
