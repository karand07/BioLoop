import { BrowserRouter, Routes, Route} from 'react-router-dom';
import FarmerLayout from './components/layouts/FarmerLayout';
import FarmerDashboard from './pages/farmer/Dashboard';
import CreateListing from './pages/farmer/CreateListing';
import EditListing from './pages/farmer/EditListing';
import FarmerListings from './pages/farmer/Listings';
import FarmerRequests from './pages/farmer/Requests';
import FarmerOrders from './pages/farmer/Orders';
import FarmerProfile from './pages/farmer/Profile';
import FarmerEarnings from './pages/farmer/Earnings';


import CompanyLayout from './components/layouts/CompanyLayout';
import CompanyDashboard from './pages/company/Dashboard';
import CompanyMarketplace from './pages/company/Marketplace';
import CompanyRequests from './pages/company/Requests';
import CompanyOrders from './pages/company/Orders';
import CompanyProfile from './pages/company/Profile';

import LogisticsLayout from './components/layouts/LogisticsLayout';
import LogisticsDashboard from './pages/logistics/Dashboard';
import LogisticsDeliveries from './pages/logistics/Deliveries';
import LogisticsFind from './pages/logistics/Find';
import LogisticsProfile from './pages/logistics/Profile';
import LogisticsEarnings from './pages/logistics/Earnings';

import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminSettings from './pages/admin/Settings';

import Landing from './pages/Landing.tsx';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Farmer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
          <Route element={<FarmerLayout />}>
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/farmer/create-listing" element={<CreateListing />} />
            <Route path="/farmer/edit-listing/:id" element={<EditListing />} />
            <Route path="/farmer/listings" element={<FarmerListings />} />
            <Route path="/farmer/requests" element={<FarmerRequests />} />
            <Route path="/farmer/orders" element={<FarmerOrders />} />
            <Route path="/farmer/earnings" element={<FarmerEarnings />} />
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

        {/* Protected Logistics Routes */}
        <Route element={<ProtectedRoute allowedRoles={['logistics']} />}>
          <Route element={<LogisticsLayout />}>
            <Route path="/logistics/dashboard" element={<LogisticsDashboard />} />
            <Route path="/logistics/earnings" element={<LogisticsEarnings />} />
            <Route path="/logistics/deliveries" element={<LogisticsDeliveries />} />
            <Route path="/logistics/find" element={<LogisticsFind />} />
            <Route path="/logistics/profile" element={<LogisticsProfile />} />
            <Route path="/logistics/onboarding" element={<LogisticsProfile />} />
          </Route>
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<div className="p-10">404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
