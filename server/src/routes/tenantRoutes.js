// dwellio/routes/tenantRoutes.js
import express from 'express';
import {
  getTenantProfile,
  updateTenantProfile,
  uploadVerificationDocument,
  submitMoveOutIntent,
  getTenantDashboardStats
} from '../controllers/tenantController.js';
import { requireAuth } from '../controllers/authController.js';
import { uploadSingleFile } from '../middleware/upload.js';

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

export default router;
