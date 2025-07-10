// dwellio/routes/propertyRoutes.js
import express from 'express';
import {
  getAvailableProperties,
  getPropertyById,
  submitApplication,
  getMyApplications,
  withdrawApplication,
  searchProperties
} from '../controllers/propertyController.js';
import { requireAuth } from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.get('/', getAvailableProperties); // Get all available properties
router.get('/search', searchProperties); // Search properties
router.get('/:id', getPropertyById); // Get single property

// Protected routes - Tenant actions
router.post('/:propertyId/apply', requireAuth, submitApplication); // Submit application
router.get('/applications/my', requireAuth, getMyApplications); // Get my applications
router.put('/applications/:applicationId/withdraw', requireAuth, withdrawApplication); // Withdraw application

export default router;
