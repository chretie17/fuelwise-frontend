// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import styled from 'styled-components';
import { API_BASE_URL } from '../api';

// Styled-components for custom styling
const LoginContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const FormBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 300px;
`;

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { login, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role); 
      localStorage.setItem('userId', response.data.userId); 

      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <LoginContainer maxWidth="sm">
      <Typography variant="h4" gutterBottom>Login</Typography>
      <FormBox component="form" onSubmit={handleSubmit}>
        <TextField
          label="Username or Email"
          variant="outlined"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary">Login</Button>
      </FormBox>
    </LoginContainer>
  );
};

export default Login;
