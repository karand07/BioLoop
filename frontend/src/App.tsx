import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FarmerLayout from './components/layouts/FarmerLayout';
import FarmerDashboard from './pages/farmer/Dashboard';
import CreateListing from './pages/farmer/CreateListing';
import EditListing from './pages/farmer/EditListing';
import FarmerListings from './pages/farmer/Listings';
import FarmerRequests from './pages/farmer/Requests';
import FarmerOrders from './pages/farmer/Orders';
import FarmerProfile from './pages/farmer/Profile';


import CompanyLayout from './components/layouts/CompanyLayout';
import CompanyDashboard from './pages/company/Dashboard';
import CompanyMarketplace from './pages/company/Marketplace';
import CompanyRequests from './pages/company/Requests';
import CompanyOrders from './pages/company/Orders';
import CompanyProfile from './pages/company/Profile';

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
            <Route path="/farmer/edit-listing/:id" element={<EditListing />} />
            <Route path="/farmer/listings" element={<FarmerListings />} />
            <Route path="/farmer/requests" element={<FarmerRequests />} />
            <Route path="/farmer/orders" element={<FarmerOrders />} />
            <Route path="/farmer/profile" element={<FarmerProfile />} />
            <Route path="/farmer/onboarding" element={<FarmerProfile />} />
          </Route>
        </Route>

        {/* Protected Company Routes */}
        <Route element={<ProtectedRoute allowedRoles={['company']} />}>
          <Route element={<CompanyLayout />}>
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
            <Route path="/company/marketplace" element={<CompanyMarketplace />} />
            <Route path="/company/requests" element={<CompanyRequests />} />
            <Route path="/company/orders" element={<CompanyOrders />} />
            <Route path="/company/profile" element={<CompanyProfile />} />
            <Route path="/company/onboarding" element={<CompanyProfile />} />
          </Route>
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<div className="p-10">404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
