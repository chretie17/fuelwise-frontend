import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/admin/UsersManagement';
import InventoryManagement from './pages/InventoryManagement';
import SupplierManagement from './pages/SupplierManagement';
import FuelPurchasesManagement from './pages/FuelPurchasesManagement';
import FuelSalesManagement from './pages/FuelSalesManagement';
import SupplierSignup from './pages/SupplierSignup';
import AddSupplierDetails from './pages/AddSupplierDetails';
import SupplierBidding from './pages/SupplierBidding';
import AdminFuelProcurement from './pages/admin/AdminFuelProcurement';
import AdminBranc from './pages/admin/Branches'
import AdminEvaluation from './pages/admin/AdminEvaluation';
import AdminBOQ from './pages/admin/AdminBOQ';
import AdminFuelSalesManagement from './pages/admin/adminfuelsales';
import AdminFuelPurchasesManagement from './pages/admin/AdminPurchase';
import AdminReports from './pages/admin/report';

const MainContent = styled(Box)(({ theme, sidebarwidth }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: sidebarwidth,
}));

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const hideSidebar = location.pathname === '/' || location.pathname === '/signup';
  const sidebarWidth = hideSidebar ? 0 : (sidebarOpen ? 240 : 70);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {!hideSidebar && (
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
      )}
      <MainContent sidebarwidth={sidebarWidth}>
        {children}
      </MainContent>
    </Box>
  );
};

const App = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/suppliers" element={<SupplierManagement />} />
          <Route path="/fuel-purchases" element={<FuelPurchasesManagement />} />
          <Route path="/admin-branches" element={<AdminBranc />} />
          <Route path="/admin-sales" element={<AdminFuelSalesManagement />} />
          <Route path="/admin-purchase" element={<AdminFuelPurchasesManagement/>} />
          <Route path="/admin-reports" element={<AdminReports />} />
          <Route path="/fuel-sales" element={<FuelSalesManagement />} />
          <Route path="/signup" element={<SupplierSignup />} />
          <Route path="/add-supplier-details" element={<AddSupplierDetails />} />
          <Route path="/supplier-bidding" element={<SupplierBidding />} />
          <Route path="/admin-procurement" element={<AdminBOQ />} />
          <Route path="/admin-evaluation" element={<AdminEvaluation />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;