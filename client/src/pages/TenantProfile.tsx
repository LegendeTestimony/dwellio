import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { tenantApi } from '../services/api';
import { FaUpload, FaCheck, FaExclamationTriangle, FaUser, FaHome, FaFileAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import type { Document, User } from '../types';

interface CurrentResidence {
  address: string;
  landlordName?: string;
  landlordPhone?: string;
  moveInDate?: string;
  leaseEndDate?: string;
}

interface PersonalInfoForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  occupation: string;
  monthlyIncome: string;
  employerName: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}

export default function TenantProfile() {
  const { user, updateUserContext } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'documents' | 'residence'>('personal');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoForm>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    occupation: user?.tenantProfile?.occupation || '',
    monthlyIncome: user?.tenantProfile?.monthlyIncome?.toString() || '',
    employerName: user?.tenantProfile?.employerName || '',
    emergencyContactName: user?.tenantProfile?.emergencyContactName || '',
    emergencyContactPhone: user?.tenantProfile?.emergencyContactPhone || '',
    emergencyContactRelationship: ''
  });

  // Residence Form State
  const [residenceForm, setResidenceForm] = useState<CurrentResidence>({
    address: user?.tenantProfile?.currentResidence?.address || '',
    landlordName: user?.tenantProfile?.currentResidence?.landlordName || '',
    landlordPhone: user?.tenantProfile?.currentResidence?.landlordPhone || '',
    moveInDate: user?.tenantProfile?.currentResidence?.moveInDate || '',
    leaseEndDate: user?.tenantProfile?.currentResidence?.leaseEndDate || ''
  });

  useEffect(() => {
    // Load profile data and calculate completion
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await tenantApi.getProfile();
        
        if (response.success && response.data) {
          const userData = response.data as User;
          
          // Update personal info
          setPersonalInfo({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || '',
            occupation: userData.tenantProfile?.occupation || '',
            monthlyIncome: userData.tenantProfile?.monthlyIncome?.toString() || '',
            employerName: userData.tenantProfile?.employerName || '',
            emergencyContactName: userData.tenantProfile?.emergencyContactName || '',
            emergencyContactPhone: userData.tenantProfile?.emergencyContactPhone || '',
            emergencyContactRelationship: ''
          });
          
          // Update residence form
          setResidenceForm({
            address: userData.tenantProfile?.currentResidence?.address || '',
            landlordName: userData.tenantProfile?.currentResidence?.landlordName || '',
            landlordPhone: userData.tenantProfile?.currentResidence?.landlordPhone || '',
            moveInDate: userData.tenantProfile?.currentResidence?.moveInDate || '',
            leaseEndDate: userData.tenantProfile?.currentResidence?.leaseEndDate || ''
          });
          
          // Set documents
          setDocuments(userData.tenantProfile?.documents || []);
          
          // Update user context
          updateUserContext(userData);
          
          // Get profile completion percentage from dashboard stats
          const statsResponse = await tenantApi.getDashboardStats();
          if (statsResponse.success && statsResponse.data) {
            setProfileCompletion(statsResponse.data.profileCompletion?.percentage || 0);
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [updateUserContext]);

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updateData = {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        phoneNumber: personalInfo.phoneNumber,
        tenantProfile: {
          occupation: personalInfo.occupation,
          monthlyIncome: parseInt(personalInfo.monthlyIncome, 10),
          employerName: personalInfo.employerName,
          emergencyContactName: personalInfo.emergencyContactName,
          emergencyContactPhone: personalInfo.emergencyContactPhone
        }
      };
      
      const response = await tenantApi.updateProfile(updateData);
      
      if (response.success) {
        toast.success('Personal information updated successfully!');
        // Refresh profile data
        const profileResponse = await tenantApi.getProfile();
        if (profileResponse.success && profileResponse.data) {
          updateUserContext(profileResponse.data);
        }
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleResidenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updateData = {
        tenantProfile: {
          currentResidence: {
            address: residenceForm.address,
            landlordName: residenceForm.landlordName,
            landlordPhone: residenceForm.landlordPhone,
            moveInDate: residenceForm.moveInDate,
            leaseEndDate: residenceForm.leaseEndDate
          }
        }
      };
      
      const response = await tenantApi.updateProfile(updateData);
      
      if (response.success) {
        toast.success('Residence information updated successfully!');
        // Refresh profile data
        const profileResponse = await tenantApi.getProfile();
        if (profileResponse.success && profileResponse.data) {
          updateUserContext(profileResponse.data);
        }
      } else {
        toast.error('Failed to update residence information');
      }
    } catch (error) {
      console.error('Failed to update residence:', error);
      toast.error('Failed to update residence information');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (documentType: string, file: File) => {
    setLoading(true);
    
    try {
      const response = await tenantApi.uploadDocument(file, documentType);
      
      if (response.success && response.data) {
        toast.success('Document uploaded successfully!');
        // Refresh profile data to get updated documents
        const profileResponse = await tenantApi.getProfile();
        if (profileResponse.success && profileResponse.data) {
          setDocuments(profileResponse.data.tenantProfile?.documents || []);
          updateUserContext(profileResponse.data);
        }
      } else {
        toast.error('Failed to upload document');
      }
    } catch (error) {
      console.error('Failed to upload document:', error);
      toast.error('Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const getDocumentStatus = (type: Document['type']) => {
    const doc = documents.find(d => d.type === type);
    if (!doc) return 'missing';
    if (doc.status) return doc.status;
    return doc.verified ? 'verified' : 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <FaCheck className="text-primary-600" />;
      case 'pending':
        return <FaExclamationTriangle className="text-yellow-600" />;
      case 'rejected':
        return <FaExclamationTriangle className="text-red-600" />;
      default:
        return <FaUpload className="text-gray-400" />;
    }
  };

  const DocumentUploadSection = ({ type, title, description }: { type: Document['type'], title: string, description: string }) => {
    const status = getDocumentStatus(type);
    
    return (
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{title}</h3>
          {getStatusIcon(status)}
        </div>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleDocumentUpload(type, file);
            }
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
        {status !== 'missing' && (
          <p className="text-sm text-gray-600 mt-2">
            Status: <span className={`font-medium ${status === 'verified' ? 'text-primary-600' : status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
              {status}
            </span>
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tenant Profile</h1>
              <p className="text-gray-600">Complete your profile to get started</p>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Completion */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Profile Completion</h2>
            <span className="text-2xl font-bold text-green-600">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('personal')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'personal'
                    ? 'border-primary-600 text-primary-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaUser className="inline mr-2" />
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-primary-600 text-primary-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaFileAlt className="inline mr-2" />
                Documents
              </button>
              <button
                onClick={() => setActiveTab('residence')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'residence'
                    ? 'border-primary-600 text-primary-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaHome className="inline mr-2" />
                Current Residence
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={personalInfo.firstName}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={personalInfo.phoneNumber}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Occupation *
                    </label>
                    <input
                      type="text"
                      value={personalInfo.occupation}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, occupation: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Income (₦) *
                    </label>
                    <input
                      type="number"
                      value={personalInfo.monthlyIncome}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employer Name
                    </label>
                    <input
                      type="text"
                      value={personalInfo.employerName}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, employerName: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      value={personalInfo.emergencyContactName}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={personalInfo.emergencyContactPhone}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact Relationship
                    </label>
                    <input
                      type="text"
                      value={personalInfo.emergencyContactRelationship}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, emergencyContactRelationship: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary-700 text-white px-6 py-3 rounded-md hover:bg-primary-800 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Personal Information'}
                  </button>
                </div>
              </form>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DocumentUploadSection
                    type="id_card"
                    title="Valid ID"
                    description="Upload your National ID, International Passport, or Driver's License"
                  />
                  <DocumentUploadSection
                    type="bank_statement"
                    title="Bank Statement"
                    description="Last 3 months bank statement"
                  />
                  <DocumentUploadSection
                    type="employment_letter"
                    title="Employment Letter"
                    description="Letter from your employer confirming your employment"
                  />
                  <DocumentUploadSection
                    type="utility_bill"
                    title="Utility Bill"
                    description="Recent utility bill (electricity, water, etc.)"
                  />
                </div>
              </div>
            )}

            {/* Current Residence Tab */}
            {activeTab === 'residence' && (
              <form onSubmit={handleResidenceSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Address *
                    </label>
                    <input
                      type="text"
                      value={residenceForm.address}
                      onChange={(e) => setResidenceForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Landlord Name
                    </label>
                    <input
                      type="text"
                      value={residenceForm.landlordName}
                      onChange={(e) => setResidenceForm(prev => ({ ...prev, landlordName: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Landlord Phone
                    </label>
                    <input
                      type="tel"
                      value={residenceForm.landlordPhone}
                      onChange={(e) => setResidenceForm(prev => ({ ...prev, landlordPhone: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Move-In Date
                    </label>
                    <input
                      type="date"
                      value={residenceForm.moveInDate}
                      onChange={(e) => setResidenceForm(prev => ({ ...prev, moveInDate: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lease End Date
                    </label>
                    <input
                      type="date"
                      value={residenceForm.leaseEndDate}
                      onChange={(e) => setResidenceForm(prev => ({ ...prev, leaseEndDate: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary-700 text-white px-6 py-3 rounded-md hover:bg-primary-800 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Residence Information'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
