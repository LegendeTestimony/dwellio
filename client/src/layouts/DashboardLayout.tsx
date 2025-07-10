import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaHome, FaBuilding, FaUsers, FaComments, FaMoneyBill, FaCog, FaBell, FaUserCircle, FaShare } from 'react-icons/fa';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-primary-700 text-white">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-primary-600">
            <Link to="/" className="text-xl font-display font-semibold text-white">
              dwellio
            </Link>
          </div>
          
          {/* Navigation */}
          <div className="flex flex-col flex-grow p-4">
            <div className="flex flex-col flex-grow">
              <nav className="flex-1 space-y-1">
                <Link
                  to="/dashboard"
                  className={`group flex items-center px-4 py-2.5 rounded-lg transition-all ${
                    isActive('/dashboard') 
                      ? 'bg-white text-primary-700 font-medium' 
                      : 'text-white hover:bg-primary-600'
                  }`}
                >
                  <FaHome className={`mr-3 ${isActive('/dashboard') ? 'text-primary-700' : 'text-white'}`} />
                  <span>Overview</span>
                </Link>
                
                <Link
                  to="/dashboard/properties"
                  className={`group flex items-center px-4 py-2.5 rounded-lg transition-all ${
                    isActive('/dashboard/properties') 
                      ? 'bg-white text-primary-700 font-medium' 
                      : 'text-white hover:bg-primary-600'
                  }`}
                >
                  <FaBuilding className={`mr-3 ${isActive('/dashboard/properties') ? 'text-primary-700' : 'text-white'}`} />
                  <span>Properties</span>
                </Link>
                
                <Link
                  to="/dashboard/tenants"
                  className={`group flex items-center px-4 py-2.5 rounded-lg transition-all ${
                    isActive('/dashboard/tenants') 
                      ? 'bg-white text-primary-700 font-medium' 
                      : 'text-white hover:bg-primary-600'
                  }`}
                >
                  <FaUsers className={`mr-3 ${isActive('/dashboard/tenants') ? 'text-primary-700' : 'text-white'}`} />
                  <span>Tenants</span>
                </Link>
                
                <Link
                  to="/dashboard/messages"
                  className={`group flex items-center px-4 py-2.5 rounded-lg transition-all ${
                    isActive('/dashboard/messages') 
                      ? 'bg-white text-primary-700 font-medium' 
                      : 'text-white hover:bg-primary-600'
                  }`}
                >
                  <FaComments className={`mr-3 ${isActive('/dashboard/messages') ? 'text-primary-700' : 'text-white'}`} />
                  <span>Messages</span>
                </Link>
                
                <Link
                  to="/dashboard/finances"
                  className={`group flex items-center px-4 py-2.5 rounded-lg transition-all ${
                    isActive('/dashboard/finances') 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaMoneyBill className={`mr-3 ${isActive('/dashboard/finances') ? 'text-primary-700' : 'text-gray-400'}`} />
                  <span>Finances</span>
                </Link>
                
                <Link
                  to="/dashboard/maintenance"
                  className={`group flex items-center px-4 py-2.5 rounded-lg transition-all ${
                    isActive('/dashboard/maintenance') 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaCog className={`mr-3 ${isActive('/dashboard/maintenance') ? 'text-primary-700' : 'text-gray-400'}`} />
                  <span>Maintenance</span>
                </Link>
                
                <Link
                  to="/dashboard/alerts"
                  className={`group flex items-center px-4 py-2.5 rounded-lg transition-all ${
                    isActive('/dashboard/alerts') 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaBell className={`mr-3 ${isActive('/dashboard/alerts') ? 'text-primary-700' : 'text-gray-400'}`} />
                  <span>Alerts</span>
                </Link>

                <div className="border-t my-4"></div>
                
                <Link
                  to="/dashboard/referrals"
                  className={`group flex items-center px-4 py-2.5 rounded-lg transition-all ${
                    isActive('/dashboard/referrals') 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaShare className={`mr-3 ${isActive('/dashboard/referrals') ? 'text-primary-700' : 'text-gray-400'}`} />
                  <span>My Referrals</span>
                </Link>
                
                <Link
                  to="/dashboard/commissions"
                  className={`group flex items-center px-4 py-2.5 rounded-lg transition-all ${
                    isActive('/dashboard/commissions') 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaMoneyBill className={`mr-3 ${isActive('/dashboard/commissions') ? 'text-primary-700' : 'text-gray-400'}`} />
                  <span>Commissions</span>
                </Link>
                
                <Link
                  to="/dashboard/payout-settings"
                  className={`group flex items-center px-4 py-2.5 rounded-lg transition-all ${
                    isActive('/dashboard/payout-settings') 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaCog className={`mr-3 ${isActive('/dashboard/payout-settings') ? 'text-primary-700' : 'text-gray-400'}`} />
                  <span>Payout Settings</span>
                </Link>
              </nav>
            </div>
          </div>
          
          {/* User profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                  {user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
                </p>
                <button
                  onClick={logout}
                  className="text-xs font-medium text-gray-500 hover:text-primary-700 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-auto">
        {/* Top navbar for mobile */}
        <div className="md:hidden bg-white border-b border-gray-200 shadow-subtle">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-primary-700 hover:bg-gray-50"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link to="/" className="ml-2 text-xl font-display font-semibold text-primary-700">
                dwellio
              </Link>
            </div>
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center text-gray-400 hover:text-primary-700 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                  {user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || 'U'}
                </div>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-elevated overflow-hidden z-10">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">
                      {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link 
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/dashboard/properties"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Properties
                    </Link>
                    <Link 
                      to="/dashboard/referrals"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Referrals
                    </Link>
                  </div>
                  <div className="border-t border-gray-100">
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-700"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            ></div>
            
            {/* Sidebar */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <Link to="/" className="text-xl font-display font-semibold text-primary-700">
                    dwellio
                  </Link>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  <Link
                    to="/dashboard"
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive('/dashboard') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaHome className={`mr-3 ${isActive('/dashboard') ? 'text-primary-700' : 'text-gray-400'}`} />
                    <span>Overview</span>
                  </Link>
                  
                  <Link
                    to="/dashboard/properties"
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive('/dashboard/properties') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaBuilding className={`mr-3 ${isActive('/dashboard/properties') ? 'text-primary-700' : 'text-gray-400'}`} />
                    <span>Properties</span>
                  </Link>
                  
                  <Link
                    to="/dashboard/tenants"
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive('/dashboard/tenants') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaUsers className={`mr-3 ${isActive('/dashboard/tenants') ? 'text-primary-700' : 'text-gray-400'}`} />
                    <span>Tenants</span>
                  </Link>
                  
                  <Link
                    to="/dashboard/messages"
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive('/dashboard/messages') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaComments className={`mr-3 ${isActive('/dashboard/messages') ? 'text-primary-700' : 'text-gray-400'}`} />
                    <span>Messages</span>
                  </Link>
                  
                  <Link
                    to="/dashboard/finances"
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive('/dashboard/finances') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaMoneyBill className={`mr-3 ${isActive('/dashboard/finances') ? 'text-primary-700' : 'text-gray-400'}`} />
                    <span>Finances</span>
                  </Link>
                  
                  <Link
                    to="/dashboard/maintenance"
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive('/dashboard/maintenance') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaCog className={`mr-3 ${isActive('/dashboard/maintenance') ? 'text-primary-700' : 'text-gray-400'}`} />
                    <span>Maintenance</span>
                  </Link>
                  
                  <Link
                    to="/dashboard/alerts"
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive('/dashboard/alerts') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaBell className={`mr-3 ${isActive('/dashboard/alerts') ? 'text-primary-700' : 'text-gray-400'}`} />
                    <span>Alerts</span>
                  </Link>

                  <div className="border-t my-4"></div>
                  
                  <Link
                    to="/dashboard/referrals"
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive('/dashboard/referrals') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaShare className={`mr-3 ${isActive('/dashboard/referrals') ? 'text-primary-700' : 'text-gray-400'}`} />
                    <span>My Referrals</span>
                  </Link>
                  
                  <Link
                    to="/dashboard/commissions"
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive('/dashboard/commissions') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaMoneyBill className={`mr-3 ${isActive('/dashboard/commissions') ? 'text-primary-700' : 'text-gray-400'}`} />
                    <span>Commissions</span>
                  </Link>
                  
                  <Link
                    to="/dashboard/payout-settings"
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive('/dashboard/payout-settings') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaCog className={`mr-3 ${isActive('/dashboard/payout-settings') ? 'text-primary-700' : 'text-gray-400'}`} />
                    <span>Payout Settings</span>
                  </Link>
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                      {user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">
                      {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
                    </p>
                    <button
                      onClick={logout}
                      className="text-xs font-medium text-gray-500 hover:text-primary-700"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Page content */}
        <div className="flex-1 p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
