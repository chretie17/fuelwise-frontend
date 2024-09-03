// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import styled from 'styled-components';

// Styled-components for custom styling
const SidebarContainer = styled(Box)`
  width: 250px;
  background-color: #ffff; /* MUI primary color */
  color: white;
  height: 100vh;
  padding: 20px;
  position: fixed; /* Fixes the sidebar to the side */
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
`;

const Sidebar = () => {
  const [role, setRole] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    // Assume the role is stored in local storage after login
    const userRole = localStorage.getItem('role');
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // Redirect to the login page
    navigate('/');
  };

  const renderLinks = () => {
    switch (role) {
      case 'admin':
        return (
          <>
            <ListItem button component={Link} to="/dashboard">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/users">
              <ListItemText primary="Manage Users" />
            </ListItem>
            <ListItem button component={Link} to="/inventory">
              <ListItemText primary="Inventory" />
            </ListItem>
            <ListItem button component={Link} to="/suppliers">
              <ListItemText primary="Suppliers" />
            </ListItem>
            <ListItem button component={Link} to="/fuel-sales">
              <ListItemText primary="Fuel Sales" />
            </ListItem>
            <ListItem button component={Link} to="/fuel-purchases">
              <ListItemText primary="Fuel Purchases" />
            </ListItem>
          </>
        );
      case 'manager':
        return (
          <>
            <ListItem button component={Link} to="/dashboard">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/suppliers">
              <ListItemText primary="Suppliers" />
            </ListItem>
            <ListItem button component={Link} to="/reports">
              <ListItemText primary="Reports" />
            </ListItem>
          </>
        );
      case 'supplier':
        return (
          <>
            <ListItem button component={Link} to="/dashboard">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/orders">
              <ListItemText primary="Orders" />
            </ListItem>
          </>
        );
      default:
        return (
          <ListItem button component={Link} to="/dashboard">
            <ListItemText primary="Dashboard" />
          </ListItem>
        );
    }
  };

  return (
    <SidebarContainer>
      <Typography variant="h5" gutterBottom>FuelWise</Typography>
      <List>
        {renderLinks()}
        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </SidebarContainer>
  );
};

export default Sidebar;
