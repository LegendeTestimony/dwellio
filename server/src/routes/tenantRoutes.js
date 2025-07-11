// dwellio/routes/tenantRoutes.js
import express from 'express';
import {
  getTenantProfile,
  updateTenantProfile,
  uploadVerificationDocument,
  submitMoveOutIntent,
  getTenantDashboardStats,
  uploadHouseImage,
  deleteHouseImage
} from '../controllers/tenantController.js';
import { requireAuth } from '../controllers/authController.js';
import { uploadSingleFile } from '../middleware/upload.js';
import { uploadSingleImage } from '../middleware/houseImageUpload.js';

const router = express.Router();

// All tenant routes require authentication
router.use(requireAuth);

// Profile management
router.get('/profile', getTenantProfile);
router.put('/profile', updateTenantProfile);

// Document upload
router.post('/documents', uploadSingleFile, uploadVerificationDocument);

// Move-out intent
router.post('/move-out-intent', submitMoveOutIntent);

// Dashboard stats
router.get('/dashboard/stats', getTenantDashboardStats);

// House image management
router.post('/house-images', uploadSingleImage, uploadHouseImage);
router.delete('/house-images/:imageId', deleteHouseImage);

export default router;
