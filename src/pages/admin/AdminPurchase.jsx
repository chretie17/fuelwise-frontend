import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {
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
  Alert,
  Box,
  Container,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#007547',
    },
    secondary: {
      main: '#ffffff',
    },
  },
});

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const AdminFuelPurchasesManagement = () => {
  const [purchases, setPurchases] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentPurchase, setCurrentPurchase] = useState({
    id: '',
    fuel_type: '',
    liters: '',
    total_cost: '',
    purchase_date: '',
    branch_name: '',
  });

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fuel-purchases/all-with-branch`);
      setPurchases(response.data);
    } catch (error) {
      showSnackbar('Error fetching purchases.', 'error');
    }
  };

  const handleOpenDialog = (purchase = { id: '', fuel_type: '', liters: '', total_cost: '', purchase_date: '', branch_name: '' }) => {
    setCurrentPurchase(purchase);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentPurchase({ id: '', fuel_type: '', liters: '', total_cost: '', purchase_date: '', branch_name: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPurchase((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePurchase = async () => {
    try {
      if (currentPurchase.id) {
        await axios.put(`${API_BASE_URL}/fuel-purchases/${currentPurchase.id}`, currentPurchase);
        showSnackbar('Purchase updated successfully.', 'success');
      } else {
        await axios.post(`${API_BASE_URL}/fuel-purchases`, currentPurchase);
        showSnackbar('Purchase added successfully.', 'success');
      }
      fetchPurchases();
      handleCloseDialog();
    } catch (error) {
      showSnackbar('Error saving purchase.', 'error');
    }
  };

  const handleDeletePurchase = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/fuel-purchases/${id}`);
      showSnackbar('Purchase deleted successfully.', 'success');
      fetchPurchases();
    } catch (error) {
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
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom color="primary">
            Admin Fuel Purchases Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mb: 2 }}
          >
            Add New Purchase
          </Button>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Fuel Type</StyledTableCell>
                  <StyledTableCell align="right">Liters</StyledTableCell>
                  <StyledTableCell align="right">Total Cost</StyledTableCell>
                  <StyledTableCell>Purchase Date</StyledTableCell>
                  <StyledTableCell>Branch</StyledTableCell> {/* New branch column */}
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchases.map((purchase) => (
                  <StyledTableRow key={purchase.id}>
                    <TableCell>{purchase.fuel_type}</TableCell>
                    <TableCell align="right">{purchase.liters}</TableCell>
                    <TableCell align="right">{purchase.total_cost}</TableCell>
                    <TableCell>{purchase.purchase_date}</TableCell>
                    <TableCell>{purchase.branch_name}</TableCell> {/* Display branch name */}
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpenDialog(purchase)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeletePurchase(purchase.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>{currentPurchase.id ? 'Edit Purchase' : 'Add New Purchase'}</DialogTitle>
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
              label="Total Cost"
              name="total_cost"
              type="number"
              value={currentPurchase.total_cost}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Purchase Date"
              name="purchase_date"
              type="date"
              value={currentPurchase.purchase_date}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSavePurchase} color="primary" variant="contained">
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
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default AdminFuelPurchasesManagement;
