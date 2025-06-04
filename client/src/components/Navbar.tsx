import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm">
      {/* Main navbar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold text-green-700">
            dwellio
          </Link>
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-md mx-8">
            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden shadow-sm">
              <input
                type="text"
                placeholder="Search locations, properties..."
                className="flex-1 px-4 py-2 outline-none text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-green-700 text-white p-2 hover:bg-green-800 transition">
                <FaSearch className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Navigation links */}
          <div className="flex items-center gap-6">
            <Link to="/properties" className="text-gray-700 hover:text-green-700 transition">Explore</Link>
            <Link to="/manage" className="text-gray-700 hover:text-green-700 transition">Manage Rentals</Link>
            
            {/* Profile dropdown */}
            <div className="relative">
              <button 
                className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <FaUserCircle className="w-6 h-6" />
                <span className="hidden md:inline">Account</span>
              </button>
              
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    <Link 
                      to="/signin" 
                      className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/signup" 
                      className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                    <hr className="my-1" />
                    <Link 
                      to="/advertise" 
                      className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      List Your Property
                    </Link>
                    <Link 
                      to="/help" 
                      className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Help
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation tabs */}
      <div className="container mx-auto px-4 py-3 border-t border-gray-100">
        <div className="flex items-center space-x-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="text-gray-700 hover:text-green-700 font-medium pb-2 border-b-2 border-green-700">
            Rent
          </Link>
          <Link to="/buy" className="text-gray-700 hover:text-green-700 pb-2 border-b-2 border-transparent hover:border-green-700 transition-colors">
            Buy
          </Link>
          <Link to="/sell" className="text-gray-700 hover:text-green-700 pb-2 border-b-2 border-transparent hover:border-green-700 transition-colors">
            Sell
          </Link>
          <Link to="/mortgage" className="text-gray-700 hover:text-green-700 pb-2 border-b-2 border-transparent hover:border-green-700 transition-colors">
            Mortgage
          </Link>
          <Link to="/agents" className="text-gray-700 hover:text-green-700 pb-2 border-b-2 border-transparent hover:border-green-700 transition-colors">
            Find Agents
          </Link>
        </div>
      </div>
    </header>
  );
}
