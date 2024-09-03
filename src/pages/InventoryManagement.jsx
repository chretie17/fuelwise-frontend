// src/pages/InventoryManagement.jsx
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

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentItem, setCurrentItem] = useState({ fuel_type: '', liters: '', unit_price: '', supplier_id: '', date_received: '' });

  useEffect(() => {
    fetchInventory();
    fetchSuppliers();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory`);
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      showSnackbar('Error fetching inventory.', 'error');
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/suppliers`);
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      showSnackbar('Error fetching suppliers.', 'error');
    }
  };

  const handleOpenDialog = (item = { fuel_type: '', liters: '', unit_price: '', supplier_id: '', date_received: '' }) => {
    setCurrentItem(item);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentItem({ fuel_type: '', liters: '', unit_price: '', supplier_id: '', date_received: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveItem = async () => {
    try {
      if (currentItem.id) {
        await axios.put(`${API_BASE_URL}/inventory/${currentItem.id}`, currentItem);
        showSnackbar('Inventory item updated successfully.', 'success');
      } else {
        await axios.post(`${API_BASE_URL}/inventory`, currentItem);
        showSnackbar('Inventory item added successfully.', 'success');
      }
      fetchInventory();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving inventory item:', error);
      showSnackbar('Error saving inventory item.', 'error');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/inventory/${id}`);
      showSnackbar('Inventory item deleted successfully.', 'success');
      fetchInventory();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      showSnackbar('Error deleting inventory item.', 'error');
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
        Inventory Management
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Add Inventory Item
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fuel Type</TableCell>
              <TableCell>Liters</TableCell> {/* Updated from Quantity to Liters */}
              <TableCell>Unit Price</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Date Received</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.fuel_type}</TableCell>
                <TableCell>{item.liters}</TableCell> {/* Updated from Quantity to Liters */}
                <TableCell>{item.unit_price}</TableCell>
                <TableCell>{item.supplier_name}</TableCell>
                <TableCell>{item.date_received}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpenDialog(item)}>
                    Edit
                  </Button>
                  <Button color="secondary" onClick={() => handleDeleteItem(item.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for adding/updating inventory item */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{currentItem.id ? 'Edit Inventory Item' : 'Add Inventory Item'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Fuel Type"
            name="fuel_type"
            value={currentItem.fuel_type}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Liters"  // Updated label from Quantity to Liters
            name="liters"
            value={currentItem.liters}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Unit Price"
            name="unit_price"
            value={currentItem.unit_price}
            onChange={handleInputChange}
            fullWidth
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Supplier</InputLabel>
            <Select
              name="supplier_id"
              value={currentItem.supplier_id}
              onChange={handleInputChange}
            >
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Date Received"
            name="date_received"
            type="date"
            value={currentItem.date_received}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveItem} color="primary">
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

export default InventoryManagement;
