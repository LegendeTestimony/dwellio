import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaCalendar, FaMapMarkerAlt, FaMoneyBillWave, FaUser } from 'react-icons/fa';
import { propertiesApi } from '../services/api';
import { toast } from 'react-toastify';
import type { Application } from '../types';

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    // Fetch applications from API
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await propertiesApi.getMyApplications();
        
        if (response.success && response.data) {
          setApplications(response.data);
        } else {
          toast.error('Failed to load applications');
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-primary-100 text-primary-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'reviewing':
        return 'Under Review';
      case 'withdrawn':
        return 'Withdrawn';
      default:
        return 'Pending';
    }
  };

  const filteredApplications = applications.filter(app => 
    filter === 'all' || 
    (filter === 'pending' && (app.status === 'pending' || app.status === 'reviewing')) ||
    app.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
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
              <p className="text-gray-600">Track your rental applications and their status</p>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FaEye className="text-primary-600 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FaCalendar className="text-yellow-600 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'pending' || app.status === 'reviewing').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 font-bold">✓</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 font-bold">✗</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-green-700 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Applications
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'pending' 
                  ? 'bg-green-700 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'approved' 
                  ? 'bg-green-700 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'rejected' 
                  ? 'bg-green-700 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaEye className="text-gray-400 text-5xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't applied to any properties yet." 
                : `No ${filter} applications found.`}
            </p>
            <Link
              to="/move-out"
              className="bg-primary-700 text-white px-6 py-3 rounded-md hover:bg-primary-800 transition-colors"
            >
              Start Looking for Properties
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application) => {
              // Get property info
              const property = typeof application.propertyId === 'object' ? application.propertyId : null;
              const propertyTitle = property?.title || 'Property';
              const propertyAddress = property?.location?.address || 'No address available';
              const propertyRent = property?.rent?.amount || 0;
              
              return (
              <div key={application._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {propertyTitle}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{propertyAddress}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaMoneyBillWave className="mr-2" />
                      <span>₦{propertyRent.toLocaleString()}/year</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaCalendar className="mr-2" />
                      <span>Move-in: {new Date(application.applicationData.moveInDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {getStatusText(application.status)}
                    </span>
                    <p className="text-sm text-gray-500 mt-2">
                      Applied: {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <FaUser className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      Budget: ₦{application.applicationData.monthlyBudget.toLocaleString()}/month
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 bg-blue-500`}></div>
                    <span className="text-sm text-gray-600">
                      Urgency: {application.applicationData.urgency}
                    </span>
                  </div>
                </div>

                {/* Notes/Message */}
                {application.applicationData.tenantMessage && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Your Message</h4>
                    <p className="text-sm text-gray-700">{application.applicationData.tenantMessage}</p>
                  </div>
                )}
                
                {/* Review Notes */}
                {application.reviewNotes && (
                  <div className="bg-blue-50 rounded-lg p-4 mt-3">
                    <h4 className="font-medium text-gray-900 mb-2">Landlord Response</h4>
                    <p className="text-sm text-gray-700">{application.reviewNotes}</p>
                  </div>
                )}
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}
