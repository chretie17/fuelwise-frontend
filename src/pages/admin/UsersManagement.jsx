import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import {
  Box,
  Button,
  Container,
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
  ThemeProvider,
  createTheme
} from '@mui/material';
import { styled } from '@mui/system';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007547',
    },
  },
});

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: '#f0f8f4',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  '&:hover': {
    backgroundColor: '#005a35',
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: '#007547',
  '& .MuiTableCell-head': {
    color: 'white',
    fontWeight: 'bold',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#e8f5e9',
  },
  '&:hover': {
    backgroundColor: '#c8e6c9',
  },
}));

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]); // State to hold the list of branches
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentUser, setCurrentUser] = useState({ username: '', email: '', password: '', role: '', branch_id: '' });

  useEffect(() => {
    fetchUsers();
    fetchBranches(); // Fetch branches when the component mounts
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Error fetching users.', 'error');
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/branches`);
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
      showSnackbar('Error fetching branches.', 'error');
    }
  };

  const handleOpenDialog = (user = { username: '', email: '', password: '', role: '', branch_id: '' }) => {
    setCurrentUser(user);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentUser({ username: '', email: '', password: '', role: '', branch_id: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async () => {
    try {
      if (currentUser.id) {
        await axios.put(`${API_BASE_URL}/users/${currentUser.id}`, currentUser);
        showSnackbar('User updated successfully.', 'success');
      } else {
        await axios.post(`${API_BASE_URL}/users`, currentUser);
        showSnackbar('User added successfully.', 'success');
      }
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving user:', error);
      showSnackbar('Error saving user.', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`);
      showSnackbar('User deleted successfully.', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar('Error deleting user.', 'error');
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
        <Typography variant="h4" gutterBottom color="primary">
          User Management
        </Typography>
        <StyledButton variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Add User
        </StyledButton>
        <StyledTableContainer component={Paper}>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Branch</TableCell> {/* New column to display branch name */}
                <TableCell>Actions</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {users.map((user) => (
                <StyledTableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.branch_name || 'N/A'}</TableCell> {/* Show branch name if user is associated with a branch */}
                  <TableCell>
                    <StyledButton variant="outlined" color="primary" onClick={() => handleOpenDialog(user)}>
                      Edit
                    </StyledButton>
                    <StyledButton variant="outlined" color="secondary" onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </StyledButton>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>

        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>{currentUser.id ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Username"
              name="username"
              value={currentUser.username}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              value={currentUser.email}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Password"
              name="password"
              type="password"
              value={currentUser.password}
              onChange={handleInputChange}
              fullWidth
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={currentUser.role}
                onChange={handleInputChange}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="supplier">Supplier</MenuItem>
              </Select>
            </FormControl>

            {/* Only show branch selection if the role is "manager" */}
            {currentUser.role === 'manager' && (
              <FormControl fullWidth margin="dense">
                <InputLabel>Branch</InputLabel>
                <Select
                  name="branch_id"
                  value={currentUser.branch_id}
                  onChange={handleInputChange}
                >
                  {branches.map((branch) => (
                    <MenuItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveUser} color="primary">
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

export default UserManagement;
