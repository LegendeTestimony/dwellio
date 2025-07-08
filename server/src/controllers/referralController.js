// dwellio/controllers/referralController.js
import Referral from '../models/Referral.js';
import Commission from '../models/Commission.js';
import Property from '../models/Property.js';
import User from '../models/User.js';

// Get user's referrals
export const getUserReferrals = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { referrerId: req.user.userId };
    if (status) query.status = status;

    const referrals = await Referral.find(query)
      .populate({
        path: 'propertyId',
        select: 'title type location media status verificationStatus'
      })
      .populate('tenantId', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Referral.countDocuments(query);

    res.json({
      referrals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user referrals error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch referrals', 
      error: error.message 
    });
  }
};

// Get referral statistics
export const getReferralStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get counts by status
    const stats = await Referral.aggregate([
      { $match: { referrerId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalCommission: { $sum: '$commissionAmount' }
        }
      }
    ]);

    // Get total statistics
    const totalReferrals = await Referral.countDocuments({ referrerId: userId });
    const totalCommissionEarned = await Commission.aggregate([
      { 
        $match: { 
          referrerId: userId,
          status: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const pendingCommissions = await Commission.aggregate([
      { 
        $match: { 
          referrerId: userId,
          status: { $in: ['pending', 'approved'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Recent activity
    const recentReferrals = await Referral.find({ referrerId: userId })
      .populate('propertyId', 'title type location')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalReferrals,
      totalCommissionEarned: totalCommissionEarned[0]?.total || 0,
      pendingCommissions: pendingCommissions[0]?.total || 0,
      statusBreakdown: stats,
      recentActivity: recentReferrals
    });
  } catch (error) {
    console.error('Get referral stats error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch referral statistics', 
      error: error.message 
    });
  }
};

// Get user's commission history
export const getUserCommissions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { referrerId: req.user.userId };
    if (status) query.status = status;

    const commissions = await Commission.find(query)
      .populate({
        path: 'propertyId',
        select: 'title type location'
      })
      .populate('tenantId', 'fullName email')
      .populate('approvedBy', 'fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Commission.countDocuments(query);

    // Summary
    const summary = await Commission.aggregate([
      { $match: { referrerId: req.user.userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      commissions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      summary
    });
  } catch (error) {
    console.error('Get user commissions error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch commissions', 
      error: error.message 
    });
  }
};

// Update payout details
export const updatePayoutDetails = async (req, res) => {
  try {
    const { accountName, accountNumber, bankName, bankCode } = req.body;

    if (!accountName || !accountNumber || !bankName) {
      return res.status(400).json({ 
        message: 'Account name, number, and bank name are required' 
      });
    }

    // Update user's payout details
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        $set: {
          'payoutDetails.accountName': accountName,
          'payoutDetails.accountNumber': accountNumber,
          'payoutDetails.bankName': bankName,
          'payoutDetails.bankCode': bankCode
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Payout details updated successfully',
      payoutDetails: user.payoutDetails
    });
  } catch (error) {
    console.error('Update payout details error:', error);
    res.status(500).json({ 
      message: 'Failed to update payout details', 
      error: error.message 
    });
  }
};
