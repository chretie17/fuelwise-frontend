import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import { Droplet, Calendar, DollarSign, Edit, Trash2, Plus, Save } from 'lucide-react';

const StyledContainer = styled(Container)(({ theme }) => ({
  '& .MuiTypography-root': {
    color: '#007547',
    marginBottom: theme.spacing(3),
  },
  '& .MuiButton-contained': {
    backgroundColor: '#007547',
    '&:hover': {
      backgroundColor: '#005835',
    },
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    backgroundColor: '#007547',
    color: theme.palette.common.white,
  },
}));

const AdminBOQ = () => {
  const [boqItems, setBoqItems] = useState([]);
  const [newBoq, setNewBoq] = useState({ id: '', fuel_type: '', description: '', quantity: '', unit: 'Liters', estimated_price_per_unit: '', deadline: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchBOQItems();
  }, []);

  const fetchBOQItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/boq`);
      setBoqItems(response.data);
    } catch (error) {
      console.error('Error fetching BOQ items:', error);
      alert('Error fetching BOQ items');
    }
  };

  const handleSaveBOQItem = async () => {
    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/boq/${newBoq.id}`, newBoq);
        alert('BOQ item updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/boq`, newBoq);
        alert('BOQ item created successfully');
      }
      setNewBoq({ fuel_type: '', description: '', quantity: '', unit: 'Liters', estimated_price_per_unit: '', deadline: '' });
      setIsEditing(false);
      setOpenDialog(false);
      fetchBOQItems();
    } catch (error) {
      console.error('Error saving/updating BOQ item:', error);
      alert('Error saving/updating BOQ item');
    }
  };

  const handleDeleteBOQItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this BOQ item?')) {
      try {
        await axios.delete(`${API_BASE_URL}/boq/${id}`);
        alert('BOQ item deleted successfully');
        fetchBOQItems();
      } catch (error) {
        console.error('Error deleting BOQ item:', error);
        alert('Error deleting BOQ item');
      }
    }
  };

  const handleEditBOQItem = (boqItem) => {
    setNewBoq(boqItem);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleOpenDialog = () => {
    setIsEditing(false);
    setNewBoq({ fuel_type: '', description: '', quantity: '', unit: 'Liters', estimated_price_per_unit: '', deadline: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditing(false);
    setNewBoq({ fuel_type: '', description: '', quantity: '', unit: 'Liters', estimated_price_per_unit: '', deadline: '' });
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>Fuel BOQ Management</Typography>
      <Button
        variant="contained"
        startIcon={<Plus />}
        onClick={handleOpenDialog}
        style={{ marginBottom: '20px' }}
      >
        Add New BOQ Item
      </Button>

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fuel Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quantity (Liters)</TableCell>
              <TableCell>Estimated Price per Unit (RWF)</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {boqItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Droplet color="#007547" size={20} style={{ marginRight: '8px' }} />
                    {item.fuel_type}
                  </div>
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DollarSign color="#007547" size={20} style={{ marginRight: '8px' }} />
                    {item.estimated_price_per_unit}
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Calendar color="#007547" size={20} style={{ marginRight: '8px' }} />
                    {item.deadline}
                  </div>
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEditBOQItem(item)} color="primary">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDeleteBOQItem(item.id)} color="secondary">
                      <Trash2 />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle style={{ color: '#007547' }}>{isEditing ? 'Edit BOQ Item' : 'Add New BOQ Item'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Fuel Type"
            value={newBoq.fuel_type}
            onChange={(e) => setNewBoq({ ...newBoq, fuel_type: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Description"
            value={newBoq.description}
            onChange={(e) => setNewBoq({ ...newBoq, description: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Quantity (Liters)"
            type="number"
            value={newBoq.quantity}
            onChange={(e) => setNewBoq({ ...newBoq, quantity: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Estimated Price per Unit (RWF)"
            type="number"
            value={newBoq.estimated_price_per_unit}
            onChange={(e) => setNewBoq({ ...newBoq, estimated_price_per_unit: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Deadline"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newBoq.deadline}
            onChange={(e) => setNewBoq({ ...newBoq, deadline: e.target.value })}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveBOQItem} variant="contained" startIcon={<Save />}>
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default AdminBOQ;