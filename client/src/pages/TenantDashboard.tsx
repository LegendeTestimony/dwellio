import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { tenantApi } from '../services/api';
import type { TenantStats as TenantStatsType } from '../types';
import { FaUser, FaHome, FaFileAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function TenantDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<TenantStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await tenantApi.getDashboardStats();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-700 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-200">Welcome back, {user?.firstName}</p>
            </div>
            <Link
              to="/"
              className="text-white hover:text-gray-200 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Completion Alert */}
        {stats?.profileCompletion?.percentage !== undefined && stats.profileCompletion.percentage < 100 && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-primary-600 mr-3" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-primary-800">
                  Complete Your Profile
                </h3>
                <p className="text-sm text-primary-700 mt-1">
                  Your profile is {stats?.profileCompletion?.percentage}% complete. Complete it to start finding your next home.
                </p>
              </div>
              <Link
                to="/profile"
                className="bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-800"
              >
                Complete Profile
              </Link>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Profile Completion */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-t-4 border-primary-700">
            <div className="flex items-center">
              <FaUser className="text-primary-700 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Profile Completion</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.profileCompletion?.percentage}%</p>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-t-4 border-primary-700">
            <div className="flex items-center">
              <FaCheckCircle className={`text-2xl mr-3 ${
                stats?.verificationStatus === 'verified' ? 'text-primary-700' : 'text-yellow-600'
              }`} />
              <div>
                <p className="text-sm text-gray-600">Verification</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">{stats?.verificationStatus || 'pending'}</p>
              </div>
            </div>
          </div>

          {/* Trustworthiness Score */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 font-bold">★</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Trust Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.trustworthinessScore || 0}/100</p>
              </div>
            </div>
          </div>

          {/* Applications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FaFileAlt className="text-primary-600 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.applications || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Residence */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Residence</h2>
          {stats?.currentResidence ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 font-medium">{stats?.currentResidence?.address}</p>
                <p className="text-gray-600">Lease expires: {stats?.currentResidence?.leaseExpiry}</p>
              </div>
              <Link
                to="/move-out"
                className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
              >
                I Want to Move Out
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <FaHome className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No current residence information</p>
              <Link
                to="/profile"
                className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
              >
                Add Current Residence
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/profile"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <FaUser className="text-primary-600 text-2xl mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Complete Profile</h3>
                <p className="text-gray-600 text-sm">Add documents and verification details</p>
              </div>
            </div>
          </Link>

          <Link
            to="/move-out"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <FaHome className="text-primary-600 text-2xl mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Find New Home</h3>
                <p className="text-gray-600 text-sm">Start your move-out process</p>
              </div>
            </div>
          </Link>

          <Link
            to="/applications"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <FaFileAlt className="text-primary-600 text-2xl mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">My Applications</h3>
                <p className="text-gray-600 text-sm">Track your rental applications</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
