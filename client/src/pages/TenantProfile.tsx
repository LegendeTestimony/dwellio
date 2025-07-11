import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { tenantApi } from '../services/api';
import { FaUpload, FaCheck, FaExclamationTriangle, FaUser, FaHome, FaFileAlt, FaBriefcase, FaPhoneAlt, FaIdCard, FaFileInvoiceDollar, FaUserFriends, FaCamera, FaTrash } from 'react-icons/fa';
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

interface HouseImage {
  id: string;
  category: 'aerial_view' | 'sitting_room' | 'bedroom' | 'kitchen' | 'bathroom' | 'exterior' | 'other';
  url: string;
  fileName: string;
  uploadedAt: string;
}

interface HouseInfo {
  images: HouseImage[];
  features: string[];
  amenities: string[];
  description: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: string;
  propertyType: string;
}

// Demo image URLs for document placeholder images
const documentPlaceholders = {
  id_card: 'https://images.unsplash.com/photo-1590002893730-1d0ff5fd892e?w=600&auto=format&fit=crop',
  utility_bill: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=600&auto=format&fit=crop',
  bank_statement: 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=600&auto=format&fit=crop',
  employment_letter: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop',
  passport: 'https://images.unsplash.com/photo-1618033221317-5f369d382c2b?w=600&auto=format&fit=crop'
};

export default function TenantProfile() {
  const { user, updateUserContext } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'documents' | 'residence' | 'house'>('personal');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);

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

  // House Information State
  const [houseInfo, setHouseInfo] = useState<HouseInfo>({
    images: [],
    features: [],
    amenities: [],
    description: '',
    size: '',
    bedrooms: 0,
    bathrooms: 0,
    yearBuilt: '',
    propertyType: ''
  });

  // Saving states for various forms
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingResidence, setSavingResidence] = useState(false);
  const [savingHouse, setSavingHouse] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Predefined options for features and amenities
  const houseFeatures = [
    'Air Conditioning', 'Balcony', 'Basement', 'Ceiling Fans', 'Central Heating',
    'Fireplace', 'Garage', 'Garden', 'Hardwood Floors', 'High Ceilings',
    'In-unit Laundry', 'Kitchen Island', 'Patio', 'Walk-in Closet', 'Storage Space'
  ];

  const houseAmenities = [
    'Swimming Pool', 'Gym/Fitness Center', 'Parking', 'Security System',
    'Elevator', 'Concierge', 'Rooftop Access', 'Business Center',
    'Children\'s Play Area', 'BBQ Area', 'Tennis Court', 'Clubhouse',
    'Package Receiving', 'Bike Storage', 'Pet-Friendly'
  ];

  const imageCategories = [
    { key: 'aerial_view', label: 'Aerial View' },
    { key: 'sitting_room', label: 'Sitting Room' },
    { key: 'bedroom', label: 'Bedroom' },
    { key: 'kitchen', label: 'Kitchen' },
    { key: 'bathroom', label: 'Bathroom' },
    { key: 'exterior', label: 'Exterior' },
    { key: 'other', label: 'Other' }
  ];

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
            emergencyContactRelationship: userData.tenantProfile?.emergencyContactRelationship || ''
          });
          
          // Update residence form
          setResidenceForm({
            address: userData.tenantProfile?.currentResidence?.address || '',
            landlordName: userData.tenantProfile?.currentResidence?.landlordName || '',
            landlordPhone: userData.tenantProfile?.currentResidence?.landlordPhone || '',
            moveInDate: userData.tenantProfile?.currentResidence?.moveInDate 
              ? new Date(userData.tenantProfile.currentResidence.moveInDate).toISOString().split('T')[0] 
              : '',
            leaseEndDate: userData.tenantProfile?.currentResidence?.leaseEndDate 
              ? new Date(userData.tenantProfile.currentResidence.leaseEndDate).toISOString().split('T')[0] 
              : ''
          });
          
          // Set documents
          setDocuments(userData.tenantProfile?.documents || []);
          
          // Set house information
          setHouseInfo(userData.tenantProfile?.houseInfo || {
            images: [],
            features: [],
            amenities: [],
            description: '',
            size: '',
            bedrooms: 0,
            bathrooms: 0,
            yearBuilt: '',
            propertyType: ''
          });
          
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
  }, []); // Empty dependency array - only run once on mount

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPersonal(true);
    
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
          emergencyContactPhone: personalInfo.emergencyContactPhone,
          emergencyContactRelationship: personalInfo.emergencyContactRelationship
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
      setSavingPersonal(false);
    }
  };

  const handleResidenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingResidence(true);
    
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
      setSavingResidence(false);
    }
  };

  const handleHouseImageUpload = async (category: HouseImage['category'], file: File) => {
    setUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', category);
      
      const response = await tenantApi.uploadHouseImage(formData);
      
      if (response.success && response.data) {
        const newImage: HouseImage = {
          id: response.data.id,
          category,
          url: response.data.url,
          fileName: file.name,
          uploadedAt: new Date().toISOString()
        };
        
        setHouseInfo(prev => ({
          ...prev,
          images: [...prev.images, newImage]
        }));
        
        toast.success('House image uploaded successfully!');
      } else {
        toast.error('Failed to upload house image');
      }
    } catch (error) {
      console.error('Failed to upload house image:', error);
      toast.error('Failed to upload house image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveHouseImage = async (imageId: string) => {
    try {
      const response = await tenantApi.deleteHouseImage(imageId);
      
      if (response.success) {
        setHouseInfo(prev => ({
          ...prev,
          images: prev.images.filter(img => img.id !== imageId)
        }));
        
        toast.success('Image removed successfully!');
      } else {
        toast.error('Failed to remove image');
      }
    } catch (error) {
      console.error('Failed to remove image:', error);
      toast.error('Failed to remove image');
    }
  };

  const handleHouseInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHouse(true);
    
    try {
      const updateData = {
        tenantProfile: {
          houseInfo: {
            features: houseInfo.features,
            amenities: houseInfo.amenities,
            description: houseInfo.description,
            size: houseInfo.size,
            bedrooms: houseInfo.bedrooms,
            bathrooms: houseInfo.bathrooms,
            yearBuilt: houseInfo.yearBuilt,
            propertyType: houseInfo.propertyType
          }
        }
      };
      
      const response = await tenantApi.updateProfile(updateData);
      
      if (response.success) {
        toast.success('House information updated successfully!');
        // Refresh profile data
        const profileResponse = await tenantApi.getProfile();
        if (profileResponse.success && profileResponse.data) {
          updateUserContext(profileResponse.data);
        }
      } else {
        toast.error('Failed to update house information');
      }
    } catch (error) {
      console.error('Failed to update house information:', error);
      toast.error('Failed to update house information');
    } finally {
      setSavingHouse(false);
    }
  };

  const toggleFeature = (feature: string) => {
    setHouseInfo(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setHouseInfo(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
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
        {/* Demo image placeholder */}
        {status === 'missing' && (
          <div className="mt-4">
            <img
              src={documentPlaceholders[type]}
              alt={`${title} placeholder`}
              className="w-full h-auto rounded-md border"
            />
          </div>
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
              <button
                onClick={() => setActiveTab('house')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'house'
                    ? 'border-primary-600 text-primary-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaCamera className="inline mr-2" />
                House Information
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
                    disabled={savingPersonal || loading}
                    className="bg-primary-700 text-white px-6 py-3 rounded-md hover:bg-primary-800 disabled:opacity-50"
                  >
                    {savingPersonal ? 'Saving...' : 'Save Personal Information'}
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
                    disabled={savingResidence || loading}
                    className="bg-primary-700 text-white px-6 py-3 rounded-md hover:bg-primary-800 disabled:opacity-50"
                  >
                    {savingResidence ? 'Saving...' : 'Save Residence Information'}
                  </button>
                </div>
              </form>
            )}

            {/* House Information Tab */}
            {activeTab === 'house' && (
              <div className="space-y-8">
                {/* House Images Section */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">House Images</h3>
                  <p className="text-gray-600 mb-6">Upload images of your house in different categories</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {imageCategories.map(category => (
                      <div key={category.key} className="bg-white rounded-lg p-4 border">
                        <h4 className="font-medium mb-2">{category.label}</h4>
                        
                        {/* Show existing images for this category */}
                        {houseInfo.images
                          .filter(img => img.category === category.key)
                          .map(image => (
                            <div key={image.id} className="mb-3 relative">
                              <img 
                                src={image.url} 
                                alt={category.label}
                                className="w-full h-32 object-cover rounded-md"
                              />
                              <button
                                onClick={() => handleRemoveHouseImage(image.id)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <FaTrash className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        
                        {/* Upload button */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleHouseImageUpload(category.key as HouseImage['category'], file);
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                          disabled={uploadingImage}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* House Details Form */}
                <form onSubmit={handleHouseInfoSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property Type
                      </label>
                      <select
                        value={houseInfo.propertyType}
                        onChange={(e) => setHouseInfo(prev => ({ ...prev, propertyType: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                      >
                        <option value="">Select property type</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="condo">Condo</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="studio">Studio</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Size (sq ft)
                      </label>
                      <input
                        type="text"
                        value={houseInfo.size}
                        onChange={(e) => setHouseInfo(prev => ({ ...prev, size: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                        placeholder="e.g., 1200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        value={houseInfo.bedrooms}
                        onChange={(e) => setHouseInfo(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        value={houseInfo.bathrooms}
                        onChange={(e) => setHouseInfo(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 0 }))}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year Built
                      </label>
                      <input
                        type="text"
                        value={houseInfo.yearBuilt}
                        onChange={(e) => setHouseInfo(prev => ({ ...prev, yearBuilt: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                        placeholder="e.g., 2020"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={houseInfo.description}
                        onChange={(e) => setHouseInfo(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                        rows={4}
                        placeholder="Describe your house..."
                      />
                    </div>
                  </div>

                  {/* Features Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      House Features
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {houseFeatures.map(feature => (
                        <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={houseInfo.features.includes(feature)}
                            onChange={() => toggleFeature(feature)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                          />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Amenities Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Amenities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {houseAmenities.map(amenity => (
                        <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={houseInfo.amenities.includes(amenity)}
                            onChange={() => toggleAmenity(amenity)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                          />
                          <span className="text-sm text-gray-700">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={savingHouse || loading}
                      className="bg-primary-700 text-white px-6 py-3 rounded-md hover:bg-primary-800 disabled:opacity-50"
                    >
                      {savingHouse ? 'Saving...' : 'Save House Information'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
