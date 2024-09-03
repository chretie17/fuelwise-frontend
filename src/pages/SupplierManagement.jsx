// src/pages/SupplierManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import {
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentSupplier, setCurrentSupplier] = useState({ name: '', email: '', contact_details: '', certification: '', performance_history: '', price_per_liter: '' });

  // Fetch all suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/suppliers`);
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      showSnackbar('Error fetching suppliers.', 'error');
    }
  };

  const handleOpenDialog = (supplier = { name: '', email: '', contact_details: '', certification: '', performance_history: '', price_per_liter: '' }) => {
    setCurrentSupplier(supplier);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentSupplier({ name: '', email: '', contact_details: '', certification: '', performance_history: '', price_per_liter: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSupplier = async () => {
    try {
      if (currentSupplier.id) {
        // Update existing supplier
        await axios.put(`${API_BASE_URL}/suppliers/${currentSupplier.id}`, currentSupplier);
        showSnackbar('Supplier updated successfully.', 'success');
      } else {
        // Create new supplier
        await axios.post(`${API_BASE_URL}/suppliers`, currentSupplier);
        showSnackbar('Supplier added successfully.', 'success');
      }
      fetchSuppliers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving supplier:', error);
      showSnackbar('Error saving supplier.', 'error');
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/suppliers/${id}`);
      showSnackbar('Supplier deleted successfully.', 'success');
      fetchSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error);
      showSnackbar('Error deleting supplier.', 'error');
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
        Supplier Management
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Add Supplier
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact Details</TableCell>
              <TableCell>Certification</TableCell>
              <TableCell>Performance History</TableCell>
              <TableCell>Price per Liter (RWF)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.contact_details}</TableCell>
                <TableCell>{supplier.certification}</TableCell>
                <TableCell>{supplier.performance_history}</TableCell>
                <TableCell>{supplier.price_per_liter}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpenDialog(supplier)}>
                    Edit
                  </Button>
                  <Button color="secondary" onClick={() => handleDeleteSupplier(supplier.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for adding/updating supplier */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{currentSupplier.id ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={currentSupplier.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={currentSupplier.email}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Contact Details"
            name="contact_details"
            value={currentSupplier.contact_details}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Certification"
            name="certification"
            value={currentSupplier.certification}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Performance History"
            name="performance_history"
            value={currentSupplier.performance_history}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Price per Liter (RWF)"
            name="price_per_liter"
            type="number"
            value={currentSupplier.price_per_liter}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveSupplier} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

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

export default SupplierManagement;
