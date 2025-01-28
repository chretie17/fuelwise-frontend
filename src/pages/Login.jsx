import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Box, Container, Paper } from '@mui/material';
import { LockOutlined, PersonOutline } from '@mui/icons-material';
import { API_BASE_URL } from '../api';
import backgroundImage from '../assets/rubis.jpg';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { login, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('branch', response.data.branch);
      setError(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
      setError(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative">
      {/* Enhanced Background */}
      <div className="fixed inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/95 to-gray-800/95" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-xl mx-4">
        {/* Main Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl p-12">
          {/* Logo Section */}
          <div className="relative mb-10">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-600 flex items-center justify-center shadow-xl">
              <LockOutlined className="text-white transform scale-150" />
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-lg">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-center">
              <Typography color="error" className="text-red-500 text-sm">
                Incorrect username or password
              </Typography>
            </div>
          )}

          {/* Enhanced White Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="relative group">
              <TextField
                label="Username or Email"
                variant="outlined"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                fullWidth
                required
                InputProps={{
                  startAdornment: <PersonOutline className="text-emerald-600 mr-3" />,
                  className: "bg-gray-50 rounded-xl shadow-sm hover:bg-white transition-colors duration-200",
                  style: { 
                    borderRadius: '0.75rem',
                    border: '2px solid #f3f4f6',
                  }
                }}
                InputLabelProps={{
                  className: "text-gray-500"
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#10b981',
                  },
                }}
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                InputProps={{
                  startAdornment: <LockOutlined className="text-emerald-600 mr-3" />,
                  className: "bg-gray-50 rounded-xl shadow-sm hover:bg-white transition-colors duration-200",
                  style: { 
                    borderRadius: '0.75rem',
                    border: '2px solid #f3f4f6',
                  }
                }}
                InputLabelProps={{
                  className: "text-gray-500"
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#10b981',
                  },
                }}
              />
            </div>

            {/* Submit Button */}
            <div className="mt-10">
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="py-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold text-lg text-white shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.01]"
              >
                Sign In
              </Button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;