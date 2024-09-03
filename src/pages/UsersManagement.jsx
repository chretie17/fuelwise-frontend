// src/pages/UserManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
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
  Alert
} from '@mui/material';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentUser, setCurrentUser] = useState({ username: '', email: '', password: '', role: '' });

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
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

  const handleOpenDialog = (user = { username: '', email: '', password: '', role: '' }) => {
    setCurrentUser(user);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentUser({ username: '', email: '', password: '', role: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async () => {
    try {
      if (currentUser.id) {
        // Update existing user
        await axios.put(`${API_BASE_URL}/users/${currentUser.id}`, currentUser);
        showSnackbar('User updated successfully.', 'success');
      } else {
        // Create new user
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
    <Container>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Add User
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpenDialog(user)}>
                    Edit
                  </Button>
                  <Button color="secondary" onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for adding/updating user */}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveUser} color="primary">
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

export default UserManagement;
