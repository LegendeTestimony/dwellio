// dwellio/routes/referralRoutes.js
import express from 'express';
import {
  getUserReferrals,
  getReferralStats,
  getUserCommissions,
  updatePayoutDetails
} from '../controllers/referralController.js';
import { requireAuth } from '../controllers/authController.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// User referral routes
router.get('/my-referrals', getUserReferrals); // Get user's referrals
router.get('/my-stats', getReferralStats); // Get referral statistics
router.get('/my-commissions', getUserCommissions); // Get commission history
router.put('/payout-details', updatePayoutDetails); // Update bank details

export default router;
