import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import { Container, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';

const SupplierBidding = () => {
  const [fuelType, setFuelType] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');
  const [boqDetails, setBoqDetails] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [qualityCertificates, setQualityCertificates] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmitBid = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    try {
      await axios.post(
        `${API_BASE_URL}/bids/submit`,
        {
          fuel_type: fuelType,
          price_per_liter: pricePerLiter,
          boq_details: boqDetails,
          qualifications,
          quality_certificates: qualityCertificates,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSnackbar('Bid submitted successfully.', 'success');
    } catch (error) {
      console.error('Error submitting bid:', error);
      showSnackbar('Error submitting bid.', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Submit Your Bid
      </Typography>
      <TextField
        label="Fuel Type"
        value={fuelType}
        onChange={(e) => setFuelType(e.target.value)}
        fullWidth
        margin="dense"
      />
      <TextField
        label="Price per Liter (RWF)"
        type="number"
        value={pricePerLiter}
        onChange={(e) => setPricePerLiter(e.target.value)}
        fullWidth
        margin="dense"
      />
      <TextField
        label="BOQ Details"
        value={boqDetails}
        onChange={(e) => setBoqDetails(e.target.value)}
        fullWidth
        margin="dense"
      />
      <TextField
        label="Qualifications"
        value={qualifications}
        onChange={(e) => setQualifications(e.target.value)}
        fullWidth
        margin="dense"
      />
      <TextField
        label="Quality Certificates"
        value={qualityCertificates}
        onChange={(e) => setQualityCertificates(e.target.value)}
        fullWidth
        margin="dense"
      />
      <Button variant="contained" color="primary" onClick={handleSubmitBid}>
        Submit Bid
      </Button>

      {/* Snackbar for notifications */}
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
    </Container>
  );
};

export default SupplierBidding;
