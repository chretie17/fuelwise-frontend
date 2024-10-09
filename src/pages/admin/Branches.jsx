import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { API_BASE_URL } from '../../api';
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';

// Color palette
const colors = {
  primary: '#007547',
  secondary: '#00a86b',
  accent: '#ffd700',
  background: '#f0f8f0',
  text: '#333333',
  error: '#d32f2f',
};

// Styled Components
const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px;
  background-color: ${colors.background};
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
`;

const Title = styled.h1`
  text-align: center;
  color: ${colors.primary};
  font-size: 2.5rem;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const InputGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const Label = styled.label`
  font-size: 1rem;
  color: ${colors.text};
  margin-bottom: 8px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${colors.secondary};
    box-shadow: 0 0 0 2px rgba(0, 117, 71, 0.2);
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: ${colors.primary};
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: ${colors.secondary};
  }
`;

const BranchList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BranchItem = styled.li`
  padding: 20px;
  background-color: white;
  border-left: 5px solid ${colors.primary};
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const BranchInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const BranchName = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${colors.primary};
`;

const BranchLocation = styled.span`
  font-size: 1rem;
  color: ${colors.text};
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const IconButton = styled.button`
  padding: 8px;
  background-color: transparent;
  color: ${props => props.color || colors.primary};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: ${colors.text};
  font-size: 1.2rem;
  font-style: italic;
  margin-top: 30px;
`;

const ErrorMessage = styled.p`
  color: ${colors.error};
  text-align: center;
  margin-top: 10px;
`;

// Branch Management Component
const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [branchForm, setBranchForm] = useState({ name: '', location: '' });
  const [editingBranch, setEditingBranch] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/branches`);
      setBranches(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching branches:', error);
      setError('Failed to fetch branches. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBranchForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        await axios.put(`${API_BASE_URL}/branches/${editingBranch.id}`, branchForm);
      } else {
        await axios.post(`${API_BASE_URL}/branches`, branchForm);
      }
      fetchBranches();
      setBranchForm({ name: '', location: '' });
      setEditingBranch(null);
      setError('');
    } catch (error) {
      console.error('Error saving branch:', error);
      setError('Failed to save branch. Please try again.');
    }
  };

  const editBranch = (branch) => {
    setEditingBranch(branch);
    setBranchForm({ name: branch.name, location: branch.location });
  };

  const deleteBranch = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await axios.delete(`${API_BASE_URL}/branches/${id}`);
        fetchBranches();
        setError('');
      } catch (error) {
        console.error('Error deleting branch:', error);
        setError('Failed to delete branch. Please try again.');
      }
    }
  };

  return (
    <Container>
      <Title>Branch Management</Title>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="name">Branch Name</Label>
          <Input
            id="name"
            type="text"
            name="name"
            value={branchForm.name}
            onChange={handleInputChange}
            required
            placeholder="Enter branch name"
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="location">Branch Location</Label>
          <Input
            id="location"
            type="text"
            name="location"
            value={branchForm.location}
            onChange={handleInputChange}
            required
            placeholder="Enter branch location"
          />
        </InputGroup>
        <Button type="submit">
          {editingBranch ? (
            <>
              <FaEdit /> Update Branch
            </>
          ) : (
            <>
              <FaPlus /> Add Branch
            </>
          )}
        </Button>
      </Form>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <h2>Branches</h2>
      {branches.length > 0 ? (
        <BranchList>
          {branches.map((branch) => (
            <BranchItem key={branch.id}>
              <BranchInfo>
                <BranchName>{branch.name}</BranchName>
                <BranchLocation>
                  <FaMapMarkerAlt /> {branch.location}
                </BranchLocation>
              </BranchInfo>
              <ButtonGroup>
                <IconButton onClick={() => editBranch(branch)} title="Edit">
                  <FaEdit />
                </IconButton>
                <IconButton onClick={() => deleteBranch(branch.id)} color={colors.error} title="Delete">
                  <FaTrash />
                </IconButton>
              </ButtonGroup>
            </BranchItem>
          ))}
        </BranchList>
      ) : (
        <EmptyMessage>No branches available. Add your first branch above!</EmptyMessage>
      )}
    </Container>
  );
};

export default BranchManagement;