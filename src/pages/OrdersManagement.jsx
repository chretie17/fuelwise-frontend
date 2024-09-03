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

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentOrder, setCurrentOrder] = useState({ id: '', fuel_type: '', liters: '', supplier_id: '', order_date: '', created_by: 'Manual' });

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showSnackbar('Error fetching orders.', 'error');
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

  const handleOpenDialog = (order = { id: '', fuel_type: '', liters: '', supplier_id: '', order_date: '', created_by: 'Manual' }) => {
    setCurrentOrder(order);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentOrder({ id: '', fuel_type: '', liters: '', supplier_id: '', order_date: '', created_by: 'Manual' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveOrder = async () => {
    try {
      if (currentOrder.id) {
        // Update existing order
        await axios.put(`${API_BASE_URL}/orders/${currentOrder.id}`, currentOrder);
      } else {
        // Create new order
        await axios.post(`${API_BASE_URL}/orders`, currentOrder);
      }
      showSnackbar('Order saved successfully.', 'success');
      fetchOrders();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving order:', error);
      showSnackbar(error.response?.data?.error || 'Error saving order.', 'error');
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/orders/${id}`);
      showSnackbar('Order deleted successfully.', 'success');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      showSnackbar('Error deleting order.', 'error');
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
        Orders Management
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Create New Order
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fuel Type</TableCell>
              <TableCell>Liters</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.fuel_type}</TableCell>
                <TableCell>{order.liters}</TableCell>
                <TableCell>{order.supplier_name}</TableCell>
                <TableCell>{order.order_date}</TableCell>
                <TableCell>{order.created_by}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpenDialog(order)}>
                    Edit
                  </Button>
                  <Button color="secondary" onClick={() => handleDeleteOrder(order.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for adding/updating order */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{currentOrder.id ? 'Edit Order' : 'Create New Order'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Fuel Type"
            name="fuel_type"
            value={currentOrder.fuel_type}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Liters"
            name="liters"
            type="number"
            value={currentOrder.liters}
            onChange={handleInputChange}
            fullWidth
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Supplier</InputLabel>
            <Select
              name="supplier_id"
              value={currentOrder.supplier_id}
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
            label="Order Date"
            name="order_date"
            type="date"
            value={currentOrder.order_date}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveOrder} color="primary">
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

export default OrdersManagement;
