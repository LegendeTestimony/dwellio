import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

export default function SignUp() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'tenant' as const,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(form);
      toast.success('Sign up successful!');
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else if (typeof err === 'string') {
        setError(err);
        toast.error(err);
      } else {
        setError('An unexpected error occurred');
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-aztec-50">
      {/* Left side - Image/Brand section (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-aztec-900 text-white">
        <div className="relative w-full h-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-aztec-800/50 to-aztec-950/50 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070" 
            alt="Modern apartment interior" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 flex flex-col justify-center items-center h-full px-12">
            <div className="mb-8">
              <Link to="/" className="inline-block">
                <span className="text-4xl font-bold font-display text-white">dwellio</span>
              </Link>
            </div>
            <div className="max-w-lg">
              <blockquote className="italic text-xl mb-6 text-aztec-100">
                "Dwellio helped me find my dream apartment with half the usual agent fees. Their service was exceptional throughout the entire process."
              </blockquote>
              <div className="flex items-center">
                <img 
                  src="https://randomuser.me/api/portraits/women/42.jpg" 
                  alt="Testimonial author" 
                  className="w-12 h-12 rounded-full mr-4 border-2 border-aztec-400"
                />
                <div>
                  <p className="font-semibold text-white">Sarah Johnson</p>
                  <p className="text-aztec-200 text-sm">Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-aztec-900">Create Your Account</h2>
            <p className="text-gray-600">Join thousands of users managing their properties with ease</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">{error}</div>}
            
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={form.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-aztec-600 focus:border-aztec-600 transition duration-150"
                required
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={form.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-aztec-600 focus:border-aztec-600 transition duration-150"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-aztec-600 focus:border-aztec-600 transition duration-150"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                id="phoneNumber"
                type="text"
                name="phoneNumber"
                placeholder="Enter your phone number"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-aztec-600 focus:border-aztec-600 transition duration-150"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-aztec-600 focus:border-aztec-600 transition duration-150"
                required
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-aztec-600 focus:border-aztec-600 transition duration-150"
              >
                <option value="tenant">Tenant</option>
                <option value="landlord">Landlord</option>
                <option value="referrer">Referrer</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full bg-aztec-700 text-white py-3 px-4 rounded-lg hover:bg-aztec-800 focus:outline-none focus:ring-2 focus:ring-aztec-600 focus:ring-opacity-50 transition duration-150 mt-6 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing up...
                </>
              ) : 'Create Account'}
            </button>
            
            <div className="mt-6 text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/signin" className="text-aztec-700 hover:text-aztec-800 font-medium">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
