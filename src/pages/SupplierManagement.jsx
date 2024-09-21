import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  LocalGasStation,
  Description,
  MonetizationOn,
  VerifiedUser,
  DateRange,
  Refresh,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';

const primaryColor = '#007547';
const secondaryColor = '#00a86b';

const SupplierBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/bids`);
      setBids(response.data);
    } catch (error) {
      console.error('Error fetching bids:', error);
      setError('Failed to fetch bids. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const TableHeader = ({ children, icon }) => (
    <Box display="flex" alignItems="center">
      {icon}
      <Typography variant="subtitle2" fontWeight="bold" ml={1}>
        {children}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" color={primaryColor} fontWeight="bold">
          Supplier Bids
        </Typography>
        <Tooltip title="Refresh bids">
          <IconButton onClick={fetchBids} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!loading && !error && (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: `${primaryColor}15` }}>
                <TableCell />
                <TableCell><TableHeader icon={<LocalGasStation color="primary" />}>Supplier & Fuel</TableHeader></TableCell>
                <TableCell><TableHeader icon={<MonetizationOn color="primary" />}>Pricing</TableHeader></TableCell>
                <TableCell><TableHeader icon={<VerifiedUser color="primary" />}>Qualifications</TableHeader></TableCell>
                <TableCell><TableHeader icon={<DateRange color="primary" />}>Submission Date</TableHeader></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bids.map((bid) => (
                <React.Fragment key={bid.id}>
                  <TableRow 
                    hover 
                    sx={{ 
                      '&:nth-of-type(even)': { backgroundColor: `${primaryColor}05` },
                      cursor: 'pointer',
                    }}
                    onClick={() => handleExpandRow(bid.id)}
                  >
                    <TableCell>
                      <IconButton size="small">
                        {expandedRow === bid.id ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="medium">{bid.supplier_name}</Typography>
                      <Chip 
                        label={bid.fuel_type} 
                        size="small" 
                        sx={{ backgroundColor: `${secondaryColor}30`, color: secondaryColor, mt: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {bid.bid_price_per_unit} RWF / unit
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total: {bid.total_price} RWF
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={bid.qualifications}>
                        <Chip 
                          label="View Qualifications" 
                          size="small" 
                          sx={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {new Date(bid.submission_date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                  {expandedRow === bid.id && (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ backgroundColor: `${primaryColor}05` }}>
                        <Box p={2}>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            <Description fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Description
                          </Typography>
                          <Typography variant="body2">{bid.description}</Typography>
                          <Typography variant="subtitle1" fontWeight="bold" mt={2} gutterBottom>
                            <VerifiedUser fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Quality Certificates
                          </Typography>
                          <Typography variant="body2">{bid.quality_certificates}</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default SupplierBids;