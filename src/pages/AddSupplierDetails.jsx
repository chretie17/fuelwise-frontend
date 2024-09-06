// src/pages/AddSupplierDetails.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import { Container, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddSupplierDetails = () => {
  const [contactDetails, setContactDetails] = useState('');
  const [certification, setCertification] = useState('');
  const [performanceHistory, setPerformanceHistory] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleAddDetails = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage
    try {
      await axios.post(
        `${API_BASE_URL}/suppliers/add-details`,
        { contact_details: contactDetails, certification, performance_history: performanceHistory, price_per_liter: pricePerLiter, user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSnackbar('Supplier details added successfully.', 'success');
      navigate('/supplier-bidding'); // Redirect to bidding page after adding details
    } catch (error) {
      console.error('Error adding details:', error);
      showSnackbar('Error adding details.', 'error');
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
        Add Supplier Details
      </Typography>
      <TextField
        label="Contact Details"
        value={contactDetails}
        onChange={(e) => setContactDetails(e.target.value)}
        fullWidth
        margin="dense"
      />
      <TextField
        label="Certification"
        value={certification}
        onChange={(e) => setCertification(e.target.value)}
        fullWidth
        margin="dense"
      />
      <TextField
        label="Performance History"
        value={performanceHistory}
        onChange={(e) => setPerformanceHistory(e.target.value)}
        fullWidth
        margin="dense"
      />
      <TextField
        label="Price per Liter (RWF)"
        value={pricePerLiter}
        onChange={(e) => setPricePerLiter(e.target.value)}
        fullWidth
        margin="dense"
      />
      <Button variant="contained" color="primary" onClick={handleAddDetails}>
        Add Details
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

export default AddSupplierDetails;
