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
} from '@mui/material';
import { styled } from '@mui/system';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalGasStation as FuelIcon,
  AttachMoney as PriceIcon,
  CalendarToday as DateIcon,
} from '@mui/icons-material';

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
      paper: '#ffffff',
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

const FuelSalesManagement = () => {
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentSale, setCurrentSale] = useState({
    id: '',
    fuel_type: '',
    liters: '',
    sale_price_per_liter: '',
    sale_date: '',
    payment_mode: '',
  });

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

  const handleOpenDialog = (
    sale = { id: '', fuel_type: '', liters: '', sale_price_per_liter: '', sale_date: '', payment_mode: '' }
  ) => {
    setCurrentSale(sale);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentSale({ id: '', fuel_type: '', liters: '', sale_price_per_liter: '', sale_date: '', payment_mode: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSale((prev) => ({ ...prev, [name]: value }));
  };

  const handleFuelTypeChange = (e) => {
    const fuel_type = e.target.value;
    const selectedFuel = inventory.find((item) => item.fuel_type === fuel_type);
    const sale_price_per_liter = selectedFuel ? selectedFuel.unit_price : '';

    setCurrentSale((prev) => ({
      ...prev,
      fuel_type,
      sale_price_per_liter,
    }));
  };

  const handleSaveSale = async () => {
    try {
      if (!currentSale.sale_date) {
        throw new Error("Sale date is missing or invalid.");
      }

      const saleData = {
        ...currentSale,
        sale_date: currentSale.sale_date,  // No transformation needed, it's already in YYYY-MM-DD format
      };

      if (currentSale.id) {
        await axios.put(`${API_BASE_URL}/fuel-sales/${currentSale.id}`, saleData);
      } else {
        await axios.post(`${API_BASE_URL}/fuel-sales`, saleData);
      }

      showSnackbar('Fuel sale saved successfully.', 'success');
      fetchSales();
      fetchInventory();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving sale:', error);
      showSnackbar(error.message || 'Error saving sale.', 'error');
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
    <ThemeProvider theme={theme}>
      <StyledContainer>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" color="primary">
            Fuel Sales Management
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Record New Sale
          </Button>
        </Box>
        <StyledTableContainer component={Paper}>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>Fuel Type</TableCell>
                <TableCell>Liters</TableCell>
                <TableCell>Sale Price per Liter (RWF)</TableCell>
                <TableCell>Total Revenue (RWF)</TableCell>
                <TableCell>Sale Date</TableCell>
                <TableCell>Payment Mode</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {sales.map((sale) => (
                <StyledTableRow key={sale.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <FuelIcon color="primary" sx={{ mr: 1 }} />
                      {sale.fuel_type}
                    </Box>
                  </TableCell>
                  <TableCell>{sale.liters}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <PriceIcon color="primary" sx={{ mr: 1 }} />
                      {sale.sale_price_per_liter}
                    </Box>
                  </TableCell>
                  <TableCell>{sale.total_revenue}</TableCell>
                  <TableCell>{sale.sale_date}</TableCell> {/* Directly show the date string */}
                  <TableCell>{sale.payment_mode}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => handleOpenDialog(sale)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="secondary" onClick={() => handleDeleteSale(sale.id)}>
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
          <DialogTitle>{currentSale.id ? 'Edit Sale' : 'Record New Sale'}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Fuel Type</InputLabel>
              <Select
                name="fuel_type"
                value={currentSale.fuel_type}
                onChange={handleFuelTypeChange}
                startAdornment={<FuelIcon color="primary" />}
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
              InputProps={{
                startAdornment: <FuelIcon color="primary" />,
              }}
            />
            <TextField
              margin="dense"
              label="Sale Price per Liter (RWF)"
              name="sale_price_per_liter"
              value={currentSale.sale_price_per_liter}
              onChange={handleInputChange}
              fullWidth
              disabled
              InputProps={{
                startAdornment: <PriceIcon color="primary" />,
              }}
            />
            <TextField
              margin="dense"
              label="Sale Date"
              name="sale_date"
              type="date" // Ensure date-only input
              value={currentSale.sale_date}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <DateIcon color="primary" />,
              }}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Payment Mode</InputLabel>
              <Select
                name="payment_mode"
                value={currentSale.payment_mode}
                onChange={handleInputChange}
                startAdornment={<PriceIcon color="primary" />}
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Card">Card</MenuItem>
                <MenuItem value="Mobile Money">Mobile Money</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveSale} color="primary" startIcon={<AddIcon />}>
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

export default FuelSalesManagement;
