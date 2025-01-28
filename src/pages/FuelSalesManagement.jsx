import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  TextField,
} from '@mui/material';
import { styled } from '@mui/system';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalGasStation as FuelIcon,
  AttachMoney as PriceIcon,
} from '@mui/icons-material';

const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your actual API URL

// Theme for styling
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

// Styled container
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
  const [branchName, setBranchName] = useState(''); // State for branch name
  const [sales, setSales] = useState([]); // State for sales data
  const [inventory, setInventory] = useState([]); // State for inventory
  const [openDialog, setOpenDialog] = useState(false); // State for dialog visibility
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' }); // Snackbar state
  const [currentSale, setCurrentSale] = useState({
    fuel_type: '',
    liters: '',
    sale_price_per_liter: '',
    sale_date: '',
    payment_mode: '',
  });

  // Get branch ID from local storage
  const managerBranchId = localStorage.getItem('branch'); // Assuming '3' is set for testing

  useEffect(() => {
    if (managerBranchId) {
      fetchBranchDetails(managerBranchId);
      fetchSales(managerBranchId);
      fetchInventory(managerBranchId);
    }
  }, [managerBranchId]);

  // Fetch branch details
  const fetchBranchDetails = async (branchId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/branches/${branchId}`);
      setBranchName(response.data.name || 'Unknown Branch');
    } catch (error) {
      console.error('Error fetching branch details:', error);
      setBranchName('No Branch Found');
    }
  };

  // Fetch sales data
  const fetchSales = async (branchId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fuel-sales`, {
        params: { branch_id: branchId },
      });
      setSales(response.data.length ? response.data : []);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setSales([]);
    }
  };

  // Fetch inventory data
  const fetchInventory = async (branchId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory/branch/${branchId}`);
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setInventory([]);
    }
  };

  // Open the dialog for adding/editing a sale
  const handleOpenDialog = (sale = { fuel_type: '', liters: '', sale_price_per_liter: '', sale_date: '', payment_mode: '' }) => {
    setCurrentSale(sale);
    setOpenDialog(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentSale({ fuel_type: '', liters: '', sale_price_per_liter: '', sale_date: '', payment_mode: '' });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSale((prev) => ({ ...prev, [name]: value }));
  };

  // Save a sale (add or edit)
  const handleFuelTypeChange = (e) => {
    const selectedFuelType = e.target.value;
    const selectedInventoryItem = inventory.find(
      (item) => item.fuel_type === selectedFuelType
    );
  
    setCurrentSale((prev) => ({
      ...prev,
      fuel_type: selectedFuelType,
      sale_price_per_liter: selectedInventoryItem ? selectedInventoryItem.unit_price : '',
      liters: '', // Reset liters when fuel type changes
    }));
  };
  
  const handleLitersChange = (e) => {
    const liters = parseFloat(e.target.value) || 0; // Ensure a number
    setCurrentSale((prev) => ({
      ...prev,
      liters,
      total_revenue: liters * (parseFloat(prev.sale_price_per_liter) || 0), // Calculate total
    }));
  };
  
  const handleSalePriceChange = (e) => {
    const sale_price_per_liter = parseFloat(e.target.value) || 0;
    setCurrentSale((prev) => ({
      ...prev,
      sale_price_per_liter,
      total_revenue: (parseFloat(prev.liters) || 0) * sale_price_per_liter, // Calculate total
    }));
  };
  
  const handleSaveSale = async () => {
    try {
      if (!currentSale.sale_date || !currentSale.fuel_type || !currentSale.liters || !currentSale.payment_mode) {
        throw new Error('Please fill in all required fields.');
      }
  
      const saleData = {
        ...currentSale,
        branch_id: managerBranchId,
      };
  
      if (currentSale.id) {
        await axios.put(`${API_BASE_URL}/fuel-sales/${currentSale.id}`, saleData);
      } else {
        await axios.post(`${API_BASE_URL}/fuel-sales`, saleData);
      }
  
      showSnackbar('Fuel sale saved successfully.', 'success');
      fetchSales(managerBranchId);
      fetchInventory(managerBranchId);
      handleCloseDialog();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        // Show the server-provided error message
        showSnackbar(error.response.data.error, 'error');
      } else {
        // Fallback to a generic error message
        showSnackbar('Error saving sale.', 'error');
      }
      console.error('Error saving sale:', error);
    }
  };
  

  // Show snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledContainer>
        {/* Branch name */}
        <Typography variant="h5" color="primary" gutterBottom>
          Branch: {branchName || 'Loading...'}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" color="primary">
            Fuel Sales Management
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Record New Sale
          </Button>
        </Box>

        {/* Sales table */}
        {sales.length > 0 ? (
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
                    <TableCell>{sale.fuel_type}</TableCell>
                    <TableCell>{sale.liters}</TableCell>
                    <TableCell>{sale.sale_price_per_liter}</TableCell>
                    <TableCell>{sale.total_revenue}</TableCell>
                    <TableCell>{sale.sale_date}</TableCell>
                    <TableCell>{sale.payment_mode}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => handleOpenDialog(sale)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="secondary">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        ) : (
          <Typography variant="body1" color="textSecondary" align="center">
            No sales data available.
          </Typography>
        )}

        {/* Dialog for adding/editing sales */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{currentSale.id ? 'Edit Sale' : 'Record New Sale'}</DialogTitle>
          <DialogContent className="p-8 bg-gradient-to-br from-gray-50 to-white">
              <div className="space-y-6">
                {/* Fuel Type Selection */}
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-[#007547]">
                    Fuel Type
                  </label>
                  <FormControl fullWidth variant="outlined">
                    <Select
                      name="fuel_type"
                      value={currentSale.fuel_type}
                      onChange={handleFuelTypeChange}
                      className="bg-white shadow-sm hover:shadow transition-shadow duration-200"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e5e7eb',
                          borderWidth: '2px'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#007547'
                        },
                        borderRadius: '0.75rem'
                      }}
                    >
                      {inventory.map((item) => (
                        <MenuItem key={item.id} value={item.fuel_type}>
                          <div className="flex items-center py-1.5">
                            <div className="p-2 rounded-full bg-[#007547]/10 mr-3">
                              <FuelIcon className="text-[#007547]" />
                            </div>
                            <span className="font-medium">{item.fuel_type}</span>
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Liters Input */}
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-[#007547]">
                    Liters
                  </label>
                  <TextField
                    name="liters"
                    type="number"
                    value={currentSale.liters}
                    onChange={handleLitersChange}
                    fullWidth
                    variant="outlined"
                    placeholder="Enter amount in liters"
                    InputProps={{
                      startAdornment: (
                        <div className="p-2 rounded-full bg-[#007547]/10 mr-3">
                          <FuelIcon className="text-[#007547]" />
                        </div>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '0.75rem',
                        backgroundColor: 'white',
                        '& fieldset': {
                          borderColor: '#e5e7eb',
                          borderWidth: '2px'
                        },
                        '&:hover fieldset': {
                          borderColor: '#007547'
                        }
                      }
                    }}
                    className="shadow-sm hover:shadow transition-shadow duration-200"
                  />
                </div>

                {/* Sale Price */}
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-[#007547]">
                    Sale Price per Liter (RWF)
                  </label>
                  <TextField
                    name="sale_price_per_liter"
                    type="number"
                    value={currentSale.sale_price_per_liter}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <div className="p-2 rounded-full bg-[#007547]/10 mr-3">
                          <PriceIcon className="text-[#007547]" />
                        </div>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '0.75rem',
                        backgroundColor: '#f9fafb',
                        '& fieldset': {
                          borderColor: '#e5e7eb',
                          borderWidth: '2px'
                        }
                      }
                    }}
                    className="shadow-sm"
                  />
                </div>

                {/* Total Revenue */}
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-[#007547]">
                    Total Revenue (RWF)
                  </label>
                  <TextField
                    name="total_revenue"
                    type="number"
                    value={currentSale.total_revenue || ''}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <div className="p-2 rounded-full bg-[#007547]/10 mr-3">
                          <PriceIcon className="text-[#007547]" />
                        </div>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '0.75rem',
                        backgroundColor: '#f9fafb',
                        '& fieldset': {
                          borderColor: '#e5e7eb',
                          borderWidth: '2px'
                        }
                      }
                    }}
                    className="shadow-sm"
                  />
                </div>

                {/* Sale Date */}
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-[#007547]">
                    Sale Date
                  </label>
                  <TextField
                    name="sale_date"
                    type="date"
                    value={currentSale.sale_date}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '0.75rem',
                        backgroundColor: 'white',
                        '& fieldset': {
                          borderColor: '#e5e7eb',
                          borderWidth: '2px'
                        },
                        '&:hover fieldset': {
                          borderColor: '#007547'
                        }
                      }
                    }}
                    className="shadow-sm hover:shadow transition-shadow duration-200"
                  />
                </div>

                {/* Payment Mode */}
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-[#007547]">
                    Payment Mode
                  </label>
                  <FormControl fullWidth variant="outlined">
                    <Select
                      name="payment_mode"
                      value={currentSale.payment_mode}
                      onChange={handleInputChange}
                      className="bg-white shadow-sm hover:shadow transition-shadow duration-200"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e5e7eb',
                          borderWidth: '2px'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#007547'
                        },
                        borderRadius: '0.75rem'
                      }}
                    >
                      {[
                        { value: 'Cash', icon: <PriceIcon /> },
                        { value: 'Card', icon: <PriceIcon /> },
                        { value: 'Mobile Money', icon: <PriceIcon /> }
                      ].map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <div className="flex items-center py-1.5">
                            <div className="p-2 rounded-full bg-[#007547]/10 mr-3">
                              {option.icon}
                            </div>
                            <span className="font-medium">{option.value}</span>
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
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
      </StyledContainer>
    </ThemeProvider>
  );
};

export default FuelSalesManagement;
