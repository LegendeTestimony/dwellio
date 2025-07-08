// dwellio/routes/propertyRoutes.js
import express from 'express';
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getPropertiesByUser,
  approveProperty,
  rejectProperty,
  getPendingProperties,
  searchProperties
} from '../controllers/propertyController.js';
import { requireAuth, requireRole } from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.get('/search', searchProperties); // Search properties
router.get('/', getAllProperties); // Get all approved properties
router.get('/:id', getPropertyById); // Get single property

// Protected routes - Any authenticated user can list
router.post('/', requireAuth, createProperty); // Create property listing
router.get('/user/my-listings', requireAuth, getPropertiesByUser); // Get user's listings
router.put('/:id', requireAuth, updateProperty); // Update property
router.delete('/:id', requireAuth, deleteProperty); // Delete property

// Admin routes
router.get('/admin/pending', requireAuth, requireRole('admin'), getPendingProperties);
router.put('/admin/:id/approve', requireAuth, requireRole('admin'), approveProperty);
router.put('/admin/:id/reject', requireAuth, requireRole('admin'), rejectProperty);

export default router;
