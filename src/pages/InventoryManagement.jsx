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
  Alert,
  IconButton,
  Box,
  Tooltip,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { styled } from '@mui/system';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalGasStation as FuelIcon,
  AttachMoney as PriceIcon,
  Business as SupplierIcon,
  DateRange as DateIcon,
} from '@mui/icons-material';
import MoneyIcon from '@mui/icons-material/Money';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#007547',
    },
    secondary: {
      main: '#ff6b6b',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  marginTop: theme.spacing(4),
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '& .MuiTableCell-head': {
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

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
    <ThemeProvider theme={theme}>
      <StyledContainer>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" color="primary">
            Inventory Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Inventory Item
          </Button>
        </Box>
        <StyledTableContainer component={Paper}>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>Fuel Type</TableCell>
                <TableCell>Liters</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Date Received</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {inventory.map((item) => (
                <StyledTableRow key={item.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <FuelIcon color="primary" sx={{ mr: 1 }} />
                      {item.fuel_type}
                    </Box>
                  </TableCell>
                  <TableCell>{item.liters}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <MoneyIcon color="primary" sx={{ mr: 1 }} />
                      {item.unit_price}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <SupplierIcon color="primary" sx={{ mr: 1 }} />
                      {item.supplier_name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <DateIcon color="primary" sx={{ mr: 1 }} />
                      {item.date_received}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => handleOpenDialog(item)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="secondary" onClick={() => handleDeleteItem(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>

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
              label="Liters"
              name="liters"
              type="number"
              value={currentItem.liters}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Unit Price"
              name="unit_price"
              type="number"
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
            <Button onClick={handleSaveItem} color="primary" startIcon={<AddIcon />}>
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
      </StyledContainer>
    </ThemeProvider>
  );
};

export default InventoryManagement;