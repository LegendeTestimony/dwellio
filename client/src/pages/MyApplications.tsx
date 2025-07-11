import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { propertiesApi } from '../services/api';
import { FaEye, FaFileAlt, FaClock, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import type { Application } from '../types';

export default function MyApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        const response = await propertiesApi.getMyApplications();
        
        if (response.success && response.data) {
          setApplications(response.data);
        }
      } catch (error) {
        console.error('Failed to load applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const handleWithdrawApplication = async (applicationId: string) => {
    if (!confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      const response = await propertiesApi.withdrawApplication(applicationId);
      
      if (response.success) {
        toast.success('Application withdrawn successfully');
        // Refresh applications
        const refreshResponse = await propertiesApi.getMyApplications();
        if (refreshResponse.success && refreshResponse.data) {
          setApplications(refreshResponse.data);
        }
      } else {
        toast.error('Failed to withdraw application');
      }
    } catch (error) {
      console.error('Failed to withdraw application:', error);
      toast.error('Failed to withdraw application');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-yellow-600" />;
      case 'approved':
        return <FaCheck className="text-green-600" />;
      case 'rejected':
        return <FaTimes className="text-red-600" />;
      default:
        return <FaSpinner className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => 
    filter === 'all' || app.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
              <p className="text-gray-600">Track your property applications</p>
            </div>
            <Link
              to="/dashboard"
              className="text-primary-700 hover:text-primary-800 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { key: 'all', label: 'All Applications' },
                { key: 'pending', label: 'Pending' },
                { key: 'approved', label: 'Approved' },
                { key: 'rejected', label: 'Rejected' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-primary-600 text-primary-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaFileAlt className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't submitted any property applications yet." 
                : `You don't have any ${filter} applications.`}
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map(application => (
              <div key={application._id} className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.propertyId?.title || 'Property Title'}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Property Type:</strong> {application.propertyId?.type || 'N/A'}</p>
                        <p><strong>Location:</strong> {application.propertyId?.location || 'N/A'}</p>
                        <p><strong>Rent:</strong> ₦{application.propertyId?.rent?.toLocaleString() || 'N/A'}/month</p>
                        <p><strong>Applied On:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
                      </div>

                      {application.message && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-700">
                            <strong>Your Message:</strong> {application.message}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 ml-4">
                      <Link
                        to={`/properties/${application.propertyId?._id}`}
                        className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <FaEye className="mr-2" />
                        View Property
                      </Link>
                      
                      {application.status === 'pending' && (
                        <button
                          onClick={() => handleWithdrawApplication(application._id)}
                          className="inline-flex items-center px-3 py-2 text-sm border border-red-300 rounded-md text-red-700 bg-white hover:bg-red-50"
                        >
                          <FaTimes className="mr-2" />
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}