// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UsersManagement';
import InventoryManagement from './pages/InventoryManagement';
import SupplierManagement from './pages/SupplierManagement';
import FuelPurchasesManagement from './pages/FuelPurchasesManagement';
import FuelSalesManagement from './pages/FuelSalesManagement';
const MainLayout = ({ children }) => {
  const location = useLocation();
  const hideSidebar = location.pathname === '/'; 

  return (
    <div style={{ display: 'flex' }}>
      {!hideSidebar && <Sidebar />} {/* Render the sidebar only if not on the login page */}
      <div style={{ marginLeft: hideSidebar ? '0' : '250px', padding: '20px', width: '100%' }}>
        {children}
      </div>
    </div>
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
          <Route path="/fuel-sales" element={<FuelSalesManagement />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
