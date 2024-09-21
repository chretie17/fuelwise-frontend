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
import { CreditCard, Droplet, Calendar } from 'lucide-react';

const FuelPurchasesManagement = () => {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentPurchase, setCurrentPurchase] = useState({ id: '', fuel_type: '', liters: '', unit_price: '', total_cost: '', supplier_id: '', purchase_date: '' });

  useEffect(() => {
    fetchPurchases();
    fetchSuppliers();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fuel-purchases`);
      setPurchases(response.data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      showSnackbar('Error fetching purchases.', 'error');
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

  const handleOpenDialog = (purchase = { id: '', fuel_type: '', liters: '', unit_price: '', total_cost: '', supplier_id: '', purchase_date: '' }) => {
    setCurrentPurchase(purchase);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentPurchase({ id: '', fuel_type: '', liters: '', unit_price: '', total_cost: '', supplier_id: '', purchase_date: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPurchase((prev) => {
      const updatedPurchase = { ...prev, [name]: value };
      
      if (name === 'unit_price' || name === 'liters') {
        const unitPrice = parseFloat(updatedPurchase.unit_price) || 0;
        const liters = parseFloat(updatedPurchase.liters) || 0;
        updatedPurchase.total_cost = (unitPrice * liters).toFixed(2);
      }

      return updatedPurchase;
    });
  };

  const handleSavePurchase = async () => {
    try {
      if (currentPurchase.id) {
        await axios.put(`${API_BASE_URL}/fuel-purchases/${currentPurchase.id}`, currentPurchase);
      } else {
        await axios.post(`${API_BASE_URL}/fuel-purchases`, currentPurchase);
      }
      showSnackbar('Fuel purchase saved successfully.', 'success');
      fetchPurchases();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving purchase:', error);
      showSnackbar(error.response?.data?.error || 'Error saving purchase.', 'error');
    }
  };

  const handleDeletePurchase = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/fuel-purchases/${id}`);
      showSnackbar('Fuel purchase deleted successfully.', 'success');
      fetchPurchases();
    } catch (error) {
      console.error('Error deleting purchase:', error);
      showSnackbar('Error deleting purchase.', 'error');
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
      <Typography variant="h4" gutterBottom style={{ color: '#007547' }}>
        Fuel Purchases Management
      </Typography>
      <Button variant="contained" style={{ backgroundColor: '#007547', color: 'white' }} onClick={() => handleOpenDialog()}>
        Record New Purchase
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#007547' }}>
              <TableCell style={{ color: 'white' }}>Fuel Type</TableCell>
              <TableCell style={{ color: 'white' }}>Liters</TableCell>
              <TableCell style={{ color: 'white' }}>Total Cost (RWF)</TableCell>
              <TableCell style={{ color: 'white' }}>Supplier</TableCell>
              <TableCell style={{ color: 'white' }}>Purchase Date</TableCell>
              <TableCell style={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Droplet color="#007547" size={20} style={{ marginRight: '8px' }} />
                    {purchase.fuel_type}
                  </div>
                </TableCell>
                <TableCell>{purchase.liters}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CreditCard color="#007547" size={20} style={{ marginRight: '8px' }} />
                    {purchase.total_cost}
                  </div>
                </TableCell>
                <TableCell>{purchase.supplier_name}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Calendar color="#007547" size={20} style={{ marginRight: '8px' }} />
                    {purchase.purchase_date}
                  </div>
                </TableCell>
                <TableCell>
                  <Button style={{ color: '#007547' }} onClick={() => handleOpenDialog(purchase)}>
                    Edit
                  </Button>
                  <Button style={{ color: '#007547' }} onClick={() => handleDeletePurchase(purchase.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle style={{ color: '#007547' }}>{currentPurchase.id ? 'Edit Purchase' : 'Record New Purchase'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Fuel Type"
            name="fuel_type"
            value={currentPurchase.fuel_type}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Liters"
            name="liters"
            type="number"
            value={currentPurchase.liters}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Unit Price (RWF)"
            name="unit_price"
            type="number"
            value={currentPurchase.unit_price}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Total Cost (RWF)"
            name="total_cost"
            value={currentPurchase.total_cost}
            onChange={handleInputChange}
            fullWidth
            disabled
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Supplier</InputLabel>
            <Select
              name="supplier_id"
              value={currentPurchase.supplier_id}
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
            label="Purchase Date"
            name="purchase_date"
            type="date"
            value={currentPurchase.purchase_date}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSavePurchase} style={{ color: '#007547' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

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

export default FuelPurchasesManagement;