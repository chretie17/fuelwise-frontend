import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, MenuItem, Select, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../api';

const SupplierBidding = () => {
  const [boqItems, setBoqItems] = useState([]);
  const [bidDetails, setBidDetails] = useState({ boq_id: '', bid_price_per_unit: '', qualifications: '', quality_certificates: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  // Fetch available BOQ items
  useEffect(() => {
    axios.get(`${API_BASE_URL}/boq`).then(response => {
      setBoqItems(response.data);
    });
  }, []);

  const handleSubmitBid = async () => {
    const userId = localStorage.getItem('userId'); // Get userId from local storage
    const bidWithUserId = { ...bidDetails, user_id: userId }; // Add user_id to the bid details

    try {
      const response = await axios.post(`${API_BASE_URL}/bids/submit`, bidWithUserId, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token for authentication
        },
      });
      showSnackbar('Bid submitted successfully', 'success');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error submitting bid';
      showSnackbar(errorMessage, 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Submit Your Bid</Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>BOQ ID</TableCell>
            <TableCell>Fuel Type</TableCell>
            <TableCell>Quantity (Liters)</TableCell>
            <TableCell>Estimated Price per Unit (RWF)</TableCell>
            <TableCell>Deadline</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {boqItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.fuel_type}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.estimated_price_per_unit}</TableCell>
              <TableCell>{item.deadline}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dropdown for BOQ ID */}
      <FormControl fullWidth margin="dense">
        <InputLabel id="boq-id-label">Select BOQ ID</InputLabel>
        <Select
          labelId="boq-id-label"
          value={bidDetails.boq_id}
          onChange={(e) => setBidDetails({ ...bidDetails, boq_id: e.target.value })}
          fullWidth
        >
          {boqItems.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.id} - {item.fuel_type} (Qty: {item.quantity} Liters)
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Your Bid Price per Unit (RWF)"
        type="number"
        value={bidDetails.bid_price_per_unit}
        onChange={(e) => setBidDetails({ ...bidDetails, bid_price_per_unit: e.target.value })}
        fullWidth
        margin="dense"
      />
      <TextField
        label="Qualifications"
        value={bidDetails.qualifications}
        onChange={(e) => setBidDetails({ ...bidDetails, qualifications: e.target.value })}
        fullWidth
        margin="dense"
      />
      <TextField
        label="Quality Certificates"
        value={bidDetails.quality_certificates}
        onChange={(e) => setBidDetails({ ...bidDetails, quality_certificates: e.target.value })}
        fullWidth
        margin="dense"
      />
      <Button variant="contained" color="primary" onClick={handleSubmitBid} style={{ marginTop: '15px' }}>
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
