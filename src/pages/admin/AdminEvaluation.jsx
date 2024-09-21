import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Paper, Grid, Alert, CircularProgress, MenuItem, Select, FormControl, InputLabel, Snackbar, Box, ThemeProvider, createTheme } from '@mui/material';
import { API_BASE_URL } from '../../api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007547',
    },
    secondary: {
      main: '#00a86b',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const EvaluateBids = () => {
  const [boqItems, setBoqItems] = useState([]);
  const [boqId, setBoqId] = useState('');
  const [bids, setBids] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  useEffect(() => {
    const fetchBOQItems = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/boq`);
        setBoqItems(response.data);
      } catch (err) {
        setError('Error fetching BOQ items');
      }
    };
    fetchBOQItems();
  }, []);

  const handleEvaluate = async () => {
    if (!boqId) {
      showSnackbar('Please select a BOQ to evaluate.', 'error');
      return;
    }

    setLoading(true);
    setError('');
    setBids([]);

    try {
      const response = await axios.get(`${API_BASE_URL}/evaluation/evaluate/${boqId}`);
      setBids([response.data.bestBid]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error evaluating bids');
    }
  };

  const handleSelectSupplier = async (supplierId) => {
    if (!supplierId || !boqId) {
      showSnackbar('Supplier ID or BOQ ID is missing.', 'error');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/evaluation/select-supplier`, {
        boq_id: boqId,
        supplier_id: supplierId,
      });
      setSelectedSupplier(supplierId);
      showSnackbar('Supplier selected and email sent successfully', 'success');
    } catch (error) {
      showSnackbar(error.response?.data?.error || 'Error selecting supplier', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom align="center" color="primary">
            Evaluate Bids
          </Typography>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select BOQ ID</InputLabel>
              <Select
                value={boqId}
                onChange={(e) => setBoqId(e.target.value)}
                label="Select BOQ ID"
              >
                {boqItems.map((boq) => (
                  <MenuItem key={boq.id} value={boq.id}>
                    {`BOQ ID: ${boq.id} - ${boq.fuel_type} (${boq.quantity} Liters)`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEvaluate}
                disabled={loading}
                sx={{ minWidth: 150 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Evaluate'}
              </Button>
            </Box>
          </Paper>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {bids.length > 0 && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" color="primary" gutterBottom>Best Bid</Typography>
              {bids.map((bid) => (
                <Grid container spacing={3} key={bid.user_id}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Supplier Name:</strong> {bid.supplier_name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Price per Unit (RWF):</strong> {bid.bid_price_per_unit}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Total Price (RWF):</strong> {bid.total_price}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Qualifications:</strong> {bid.qualifications}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Quality Certificates:</strong> {bid.quality_certificates}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Submission Date:</strong> {bid.submission_date}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleSelectSupplier(bid.user_id)}
                        disabled={selectedSupplier === bid.user_id}
                        sx={{ minWidth: 200 }}
                      >
                        {selectedSupplier === bid.user_id ? 'Selected' : 'Select Supplier'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              ))}
            </Paper>
          )}

          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default EvaluateBids;