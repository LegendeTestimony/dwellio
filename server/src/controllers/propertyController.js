// dwellio/controllers/propertyController.js
import Property from '../models/Property.js';
import User from '../models/User.js';
import Application from '../models/Application.js';

// Get all available properties (for tenant browsing)
const getAvailableProperties = async (req, res) => {
  try {
    const { page = 1, limit = 12, type, city, lga, minRent, maxRent } = req.query;
    
    const query = {
      status: 'available',
      isActive: true
    };

    // Apply filters
    if (type) query.type = type;
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (lga) query['location.lga'] = { $regex: lga, $options: 'i' };
    if (minRent || maxRent) {
      query['rent.amount'] = {};
      if (minRent) query['rent.amount'].$gte = parseInt(minRent);
      if (maxRent) query['rent.amount'].$lte = parseInt(maxRent);
    }
    
    const properties = await Property.find(query)
      .populate('landlordId', 'fullName phoneNumber email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Property.countDocuments(query);

    res.json({
      success: true,
      data: properties,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get available properties error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch properties', 
      error: error.message 
    });
  }
};

// Get single property details
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('landlordId', 'fullName phoneNumber email');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Only show available properties
    if (property.status !== 'available' || !property.isActive) {
      return res.status(404).json({ message: 'Property not available' });
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch property', 
      error: error.message 
    });
  }
};

// Submit application for a property
const submitApplication = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { moveInDate, monthlyBudget, occupancy, tenantMessage, urgency } = req.body;
    
    // Validate property exists and is available
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    if (property.status !== 'available') {
      return res.status(400).json({ message: 'Property is not available for application' });
    }

    // Check if tenant already has pending application for this property
    const existingApplication = await Application.findOne({
      tenantId: req.user.userId,
      propertyId: propertyId,
      status: { $in: ['pending', 'reviewing'] }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You already have a pending application for this property' });
    }

    // Create application
    const application = new Application({
      tenantId: req.user.userId,
      propertyId: propertyId,
      landlordId: property.landlordId,
      applicationData: {
        moveInDate,
        monthlyBudget,
        occupancy,
        tenantMessage,
        urgency
      }
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ 
      message: 'Failed to submit application', 
      error: error.message 
    });
  }
};

// Get tenant's applications
const getMyApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { tenantId: req.user.userId };
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate({
        path: 'propertyId',
        select: 'title type location media rent deposit'
      })
      .populate('landlordId', 'fullName phoneNumber email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      data: applications,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch applications', 
      error: error.message 
    });
  }
};

// Withdraw application
const withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await Application.findOne({
      _id: applicationId,
      tenantId: req.user.userId
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status !== 'pending' && application.status !== 'reviewing') {
      return res.status(400).json({ message: 'Cannot withdraw application in current status' });
    }

    application.status = 'withdrawn';
    await application.save();

    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ 
      message: 'Failed to withdraw application', 
      error: error.message 
    });
  }
};

// Search properties
const searchProperties = async (req, res) => {
  try {
    const { 
      q, 
      type, 
      city, 
      lga, 
      minRent, 
      maxRent,
      page = 1, 
      limit = 12 
    } = req.query;

    const query = {
      status: 'available',
      isActive: true
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
    if (minRent || maxRent) {
      query['rent.amount'] = {};
      if (minRent) query['rent.amount'].$gte = parseInt(minRent);
      if (maxRent) query['rent.amount'].$lte = parseInt(maxRent);
    }

    const properties = await Property.find(query)
      .populate('landlordId', 'fullName phoneNumber email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Property.countDocuments(query);

    res.json({
      success: true,
      data: properties,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
        limit: parseInt(limit)
      },
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

// Export all controller methods
export {
  getAvailableProperties,
  getPropertyById,
  submitApplication,
  getMyApplications,
  withdrawApplication,
  searchProperties
};
