import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  BarChart, Group, Inventory2, LocalGasStation, Payments, 
  ShoppingBasket, Description, LogoutRounded, ChevronLeft, ChevronRight,
  Assessment, AddBusiness, Gavel, LocalShipping
} from '@mui/icons-material';

const primaryColor = '#007547';
const secondaryColor = '#00a86b';

const SidebarContainer = styled(Box)(({ theme, isopen }) => ({
  width: isopen ? 260 : 80,
  backgroundColor: '#ffffff',
  color: theme.palette.text.primary,
  height: '100vh',
  padding: theme.spacing(3, 2),
  position: 'fixed',
  top: 0,
  left: 0,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '2px 0px 20px rgba(0, 117, 71, 0.1)',
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',
  '&:hover': {
    width: isopen ? 260 : 80,
  },
  zIndex: theme.zIndex.drawer,
}));

const Logo = styled(Typography)(({ theme, isopen }) => ({
  fontWeight: 800,
  fontSize: isopen ? '2.2rem' : '1.6rem',
  color: primaryColor,
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  whiteSpace: 'nowrap',
  textShadow: '2px 2px 4px rgba(0, 117, 71, 0.15)',
  letterSpacing: '0.05em',
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  marginBottom: theme.spacing(1.5),
  borderRadius: 12,
  backgroundColor: active ? `${primaryColor}15` : 'transparent',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: `${primaryColor}25`,
    transform: 'translateX(5px)',
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme, active }) => ({
  minWidth: 46,
  color: active ? primaryColor : theme.palette.text.secondary,
  transition: 'color 0.2s ease-in-out',
}));

const StyledListItemText = styled(ListItemText)(({ theme, active }) => ({
  '& .MuiTypography-root': {
    fontWeight: active ? 600 : 500,
    color: active ? primaryColor : theme.palette.text.primary,
    transition: 'color 0.2s ease-in-out',
    fontSize: '0.95rem',
  },
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: `${primaryColor}20`,
  margin: theme.spacing(2, 0),
}));

const ToggleButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: -16,
  top: 20,
  backgroundColor: primaryColor,
  color: 'white',
  padding: 4,
  '&:hover': {
    backgroundColor: secondaryColor,
  },
}));

const Sidebar = () => {
  const [role, setRole] = useState('');
  const [isOpen, setIsOpen] = useState(true);
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
      { text: 'Dashboard', icon: <BarChart />, path: '/dashboard' },
      { text: 'Manage Users', icon: <Group />, path: '/users' },
      { text: 'Inventory', icon: <Inventory2 />, path: '/inventory' },
      { text: 'Suppliers', icon: <LocalGasStation />, path: '/suppliers' },
      { text: 'Fuel Sales', icon: <Payments />, path: '/fuel-sales' },
      { text: 'Fuel Purchases', icon: <ShoppingBasket />, path: '/fuel-purchases' },
      { text: 'Procurement', icon: <Assessment />, path: '/admin-procurement' },
      { text: 'Evaluation', icon: <Gavel />, path: '/admin-evaluation' },
    ],
    manager: [
      { text: 'Dashboard', icon: <BarChart />, path: '/dashboard' },
      { text: 'Suppliers', icon: <LocalGasStation />, path: '/suppliers' },
      { text: 'Reports', icon: <Description />, path: '/reports' },
    ],
    supplier: [
      { text: 'Dashboard', icon: <BarChart />, path: '/dashboard' },
      { text: 'Add Details', icon: <AddBusiness />, path: '/add-supplier-details' },
      { text: 'Bidding', icon: <Gavel />, path: '/supplier-bidding' },
      { text: 'Orders', icon: <LocalShipping />, path: '/orders' },
    ],
  };
  
  const renderLinks = () => {
    const items = menuItems[role] || [{ text: 'Dashboard', icon: <BarChart />, path: '/dashboard' }];
    return items.map((item) => (
      <Tooltip title={isOpen ? "" : item.text} placement="right" key={item.text}>
        <StyledListItem
          button
          component={Link}
          to={item.path}
          active={location.pathname === item.path ? 1 : 0}
        >
          <StyledListItemIcon active={location.pathname === item.path ? 1 : 0}>{item.icon}</StyledListItemIcon>
          {isOpen && <StyledListItemText primary={item.text} active={location.pathname === item.path ? 1 : 0} />}
        </StyledListItem>
      </Tooltip>
    ));
  };

  return (
    <SidebarContainer isopen={isOpen ? 1 : 0}>
      <Logo variant="h1" isopen={isOpen ? 1 : 0}>{isOpen ? 'FuelWise' : 'FW'}</Logo>
      <ToggleButton onClick={() => setIsOpen(!isOpen)} size="small">
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </ToggleButton>
      <StyledDivider />
      <List>
        {renderLinks()}
      </List>
      <Box flexGrow={1} />
      <StyledDivider />
      <Tooltip title={isOpen ? "" : "Logout"} placement="right">
        <StyledListItem button onClick={handleLogout}>
          <StyledListItemIcon>
            <LogoutRounded />
          </StyledListItemIcon>
          {isOpen && <StyledListItemText primary="Logout" />}
        </StyledListItem>
      </Tooltip>
    </SidebarContainer>
  );
};

export default Sidebar;