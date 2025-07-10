import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaHome, FaCalendar, FaMapMarkerAl                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-primary-700 text-white px-6 py-3 rounded-md hover:bg-primary-800"
                  >
                    Continue
                  </button>
                </div>yBillWave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { tenantApi } from '../services/api';

interface MoveOutPreferences {
  targetMoveDate: string;
  preferredLocation: string;
  priceRange: {
    min: number;
    max: number;
  };
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  specialRequirements: string;
  useDwellioFacilitation: boolean;
}

export default function MoveOutIntent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<MoveOutPreferences>({
    targetMoveDate: '',
    preferredLocation: '',
    priceRange: {
      min: 0,
      max: 0
    },
    propertyType: 'flat',
    bedrooms: 1,
    bathrooms: 1,
    specialRequirements: '',
    useDwellioFacilitation: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const moveOutData = {
        intendedDate: preferences.targetMoveDate,
        reason: `Looking for a ${preferences.propertyType} with ${preferences.bedrooms} bedrooms in ${preferences.preferredLocation}`,
        preferredAreas: [preferences.preferredLocation],
        budgetRange: {
          min: preferences.priceRange.min,
          max: preferences.priceRange.max
        },
        propertyType: preferences.propertyType,
        facilitationRequested: preferences.useDwellioFacilitation
      };

      const response = await tenantApi.submitMoveOutIntent(moveOutData);
      
      if (response.success) {
        toast.success('Move-out intent submitted successfully! We\'ll show you matching properties soon.');
        navigate('/dashboard');
      } else {
        toast.error('Failed to submit move-out intent');
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to submit move-out intent:', error);
      toast.error('Failed to submit move-out intent. Please try again.');
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNumber) => (
        <div key={stepNumber} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= stepNumber ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {stepNumber}
          </div>
          {stepNumber < 3 && (
            <div className={`w-12 h-1 mx-2 ${
              step > stepNumber ? 'bg-primary-600' : 'bg-gray-200'
            }`}></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find Your Next Home</h1>
              <p className="text-gray-600">Let us help you find the perfect place to move to</p>
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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <StepIndicator />

          <form onSubmit={handleSubmit}>
            {/* Step 1: Move Date & Location */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <FaCalendar className="text-accent-sand-600 text-4xl mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900">When and Where?</h2>
                  <p className="text-gray-600">Tell us when you'd like to move and your preferred location</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Move Date *
                  </label>
                  <input
                    type="date"
                    value={preferences.targetMoveDate}
                    onChange={(e) => setPreferences(prev => ({ ...prev, targetMoveDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Location *
                  </label>
                  <select
                    value={preferences.preferredLocation}
                    onChange={(e) => setPreferences(prev => ({ ...prev, preferredLocation: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                    required
                  >
                    <option value="">Select Area</option>
                    <option value="Maitama">Maitama</option>
                    <option value="Asokoro">Asokoro</option>
                    <option value="Garki">Garki</option>
                    <option value="Wuse">Wuse</option>
                    <option value="Gwarinpa">Gwarinpa</option>
                    <option value="Kubwa">Kubwa</option>
                    <option value="Jahi">Jahi</option>
                    <option value="Utako">Utako</option>
                    <option value="Kado">Kado</option>
                    <option value="Life Camp">Life Camp</option>
                    <option value="Lugbe">Lugbe</option>
                    <option value="Nyanya">Nyanya</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-green-700 text-white px-6 py-3 rounded-md hover:bg-green-800"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Property Preferences */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <FaHome className="text-primary-600 text-4xl mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900">Property Preferences</h2>
                  <p className="text-gray-600">What type of property are you looking for?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type *
                    </label>
                    <select
                      value={preferences.propertyType}
                      onChange={(e) => setPreferences(prev => ({ ...prev, propertyType: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                      required
                    >
                      <option value="flat">Apartment/Flat</option>
                      <option value="duplex">Duplex</option>
                      <option value="bungalow">Bungalow</option>
                      <option value="studio">Studio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms *
                    </label>
                    <select
                      value={preferences.bedrooms}
                      onChange={(e) => setPreferences(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                      required
                    >
                      <option value={1}>1 Bedroom</option>
                      <option value={2}>2 Bedrooms</option>
                      <option value={3}>3 Bedrooms</option>
                      <option value={4}>4 Bedrooms</option>
                      <option value={5}>5+ Bedrooms</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Price (₦/year) *
                    </label>
                    <input
                      type="number"
                      value={preferences.priceRange.min}
                      onChange={(e) => setPreferences(prev => ({ 
                        ...prev, 
                        priceRange: { ...prev.priceRange, min: parseInt(e.target.value) }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                      placeholder="200,000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Price (₦/year) *
                    </label>
                    <input
                      type="number"
                      value={preferences.priceRange.max}
                      onChange={(e) => setPreferences(prev => ({ 
                        ...prev, 
                        priceRange: { ...prev.priceRange, max: parseInt(e.target.value) }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                      placeholder="1,000,000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requirements
                  </label>
                  <textarea
                    value={preferences.specialRequirements}
                    onChange={(e) => setPreferences(prev => ({ ...prev, specialRequirements: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
                    rows={3}
                    placeholder="Any specific requirements or preferences..."
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-green-700 text-white px-6 py-3 rounded-md hover:bg-green-800"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Service Selection */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <FaMoneyBillWave className="text-accent-sand-600 text-4xl mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900">How Can We Help?</h2>
                  <p className="text-gray-600">Choose how you'd like Dwellio to assist you</p>
                </div>

                <div className="space-y-4">
                  <div 
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                      preferences.useDwellioFacilitation 
                        ? 'border-primary-600 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPreferences(prev => ({ ...prev, useDwellioFacilitation: true }))}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        checked={preferences.useDwellioFacilitation}
                        onChange={() => setPreferences(prev => ({ ...prev, useDwellioFacilitation: true }))}
                        className="mt-1 mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Full Dwellio Service (Recommended)
                        </h3>
                        <p className="text-gray-600 mb-3">
                          We represent you to landlords, handle all negotiations, manage payments, and take care of all paperwork.
                        </p>
                        <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                          Only 5% fee (vs 10% traditional agent)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                      !preferences.useDwellioFacilitation 
                        ? 'border-primary-600 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPreferences(prev => ({ ...prev, useDwellioFacilitation: false }))}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        checked={!preferences.useDwellioFacilitation}
                        onChange={() => setPreferences(prev => ({ ...prev, useDwellioFacilitation: false }))}
                        className="mt-1 mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Property Search Only
                        </h3>
                        <p className="text-gray-600 mb-3">
                          We'll show you matching properties and connect you directly with current tenants. You handle the rest.
                        </p>
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                          No fees
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-700 text-white px-6 py-3 rounded-md hover:bg-green-800 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Find My Next Home'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
