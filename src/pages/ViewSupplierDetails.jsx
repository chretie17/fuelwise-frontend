// src/pages/ViewSupplierDetails.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import { Container, Typography, Snackbar, Alert } from '@mui/material';

const ViewSupplierDetails = () => {
  const [supplierDetails, setSupplierDetails] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchSupplierDetails();
  }, []);

  const fetchSupplierDetails = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    try {
      const response = await axios.get(`${API_BASE_URL}/suppliers/my-details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSupplierDetails(response.data);
    } catch (error) {
      console.error('Error fetching details:', error);
      showSnackbar('Error fetching supplier details.', 'error');
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
        Supplier Details
      </Typography>
      {supplierDetails ? (
        <>
          <Typography variant="body1">Name: {supplierDetails.name}</Typography>
          <Typography variant="body1">Email: {supplierDetails.email}</Typography>
          <Typography variant="body1">Contact Details: {supplierDetails.contact_details}</Typography>
          <Typography variant="body1">Certification: {supplierDetails.certification}</Typography>
          <Typography variant="body1">Performance History: {supplierDetails.performance_history}</Typography>
          <Typography variant="body1">Price per Liter (RWF): {supplierDetails.price_per_liter}</Typography>
        </>
      ) : (
        <Typography variant="body2">Loading...</Typography>
      )}

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

export default ViewSupplierDetails;
