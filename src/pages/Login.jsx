import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { TextField, Button, Typography, Box, Container, Paper } from '@mui/material';
import { LockOutlined, PersonOutline } from '@mui/icons-material';
import { API_BASE_URL } from '../api';
import backgroundImage from '../assets/rubis.jpg';  // Import the background image

const primaryColor = '#007547';

const LoginContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-image: url(${backgroundImage});  // Use the imported image
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, ${primaryColor}66, ${primaryColor}33);
    z-index: 1;
  }
`;

const LoginPaper = styled(Paper)`
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 2;
  max-width: 400px;
  width: 100%;
`;

const Logo = styled.div`
  width: 80px;
  height: 80px;
  background-color: ${primaryColor};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 117, 71, 0.2);
`;

const FormBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    background-color: rgba(255, 255, 255, 0.8);
    &:hover fieldset {
      border-color: ${primaryColor};
    }
    &.Mui-focused fieldset {
      border-color: ${primaryColor};
    }
  }
  & .MuiInputLabel-root.Mui-focused {
    color: ${primaryColor};
  }
`;

const StyledButton = styled(Button)`
  background-color: ${primaryColor};
  padding: 12px;
  &:hover {
    background-color: ${primaryColor}dd;
  }
`;

const SignUpLink = styled(Link)`
  margin-top: 24px;
  color: ${primaryColor};
  text-decoration: none;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
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
      localStorage.setItem('branch', response.data.branch);

      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <LoginContainer maxWidth={false}>
      <LoginPaper elevation={3}>
        <Logo>
          <LockOutlined style={{ fontSize: 40, color: 'white' }} />
        </Logo>
        <Typography variant="h4" gutterBottom style={{ color: primaryColor, fontWeight: 'bold', marginBottom: 8 }}>
          Welcome Back
        </Typography>
        <Typography variant="body1" gutterBottom style={{ marginBottom: 24, textAlign: 'center', color: '#555' }}>
          Enter your credentials to access your account
        </Typography>
        <FormBox component="form" onSubmit={handleSubmit}>
          <StyledTextField
            label="Username or Email"
            variant="outlined"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            fullWidth
            required
            InputProps={{
              startAdornment: <PersonOutline style={{ color: primaryColor, marginRight: 8 }} />,
            }}
          />
          <StyledTextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            InputProps={{
              startAdornment: <LockOutlined style={{ color: primaryColor, marginRight: 8 }} />,
            }}
          />
          <StyledButton type="submit" variant="contained" size="large" fullWidth>
            Login
          </StyledButton>
        </FormBox>
        <SignUpLink to="/signup">
          Don't have an account? Sign up here
        </SignUpLink>
      </LoginPaper>
    </LoginContainer>
  );
};

export default Login;