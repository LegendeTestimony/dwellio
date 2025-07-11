import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({
        email: form.email,
        password: form.password,
      });
      toast.success('Signed in successfully!');
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
    <div className="flex min-h-screen bg-gray-50">
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
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo for mobile view */}
          <div className="text-center mb-8 lg:hidden">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-bold font-display text-aztec-700">dwellio</span>
            </Link>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-elevated w-full border-t-4 border-aztec-700">
            <h2 className="text-2xl font-bold mb-6 text-center text-aztec-700">Welcome Back</h2>
            
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-500">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aztec-500 focus:border-aztec-500 transition-colors"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aztec-500 focus:border-aztec-500 transition-colors"
                required
              />
              <div className="flex justify-end mt-1">
                <Link to="/forgot-password" className="text-sm text-aztec-600 hover:text-aztec-800">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full flex justify-center items-center bg-aztec-700 text-white py-3 rounded-lg hover:bg-aztec-800 transition-colors disabled:opacity-50 font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
            
            <div className="mt-6 text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <Link to="/signup" className="text-aztec-700 font-medium hover:text-aztec-900 hover:underline">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
