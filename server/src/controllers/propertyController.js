// dwellio/controllers/propertyController.js
import Property from '../models/Property.js';
import Referral from '../models/Referral.js';
import User from '../models/User.js';

// Create property listing (anyone can list)
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      type,
      location,
      description,
      media,
      sharedFacilities,
      landlordContact,
      isOwnerListing = false
    } = req.body;

    // Validate Abuja location
    if (location.state.toLowerCase() !== 'abuja' && location.state.toLowerCase() !== 'fct') {
      return res.status(400).json({ 
        message: 'Currently only accepting properties in Abuja/FCT' 
      });
    }

    // Create property
    const property = new Property({
      title,
      type,
      location,
      description,
      media: media || [],
      sharedFacilities: sharedFacilities || [],
      listedBy: req.user.userId,
      isOwnerListing,
      landlordContact: isOwnerListing ? null : landlordContact,
      landlordId: isOwnerListing ? req.user.userId : null,
      status: 'pending_review',
      verificationStatus: 'pending'
    });

    await property.save();

    // Create referral record if not owner listing
    if (!isOwnerListing) {
      const referral = new Referral({
        propertyId: property._id,
        referrerId: req.user.userId,
        commissionRate: 5.0
      });
      await referral.save();
    }

    res.status(201).json({
      message: 'Property listed successfully! It will be reviewed and published within 24 hours.',
      property: property,
      referralCreated: !isOwnerListing
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ 
      message: 'Failed to create property listing', 
      error: error.message 
    });
  }
};

// Get all approved properties (public)
export const getAllProperties = async (req, res) => {
  try {
    const { page = 1, limit = 12, type, minPrice, maxPrice } = req.query;
    
    const query = {
      verificationStatus: 'approved',
      status: 'listed'
    };

    if (type) query.type = type;
    
    const properties = await Property.find(query)
      .populate('listedBy', 'fullName username')
      .populate('landlordId', 'fullName phone email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Property.countDocuments(query);

    res.json({
      properties,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch properties', 
      error: error.message 
    });
  }
};

// Get single property
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('listedBy', 'fullName username')
      .populate('landlordId', 'fullName phone email');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Only show approved properties to public
    if (property.verificationStatus !== 'approved' && 
        (!req.user || req.user.userId !== property.listedBy.toString())) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch property', 
      error: error.message 
    });
  }
};

// Get user's listings
export const getPropertiesByUser = async (req, res) => {
  try {
    const properties = await Property.find({ listedBy: req.user.userId })
      .populate('landlordId', 'fullName phone email')
      .sort({ createdAt: -1 });

    // Get referral info for each property
    const propertiesWithReferrals = await Promise.all(
      properties.map(async (property) => {
        const referral = await Referral.findOne({ propertyId: property._id });
        return {
          ...property.toObject(),
          referral: referral
        };
      })
    );

    res.json(propertiesWithReferrals);
  } catch (error) {
    console.error('Get user properties error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user properties', 
      error: error.message 
    });
  }
};

// Search properties
export const searchProperties = async (req, res) => {
  try {
    const { 
      q, 
      type, 
      city, 
      lga, 
      minPrice, 
      maxPrice,
      page = 1, 
      limit = 12 
    } = req.query;

    const query = {
      verificationStatus: 'approved',
      status: 'listed'
    };

    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { 'location.address': { $regex: q, $options: 'i' } },
        { 'location.lga': { $regex: q, $options: 'i' } }
      ];
    }

    // Filters
    if (type) query.type = type;
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (lga) query['location.lga'] = { $regex: lga, $options: 'i' };

    const properties = await Property.find(query)
      .populate('listedBy', 'fullName username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Property.countDocuments(query);

    res.json({
      properties,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      query: req.query
    });
  } catch (error) {
    console.error('Search properties error:', error);
    res.status(500).json({ 
      message: 'Failed to search properties', 
      error: error.message 
    });
  }
};

// Update property
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Only allow the person who listed it to update
    if (property.listedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    const updates = req.body;
    
    // Reset verification status if significant changes made
    if (updates.title || updates.location || updates.type) {
      updates.verificationStatus = 'needs_verification';
      updates.status = 'pending_review';
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json(updatedProperty);
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ 
      message: 'Failed to update property', 
      error: error.message 
    });
  }
};

// Delete property
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Only allow the person who listed it to delete
    if (property.listedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);
    
    // Also delete associated referral
    await Referral.findOneAndDelete({ propertyId: req.params.id });

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ 
      message: 'Failed to delete property', 
      error: error.message 
    });
  }
};

// Admin: Get pending properties
export const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ 
      verificationStatus: { $in: ['pending', 'needs_verification'] }
    })
    .populate('listedBy', 'fullName username email phone')
    .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    console.error('Get pending properties error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch pending properties', 
      error: error.message 
    });
  }
};

// Admin: Approve property
export const approveProperty = async (req, res) => {
  try {
    const { landlordId, landlordContact } = req.body;
    
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: 'approved',
        status: 'listed',
        landlordId: landlordId || property.landlordId,
        landlordContact: landlordContact || property.landlordContact
      },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ 
      message: 'Property approved successfully', 
      property 
    });
  } catch (error) {
    console.error('Approve property error:', error);
    res.status(500).json({ 
      message: 'Failed to approve property', 
      error: error.message 
    });
  }
};

// Admin: Reject property
export const rejectProperty = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: 'rejected',
        status: 'hidden',
        rejectionReason: reason
      },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ 
      message: 'Property rejected', 
      property 
    });
  } catch (error) {
    console.error('Reject property error:', error);
    res.status(500).json({ 
      message: 'Failed to reject property', 
      error: error.message 
    });
  }
};
