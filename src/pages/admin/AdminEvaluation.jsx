import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Snackbar, Alert, Box } from '@mui/material';
import { API_BASE_URL } from '../../api'; // Import the base URL from api.jsx
import axios from 'axios';

const AdminEvaluateBids = () => {
  const [fuelType, setFuelType] = useState('');
  const [budget, setBudget] = useState('');
  const [requiredQualifications, setRequiredQualifications] = useState('');
  const [requiredQualityCertificates, setRequiredQualityCertificates] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null); // State to hold selected supplier details
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleEvaluateBids = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    try {
      const response = await axios.post(
        `${API_BASE_URL}/bids/evaluate`,
        {
          fuel_type: fuelType,
          budget,
          required_qualifications: requiredQualifications.split(',').map((q) => q.trim()), // Convert comma-separated string to array
          required_quality_certificates: requiredQualityCertificates.split(',').map((q) => q.trim()) // Convert comma-separated string to array
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedSupplier(response.data.selectedSupplier); // Set the selected supplier details
      showSnackbar(response.data.message, 'success');
    } catch (error) {
      console.error('Error evaluating bids:', error);
      const errorMessage = error.response?.data?.message || 'Error evaluating bids.';
      showSnackbar(errorMessage, 'error');
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
        Evaluate Bids
      </Typography>
      <TextField
        label="Fuel Type"
        value={fuelType}
        onChange={(e) => setFuelType(e.target.value)}
        fullWidth
        margin="dense"
      />
      <TextField
        label="Budget (RWF)"
        type="number"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        fullWidth
        margin="dense"
      />
      <TextField
        label="Required Qualifications (comma-separated)"
        value={requiredQualifications}
        onChange={(e) => setRequiredQualifications(e.target.value)}
        fullWidth
        margin="dense"
      />
      <TextField
        label="Required Quality Certificates (comma-separated)"
        value={requiredQualityCertificates}
        onChange={(e) => setRequiredQualityCertificates(e.target.value)}
        fullWidth
        margin="dense"
      />
      <Button variant="contained" color="primary" onClick={handleEvaluateBids}>
        Evaluate Bids
      </Button>

      {/* Display Selected Supplier Details */}
      {selectedSupplier && (
        <Box mt={4} p={2} border={1} borderColor="grey.300" borderRadius={4}>
          <Typography variant="h6">Selected Supplier Details:</Typography>
          <Typography><strong>Name:</strong> {selectedSupplier.name}</Typography>
          <Typography><strong>Email:</strong> {selectedSupplier.email}</Typography>
          <Typography><strong>Price per Liter:</strong> {selectedSupplier.pricePerLiter} RWF</Typography>
          <Typography><strong>BOQ Details:</strong> {selectedSupplier.boqDetails}</Typography>
          <Typography><strong>Qualifications:</strong> {selectedSupplier.qualifications}</Typography>
          <Typography><strong>Quality Certificates:</strong> {selectedSupplier.qualityCertificates}</Typography>
        </Box>
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

export default AdminEvaluateBids;
