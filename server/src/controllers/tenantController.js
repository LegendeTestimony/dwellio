// dwellio/controllers/tenantController.js
import User from '../models/User.js';
import Application from '../models/Application.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadImage, deleteImage } from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get tenant profile
export const getTenantProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get tenant profile error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch profile', 
      error: error.message 
    });
  }
};

// Update tenant profile
export const updateTenantProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password;
    delete updates.email;
    delete updates.role;
    delete updates.trustScore;
    delete updates.verificationStatus;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update tenant profile error:', error);
    res.status(500).json({ 
      message: 'Failed to update profile', 
      error: error.message 
    });
  }
};

// Upload verification documents
export const uploadVerificationDocument = async (req, res) => {
  try {
    const { documentType } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const allowedTypes = ['id_card', 'utility_bill', 'bank_statement', 'employment_letter', 'passport'];
    if (!allowedTypes.includes(documentType)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    const documentData = {
      type: documentType,
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      uploadDate: new Date(),
      verified: false
    };

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { 'tenantProfile.documents': documentData } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: documentData
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ 
      message: 'Failed to upload document', 
      error: error.message 
    });
  }
};

// Submit move-out intent
export const submitMoveOutIntent = async (req, res) => {
  try {
    const { 
      intendedDate, 
      reason, 
      preferredAreas, 
      budgetRange, 
      propertyType, 
      facilitationRequested 
    } = req.body;

    const moveOutData = {
      'tenantProfile.moveOutIntent': {
        intendedDate,
        reason,
        preferredAreas,
        budgetRange,
        propertyType,
        facilitationRequested,
        status: 'pending'
      }
    };

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: moveOutData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Move-out intent submitted successfully',
      data: user.tenantProfile.moveOutIntent
    });
  } catch (error) {
    console.error('Submit move-out intent error:', error);
    res.status(500).json({ 
      message: 'Failed to submit move-out intent', 
      error: error.message 
    });
  }
};

// Get tenant dashboard stats
export const getTenantDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user profile
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get application statistics
    const applications = await Application.countDocuments({ tenantId: userId });

    // Calculate profile completion
    const profileCompletion = calculateProfileCompletion(user);

    // Get recent applications
    const recentApplications = await Application.find({ tenantId: userId })
      .populate('propertyId', 'title type location rent features')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get application stats by status
    const applicationStats = await Application.aggregate([
      { $match: { tenantId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format current residence data
    const currentResidence = user.tenantProfile?.currentResidence?.address ? {
      address: user.tenantProfile.currentResidence.address,
      leaseExpiry: user.tenantProfile.currentResidence.leaseEndDate
    } : null;

    res.json({
      success: true,
      data: {
        user,
        profileCompletion,
        verificationStatus: user.verificationStatus,
        trustworthinessScore: user.trustScore,
        applications,
        currentResidence,
        applicationStats,
        recentApplications
      }
    });
  } catch (error) {
    console.error('Get tenant dashboard stats error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch dashboard stats', 
      error: error.message 
    });
  }
};

// Helper function to calculate profile completion
function calculateProfileCompletion(user) {
  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'tenantProfile.occupation',
    'tenantProfile.monthlyIncome',
    'tenantProfile.emergencyContactName',
    'tenantProfile.emergencyContactPhone'
  ];

  const optionalFields = [
    'tenantProfile.employerName',
    'tenantProfile.guarantorName',
    'tenantProfile.guarantorPhone',
    'tenantProfile.guarantorEmail',
    'tenantProfile.currentResidence.address',
    'tenantProfile.currentResidence.landlordName',
    'tenantProfile.currentResidence.moveInDate',
    'tenantProfile.currentResidence.leaseEndDate',
    'tenantProfile.houseInfo.description',
    'tenantProfile.houseInfo.propertyType',
    'tenantProfile.houseInfo.size'
  ];

  let completed = 0;
  let total = requiredFields.length + optionalFields.length;

  // Check required fields (weight them more heavily)
  requiredFields.forEach(field => {
    if (getNestedValue(user, field)) {
      completed += 2; // Required fields count as 2 points
    }
  });
  total += requiredFields.length; // Add the extra weight to total

  // Check optional fields
  optionalFields.forEach(field => {
    if (getNestedValue(user, field)) {
      completed++;
    }
  });

  // Check documents (important for verification)
  if (user.tenantProfile?.documents?.length > 0) {
    completed += 2;
  }
  total += 2;

  // Check house features and amenities
  if (user.tenantProfile?.houseInfo?.features?.length > 0) {
    completed++;
  }
  total++;

  if (user.tenantProfile?.houseInfo?.amenities?.length > 0) {
    completed++;
  }
  total++;

  // Check house images
  if (user.tenantProfile?.houseInfo?.images?.length > 0) {
    completed++;
  }
  total++;

  return {
    percentage: Math.round((completed / total) * 100),
    completed,
    total,
    details: {
      requiredFieldsCompleted: requiredFields.filter(field => getNestedValue(user, field)).length,
      totalRequiredFields: requiredFields.length,
      optionalFieldsCompleted: optionalFields.filter(field => getNestedValue(user, field)).length,
      totalOptionalFields: optionalFields.length,
      hasDocuments: (user.tenantProfile?.documents?.length || 0) > 0,
      hasHouseFeatures: (user.tenantProfile?.houseInfo?.features?.length || 0) > 0,
      hasHouseAmenities: (user.tenantProfile?.houseInfo?.amenities?.length || 0) > 0,
      hasHouseImages: (user.tenantProfile?.houseInfo?.images?.length || 0) > 0
    }
  };
}

// Upload house image
export const uploadHouseImage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Image category is required'
      });
    }

    const validCategories = ['aerial_view', 'sitting_room', 'bedroom', 'kitchen', 'bathroom', 'exterior', 'other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image category'
      });
    }

    // Upload to Cloudinary
    const result = await uploadImage(req.file.buffer, {
      folder: `dwellio/house-images/${userId}`,
      public_id: `${category}_${Date.now()}`
    });

    // Create image object
    const newImage = {
      id: result.public_id,
      category,
      url: result.secure_url,
      publicId: result.public_id,
      fileName: req.file.originalname,
      uploadedAt: new Date()
    };

    // Update user's house info
    const user = await User.findById(userId);
    if (!user.tenantProfile) {
      user.tenantProfile = {};
    }
    if (!user.tenantProfile.houseInfo) {
      user.tenantProfile.houseInfo = { images: [] };
    }
    if (!user.tenantProfile.houseInfo.images) {
      user.tenantProfile.houseInfo.images = [];
    }

    user.tenantProfile.houseInfo.images.push(newImage);
    await user.save();

    res.json({
      success: true,
      data: {
        id: result.public_id,
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    console.error('Upload house image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload house image',
      error: error.message
    });
  }
};

// Delete house image
export const deleteHouseImage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { imageId } = req.params;

    const user = await User.findById(userId);
    if (!user.tenantProfile?.houseInfo?.images) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    const imageIndex = user.tenantProfile.houseInfo.images.findIndex(img => img.id === imageId);
    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    const image = user.tenantProfile.houseInfo.images[imageIndex];

    // Delete from Cloudinary
    await deleteImage(image.publicId);

    // Remove from user's house info
    user.tenantProfile.houseInfo.images.splice(imageIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete house image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete house image',
      error: error.message
    });
  }
};

// Helper function to get nested object values
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}
