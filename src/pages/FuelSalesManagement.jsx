// src/pages/FuelSalesManagement.jsx
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert
} from '@mui/material';

const FuelSalesManagement = () => {
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentSale, setCurrentSale] = useState({ id: '', fuel_type: '', liters: '', sale_price_per_liter: '', sale_date: '' });

  useEffect(() => {
    fetchSales();
    fetchInventory();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fuel-sales`);
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
      showSnackbar('Error fetching sales.', 'error');
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory`);
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      showSnackbar('Error fetching inventory.', 'error');
    }
  };

  const handleOpenDialog = (sale = { id: '', fuel_type: '', liters: '', sale_price_per_liter: '', sale_date: '' }) => {
    setCurrentSale(sale);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentSale({ id: '', fuel_type: '', liters: '', sale_price_per_liter: '', sale_date: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSale((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSale = async () => {
    try {
      if (currentSale.id) {
        // Update existing sale
        await axios.put(`${API_BASE_URL}/fuel-sales/${currentSale.id}`, currentSale);
      } else {
        // Create new sale
        await axios.post(`${API_BASE_URL}/fuel-sales`, currentSale);
      }
      showSnackbar('Fuel sale saved successfully.', 'success');
      fetchSales();
      fetchInventory(); // Refresh inventory to reflect deduction
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving sale:', error);
      showSnackbar(error.response?.data?.error || 'Error saving sale.', 'error');
    }
  };

  const handleDeleteSale = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/fuel-sales/${id}`);
      showSnackbar('Fuel sale deleted successfully.', 'success');
      fetchSales();
    } catch (error) {
      console.error('Error deleting sale:', error);
      showSnackbar('Error deleting sale.', 'error');
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
        Fuel Sales Management
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Record New Sale
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fuel Type</TableCell>
              <TableCell>Liters</TableCell>
              <TableCell>Sale Price per Liter (RWF)</TableCell>
              <TableCell>Total Revenue (RWF)</TableCell>
              <TableCell>Sale Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.fuel_type}</TableCell>
                <TableCell>{sale.liters}</TableCell>
                <TableCell>{sale.sale_price_per_liter}</TableCell>
                <TableCell>{sale.total_revenue}</TableCell>
                <TableCell>{sale.sale_date}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpenDialog(sale)}>
                    Edit
                  </Button>
                  <Button color="secondary" onClick={() => handleDeleteSale(sale.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for adding/updating sale */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{currentSale.id ? 'Edit Sale' : 'Record New Sale'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Fuel Type</InputLabel>
            <Select
              name="fuel_type"
              value={currentSale.fuel_type}
              onChange={handleInputChange}
            >
              {inventory.map((item) => (
                <MenuItem key={item.id} value={item.fuel_type}>
                  {item.fuel_type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Liters"
            name="liters"
            type="number"
            value={currentSale.liters}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Sale Price per Liter (RWF)"
            name="sale_price_per_liter"
            value={currentSale.sale_price_per_liter}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Sale Date"
            name="sale_date"
            type="date"
            value={currentSale.sale_date}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveSale} color="primary">
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

export default FuelSalesManagement;
