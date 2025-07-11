import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { tenantApi } from '../services/api';
import type { TenantStats as TenantStatsType } from '../types';
import { FaUser, FaHome, FaFileAlt, FaCheckCircle, FaExclamationTriangle, FaCreditCard, FaCalendarAlt, FaShieldAlt, FaBell, FaMoneyBillWave } from 'react-icons/fa';

// Extended types for demo data
interface RecentActivity {
  type: 'application' | 'payment' | 'document';
  title: string;
  description: string;
  date: string;
}

interface Payment {
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}

interface ExtendedResidence {
  name: string;
  imageUrl: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  leaseStart: string;
  leaseEnd: string;
  rent: number;
  landlordName: string;
  landlordAvatar: string;
}

// Extended TenantStats with demo data
interface ExtendedTenantStats extends TenantStatsType {
  recentActivity?: RecentActivity[];
  upcomingPayments?: Payment[];
  currentResidence?: ExtendedResidence | null;
}

// Sample data to extend the basic TenantStats interface for demonstration
const demoData = {
  recentActivity: [
    {
      type: 'application',
      title: 'Application Submitted',
      description: 'Your application for 3-Bedroom Apartment in Lekki has been submitted',
      date: new Date().toISOString()
    },
    {
      type: 'payment',
      title: 'Rent Payment',
      description: 'You successfully paid ₦450,000 for your monthly rent',
      date: new Date(Date.now() - 86400000 * 3).toISOString() // 3 days ago
    },
    {
      type: 'document',
      title: 'Document Verified',
      description: 'Your employment letter has been verified',
      date: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
    }
  ],
  upcomingPayments: [
    {
      description: 'Monthly Rent',
      amount: 450000,
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
      status: 'pending'
    },
    {
      description: 'Service Charge',
      amount: 50000,
      dueDate: new Date(Date.now() + 86400000 * 10).toISOString(), // 10 days from now
      status: 'pending'
    },
    {
      description: 'Security Deposit',
      amount: 200000,
      dueDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      status: 'paid'
    }
  ],
  // Extended residence data for demo
  extendedResidence: {
    name: 'Luxury 3-Bedroom Apartment',
    imageUrl: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2070',
    address: 'Lekki Phase 1, Lagos',
    bedrooms: 3,
    bathrooms: 2,
    leaseStart: new Date(Date.now() - 86400000 * 180).toISOString(), // 180 days ago
    leaseEnd: new Date(Date.now() + 86400000 * 180).toISOString(), // 180 days from now
    rent: 450000,
    landlordName: 'Michael Johnson',
    landlordAvatar: 'https://randomuser.me/api/portraits/men/64.jpg'
  }
};

// Utility function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Utility function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(amount);
};

export default function TenantDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ExtendedTenantStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await tenantApi.getDashboardStats();
        if (response.success && response.data) {
          // Combine API data with demo data for visualization purposes
          setStats({
            ...response.data,
            recentActivity: demoData.recentActivity,
            upcomingPayments: demoData.upcomingPayments,
            // If we have currentResidence data from the API, enhance it with demo data
            // otherwise use demo data directly
            currentResidence: response.data.currentResidence
              ? {
                  ...response.data.currentResidence,
                  ...demoData.extendedResidence
                }
              : demoData.extendedResidence as any
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        
        // Set demo data if API fails
        setStats({
          user: user as any,
          profileCompletion: { percentage: 65, completed: 13, total: 20 },
          verificationStatus: 'pending',
          trustworthinessScore: 78,
          applications: 2,
          currentResidence: demoData.extendedResidence as any,
          applicationStats: [],
          recentApplications: [],
          recentActivity: demoData.recentActivity,
          upcomingPayments: demoData.upcomingPayments,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-aztec-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-aztec-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-white">Tenant Dashboard</h1>
              <p className="text-aztec-200">Welcome back, {user?.firstName}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/move-out"
                className="px-4 py-2 rounded-lg bg-white text-aztec-800 font-medium hover:bg-gray-100 transition-colors shadow-sm"
              >
                Move Out Intent
              </Link>
              <Link
                to="/"
                className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white/10 transition-colors font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Completion Alert */}
        {stats?.profileCompletion?.percentage !== undefined && stats.profileCompletion.percentage < 100 && (
          <div className="bg-aztec-50 border-l-4 border-aztec-600 rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-aztec-600 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-aztec-800">
                  Complete Your Profile
                </h3>
                <p className="text-sm text-aztec-700 mt-1">
                  Your profile is {stats?.profileCompletion?.percentage}% complete. Complete it to start finding your next home.
                </p>
              </div>
              <Link
                to="/profile"
                className="flex-shrink-0 bg-aztec-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-aztec-800 transition-colors"
              >
                Complete Profile
              </Link>
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats Cards and Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Profile Completion */}
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 border-t-4 border-aztec-700">
                <div className="flex items-center">
                  <div className="bg-aztec-100 p-3 rounded-full mr-4">
                    <FaUser className="text-aztec-700 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Profile Completion</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.profileCompletion?.percentage}%</p>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-aztec-600 h-2.5 rounded-full" 
                    style={{ width: `${stats?.profileCompletion?.percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Verification Status */}
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 border-t-4 border-aztec-700">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full mr-4 ${
                    stats?.verificationStatus === 'verified' ? 'bg-aztec-100' : 'bg-yellow-100'
                  }`}>
                    {stats?.verificationStatus === 'verified' ? (
                      <FaCheckCircle className="text-aztec-700 text-xl" />
                    ) : (
                      <FaShieldAlt className="text-yellow-600 text-xl" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Verification</p>
                    <p className="text-lg font-bold text-gray-900 capitalize">{stats?.verificationStatus}</p>
                  </div>
                </div>
              </div>

              {/* Trustworthiness Score */}
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 border-t-4 border-aztec-700">
                <div className="flex items-center">
                  <div className="bg-aztec-100 p-3 rounded-full mr-4">
                    <FaShieldAlt className="text-aztec-700 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trust Score</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.trustworthinessScore}</p>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      stats?.trustworthinessScore && stats.trustworthinessScore >= 70 
                        ? 'bg-aztec-600' 
                        : stats?.trustworthinessScore && stats.trustworthinessScore >= 40 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                    }`} 
                    style={{ width: `${stats?.trustworthinessScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <button className="text-aztec-600 hover:text-aztec-800 text-sm font-medium">
                  View All
                </button>
              </div>
              
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start p-3 rounded-lg hover:bg-aztec-50 transition-colors">
                      <div className={`p-2 rounded-full mr-4 ${
                        activity.type === 'application' 
                          ? 'bg-aztec-100 text-aztec-700' 
                          : activity.type === 'payment' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                      }`}>
                        {activity.type === 'application' ? (
                          <FaFileAlt className="text-lg" />
                        ) : activity.type === 'payment' ? (
                          <FaMoneyBillWave className="text-lg" />
                        ) : (
                          <FaCheckCircle className="text-lg" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{activity.title}</h3>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(activity.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaBell className="mx-auto text-3xl mb-3 text-gray-400" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>

            {/* Upcoming Payments */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Payments</h2>
                <button className="text-aztec-600 hover:text-aztec-800 text-sm font-medium">
                  View All
                </button>
              </div>
              
              {stats?.upcomingPayments && stats.upcomingPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.upcomingPayments.map((payment, index) => (
                        <tr key={index} className="hover:bg-aztec-50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {payment.description}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(payment.dueDate)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              payment.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : payment.status === 'overdue' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaCreditCard className="mx-auto text-3xl mb-3 text-gray-400" />
                  <p>No upcoming payments</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Current Residence */}
          <div className="lg:col-span-1 space-y-8">
            {/* Current Residence Card */}
            {stats?.currentResidence ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={stats.currentResidence.imageUrl} 
                    alt={stats.currentResidence.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h2 className="text-xl font-bold">{stats.currentResidence.name}</h2>
                    <p className="text-sm">{stats.currentResidence.address}</p>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Property Details */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium">{stats.currentResidence.bedrooms} Bedrooms</span>
                      <span className="mx-2">•</span>
                      <span className="font-medium">{stats.currentResidence.bathrooms} Bathrooms</span>
                    </div>
                    <span className="font-bold text-aztec-700">{formatCurrency(stats.currentResidence.rent)}/month</span>
                  </div>
                  
                  {/* Lease Information */}
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Lease Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Start Date</p>
                        <p className="font-medium">{formatDate(stats.currentResidence.leaseStart)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">End Date</p>
                        <p className="font-medium">{formatDate(stats.currentResidence.leaseEnd)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Landlord Information */}
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Landlord</h3>
                    <div className="flex items-center">
                      <img 
                        src={stats.currentResidence.landlordAvatar} 
                        alt={stats.currentResidence.landlordName} 
                        className="w-10 h-10 rounded-full mr-3 border border-gray-200"
                      />
                      <div>
                        <p className="font-medium">{stats.currentResidence.landlordName}</p>
                        <p className="text-xs text-gray-500">Contact via Dwellio</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between gap-4">
                      <Link 
                        to="/property-details" 
                        className="flex-1 py-2 px-4 bg-white border border-aztec-600 text-aztec-700 rounded-md text-sm font-medium hover:bg-aztec-50 transition-colors text-center"
                      >
                        View Details
                      </Link>
                      <Link 
                        to="/move-out" 
                        className="flex-1 py-2 px-4 bg-aztec-700 text-white rounded-md text-sm font-medium hover:bg-aztec-800 transition-colors text-center"
                      >
                        Move Out
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <FaHome className="mx-auto text-4xl mb-4 text-aztec-400" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Current Residence</h3>
                <p className="text-gray-600 mb-6">You haven't registered a current residence yet.</p>
                <Link
                  to="/profile"
                  className="inline-block bg-aztec-700 text-white py-2 px-6 rounded-md font-medium hover:bg-aztec-800 transition-colors"
                >
                  Update Profile
                </Link>
              </div>
            )}
            
            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Link
                  to="/my-applications"
                  className="flex items-center p-3 rounded-md hover:bg-aztec-50 transition-colors"
                >
                  <div className="bg-aztec-100 p-2 rounded-md mr-3">
                    <FaFileAlt className="text-aztec-700" />
                  </div>
                  <span className="text-gray-800">My Applications</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center p-3 rounded-md hover:bg-aztec-50 transition-colors"
                >
                  <div className="bg-aztec-100 p-2 rounded-md mr-3">
                    <FaUser className="text-aztec-700" />
                  </div>
                  <span className="text-gray-800">My Profile</span>
                </Link>
                <Link
                  to="/payment-history"
                  className="flex items-center p-3 rounded-md hover:bg-aztec-50 transition-colors"
                >
                  <div className="bg-aztec-100 p-2 rounded-md mr-3">
                    <FaCreditCard className="text-aztec-700" />
                  </div>
                  <span className="text-gray-800">Payment History</span>
                </Link>
                <Link
                  to="/my-documents"
                  className="flex items-center p-3 rounded-md hover:bg-aztec-50 transition-colors"
                >
                  <div className="bg-aztec-100 p-2 rounded-md mr-3">
                    <FaFileAlt className="text-aztec-700" />
                  </div>
                  <span className="text-gray-800">My Documents</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
