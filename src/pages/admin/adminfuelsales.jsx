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

const AdminFuelSalesManagement = () => {
  const [sales, setSales] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentSale, setCurrentSale] = useState({
    id: '',
    fuel_type: '',
    liters: '',
    sale_price_per_liter: '',
    sale_date: '',
    payment_mode: '',
    branch_name: '',
  });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fuel-sales/all-with-branch`);
      setSales(response.data);
    } catch (error) {
      showSnackbar('Error fetching sales.', 'error');
    }
  };

  const handleOpenDialog = (sale = { id: '', fuel_type: '', liters: '', sale_price_per_liter: '', sale_date: '', payment_mode: '', branch_name: '' }) => {
    setCurrentSale(sale);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentSale({ id: '', fuel_type: '', liters: '', sale_price_per_liter: '', sale_date: '', payment_mode: '', branch_name: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSale((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSale = async () => {
    try {
      if (currentSale.id) {
        await axios.put(`${API_BASE_URL}/fuel-sales/${currentSale.id}`, currentSale);
        showSnackbar('Sale updated successfully.', 'success');
      } else {
        await axios.post(`${API_BASE_URL}/fuel-sales`, currentSale);
        showSnackbar('Sale added successfully.', 'success');
      }
      fetchSales();
      handleCloseDialog();
    } catch (error) {
      showSnackbar('Error saving sale.', 'error');
    }
  };

  const handleDeleteSale = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/fuel-sales/${id}`);
      showSnackbar('Sale deleted successfully.', 'success');
      fetchSales();
    } catch (error) {
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
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom color="primary">
            Admin Fuel Sales Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mb: 2 }}
          >
            Add New Sale
          </Button>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Fuel Type</StyledTableCell>
                  <StyledTableCell align="right">Liters</StyledTableCell>
                  <StyledTableCell align="right">Sale Price Per Liter</StyledTableCell>
                  <StyledTableCell>Sale Date</StyledTableCell>
                  <StyledTableCell>Payment Mode</StyledTableCell>
                  <StyledTableCell>Branch</StyledTableCell> {/* New branch column */}
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales.map((sale) => (
                  <StyledTableRow key={sale.id}>
                    <TableCell>{sale.fuel_type}</TableCell>
                    <TableCell align="right">{sale.liters}</TableCell>
                    <TableCell align="right">{sale.sale_price_per_liter}</TableCell>
                    <TableCell>{sale.sale_date}</TableCell>
                    <TableCell>{sale.payment_mode}</TableCell>
                    <TableCell>{sale.branch_name}</TableCell> {/* Display branch name */}
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpenDialog(sale)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteSale(sale.id)}>
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
          <DialogTitle>{currentSale.id ? 'Edit Sale' : 'Add New Sale'}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Fuel Type"
              name="fuel_type"
              value={currentSale.fuel_type}
              onChange={handleInputChange}
              fullWidth
            />
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
              label="Sale Price Per Liter"
              name="sale_price_per_liter"
              type="number"
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
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="dense"
              label="Payment Mode"
              name="payment_mode"
              value={currentSale.payment_mode}
              onChange={handleInputChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveSale} color="primary" variant="contained">
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

export default AdminFuelSalesManagement;
