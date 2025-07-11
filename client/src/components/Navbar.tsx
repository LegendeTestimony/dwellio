import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-aztec-950 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold font-display text-white">dwellio</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-200 transition-colors">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/properties" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-200 transition-colors">
                  Properties
                </Link>
                <Link to="/applications" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-200 transition-colors">
                  My Applications
                </Link>
                <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-200 transition-colors">
                  Dashboard
                </Link>
                <Link to="/tenant/profile" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-200 transition-colors">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-200 transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="ml-3 px-4 py-2 rounded-md text-sm font-medium border border-white text-white hover:bg-white/20 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 hover:bg-aztec-800 focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-aztec-800" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1 px-2">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-aztec-700 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/properties" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-aztec-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Properties
                </Link>
                <Link 
                  to="/applications" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-aztec-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Applications
                </Link>
                <Link 
                  to="/tenant/dashboard" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-aztec-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/tenant/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-aztec-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:text-red-300 hover:bg-aztec-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/signin" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-aztec-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-aztec-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
