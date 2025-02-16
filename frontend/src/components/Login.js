import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/login', 
        { name },
        { 
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.session_id) {
        onLogin(response.data);
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'ECONNABORTED') {
        setError('Connection timed out. Is the server running?');
      } else if (error.response) {
        setError(error.response.data.detail || 'Server error');
      } else if (error.request) {
        setError('Could not connect to server');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        AI Interview
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Your Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            error={!!error}
            helperText={error}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!name.trim() || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Connecting...' : 'Start Interview'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default Login;
