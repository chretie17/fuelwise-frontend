// src/components/Dashboard.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import styled from 'styled-components';

// Styled-components for custom styling
const DashboardContainer = styled(Box)`
  padding: 20px;
  margin-left: 250px;
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <Typography variant="h4" gutterBottom>Welcome to the FuelWise Dashboard</Typography>
      <Typography variant="body1">
        Here you can manage your fuel procurement and inventory efficiently.
      </Typography>
    </DashboardContainer>
  );
};

export default Dashboard;
