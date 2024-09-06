import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import { Container, Typography, TextField, Button, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const AdminFuelProcurement = () => {
  const [fuelType, setFuelType] = useState('');
  const [budget, setBudget] = useState('');
  const [currentBudget, setCurrentBudget] = useState(null); // To display current budget
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch the current budget when the fuel type is selected
  useEffect(() => {
    const fetchBudget = async () => {
      if (fuelType) {
        try {
          const token = localStorage.getItem('token'); // Retrieve token from local storage
          const response = await axios.get(`${API_BASE_URL}/procurement/budget?fuel_type=${fuelType}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCurrentBudget(response.data.budget);
        } catch (error) {
          console.error('Error fetching budget:', error);
          showSnackbar('Error fetching budget.', 'error');
        }
      }
    };

    fetchBudget();
  }, [fuelType]);

  const handleSetBudget = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    try {
      await axios.post(
        `${API_BASE_URL}/procurement/set-budget`,
        { fuel_type: fuelType, budget },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSnackbar('Budget set successfully.', 'success');
      setCurrentBudget(budget); // Update the displayed current budget after successful setting
    } catch (error) {
      console.error('Error setting budget:', error);
      showSnackbar('Error setting budget.', 'error');
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
        Admin: Fuel Procurement Budget Management
      </Typography>
      
      {/* Select Fuel Type */}
      <FormControl fullWidth margin="dense">
        <InputLabel>Fuel Type</InputLabel>
        <Select
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
        >
          <MenuItem value="Petrol">Petrol</MenuItem>
          <MenuItem value="Diesel">Diesel</MenuItem>
          <MenuItem value="Gasoline">Gasoline</MenuItem>

          {/* Add more fuel types as needed */}
        </Select>
      </FormControl>

      {/* Display Current Budget */}
      {fuelType && currentBudget !== null && (
        <Typography variant="h6" gutterBottom>
          Current Budget for {fuelType}: {currentBudget} RWF
        </Typography>
      )}

      {/* Input for New Budget */}
      <TextField
        label="Set New Budget (RWF)"
        type="number"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        fullWidth
        margin="dense"
      />
      <Button variant="contained" color="primary" onClick={handleSetBudget}>
        Set Budget
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

export default AdminFuelProcurement;
