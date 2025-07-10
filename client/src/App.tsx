import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Lazy loading dashboard components for better performance
import { Suspense, lazy } from 'react';

const TenantDashboard = lazy(() => import('./pages/TenantDashboard'));
const TenantProfile = lazy(() => import('./pages/TenantProfile'));
const MoveOutIntent = lazy(() => import('./pages/MoveOutIntent'));
const Applications = lazy(() => import('./pages/Applications'));

// Fallback loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-700"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Tenant Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <TenantDashboard />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <TenantProfile />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="/move-out" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <MoveOutIntent />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="/applications" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <Applications />
              </Suspense>
            </ProtectedRoute>
          } />
          
          {/* Redirect any unknown route to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
