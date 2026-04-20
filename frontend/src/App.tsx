import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FarmerLayout from './components/layouts/FarmerLayout';
import FarmerDashboard from './pages/farmer/Dashboard';
import CreateListing from './pages/farmer/CreateListing';
import FarmerListings from './pages/farmer/Listings';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Farmer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
          <Route element={<FarmerLayout />}>
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/farmer/create-listing" element={<CreateListing />} />
            <Route path="/farmer/listings" element={<FarmerListings />} />
          </Route>
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<div className="p-10">404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
