// src/components/StartScreen.js
import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StartScreen = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          textAlign: 'center',
          p: 4,
          border: '1px solid #ccc',
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        {/* Logo Placeholder - Replace with your actual logo image */}
        <Typography variant="h2" color="primary" sx={{ mb: 2 }}>
          AITS
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Welcome to the Academic Issue Tracking System
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default StartScreen;