import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Dashboard, People, Inventory, LocalGasStation, AttachMoney, ShoppingCart, Description, ExitToApp } from '@mui/icons-material';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 200,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  height: '100vh',
  padding: theme.spacing(3),
  position: 'fixed',
  top: 0,
  left: 0,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    width: 300,
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2rem',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(3),
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: active ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 40,
  color: theme.palette.primary.main,
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiTypography-root': {
    fontWeight: 500,
  },
}));

const Sidebar = () => {
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const menuItems = {
    admin: [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
      { text: 'Manage Users', icon: <People />, path: '/users' },
      { text: 'Inventory', icon: <Inventory />, path: '/inventory' },
      { text: 'Suppliers', icon: <LocalGasStation />, path: '/suppliers' },
      { text: 'Fuel Sales', icon: <AttachMoney />, path: '/fuel-sales' },
      { text: 'Fuel Purchases', icon: <ShoppingCart />, path: '/fuel-purchases' },
      { text: 'Procurement', icon: <ShoppingCart />, path: '/admin-procurement' },
      { text: 'Evaluation', icon: <ShoppingCart />, path: '/admin-evaluation' },

    ],
    manager: [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
      { text: 'Suppliers', icon: <LocalGasStation />, path: '/suppliers' },
      { text: 'Reports', icon: <Description />, path: '/reports' },
    ],
    supplier: [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
      { text: 'Add Supplier Details', icon: <Inventory />, path: '/add-supplier-details' }, // New Link
      { text: 'Bidding', icon: <AttachMoney />, path: '/supplier-bidding' }, // New Link
      { text: 'Orders', icon: <ShoppingCart />, path: '/orders' },
    ],
  };
  
  const renderLinks = () => {
    const items = menuItems[role] || [{ text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' }];
    return items.map((item) => (
      <StyledListItem
        key={item.text}
        button
        component={Link}
        to={item.path}
        active={location.pathname === item.path ? 1 : 0}
      >
        <StyledListItemIcon>{item.icon}</StyledListItemIcon>
        <StyledListItemText primary={item.text} />
      </StyledListItem>
    ));
  };

  return (
    <SidebarContainer>
      <Logo variant="h1">FuelWise</Logo>
      <Divider sx={{ mb: 2 }} />
      <List>
        {renderLinks()}
        <StyledListItem button onClick={handleLogout}>
          <StyledListItemIcon>
            <ExitToApp />
          </StyledListItemIcon>
          <StyledListItemText primary="Logout" />
        </StyledListItem>
      </List>
    </SidebarContainer>
  );
};

export default Sidebar;