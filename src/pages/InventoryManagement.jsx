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
  Fab,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { styled } from '@mui/system';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalGasStation as GasIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#007547',
      light: '#4caf50',
      dark: '#00421a',
    },
    secondary: {
      main: '#ff6b6b',
    },
    background: {
      default: '#f0f4f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 10px rgba(0, 117, 71, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
        },
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(0, 117, 71, 0.08)',
          color: '#007547',
        },
      },
    },
  },
});

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const InventoryManagement = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentItem, setCurrentItem] = useState({ id: null, fuel_type: 'Petrol', liters: '', unit_price: '', date_received: '', branch_id: '' });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/branches`);
      setBranches(response.data);
    } catch (error) {
      showSnackbar('Error fetching branches.', 'error');
    }
  };

  const fetchInventoryForBranch = async (branchId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory/branch/${branchId}`);
      setInventory(response.data);
      setSelectedBranch(branchId);
    } catch (error) {
      showSnackbar('Error fetching inventory for the selected branch.', 'error');
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setCurrentItem({ ...item, branch_id: selectedBranch });
    } else {
      setCurrentItem({ id: null, fuel_type: 'Petrol', liters: '', unit_price: '', date_received: '', branch_id: selectedBranch });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentItem({ id: null, fuel_type: 'Petrol', liters: '', unit_price: '', date_received: '', branch_id: selectedBranch });
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
      fetchInventoryForBranch(selectedBranch);
      handleCloseDialog();
    } catch (error) {
      showSnackbar('Error saving inventory item.', 'error');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/inventory/${id}`);
      showSnackbar('Inventory item deleted successfully.', 'success');
      fetchInventoryForBranch(selectedBranch);
    } catch (error) {
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
      <StyledContainer maxWidth="lg">
        {!selectedBranch ? (
          <>
            <Typography variant="h4" color="primary" mb={4} align="center">
              Select a Branch to View Inventory
            </Typography>
            <Grid container spacing={3}>
              {branches.map((branch) => (
                <Grid item xs={12} sm={6} md={4} key={branch.id}>
                  <StyledCard>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {branch.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {branch.location}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<GasIcon />}
                        onClick={() => fetchInventoryForBranch(branch.id)}
                      >
                        View Inventory
                      </Button>
                    </CardActions>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h4" color="primary">
                {branches.find((b) => b.id === selectedBranch)?.name} Inventory
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setSelectedBranch(null)}
                startIcon={<ArrowBackIcon />}
              >
                Back to Branches
              </Button>
            </Box>
            <StyledTableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fuel Type</TableCell>
                    <TableCell align="right">Liters</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell>Date Received</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{item.fuel_type}</TableCell>
                      <TableCell align="right">{item.liters}</TableCell>
                      <TableCell align="right">{item.unit_price}</TableCell>
                      <TableCell>{item.date_received}</TableCell>
                      <TableCell align="center">
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>

            <Fab
              color="primary"
              aria-label="add"
              sx={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                boxShadow: '0 4px 10px rgba(0, 117, 71, 0.3)',
              }}
              onClick={() => handleOpenDialog()}
            >
              <AddIcon />
            </Fab>
          </>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>{currentItem.id ? 'Edit Inventory Item' : 'Add Inventory Item'}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Fuel Type</InputLabel>
              <Select
                name="fuel_type"
                value={currentItem.fuel_type}
                onChange={handleInputChange}
              >
                <MenuItem value="Petrol">Petrol</MenuItem>
                <MenuItem value="Diesel">Diesel</MenuItem>
              </Select>
            </FormControl>
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
            <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
            <Button onClick={handleSaveItem} color="primary" variant="contained">
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