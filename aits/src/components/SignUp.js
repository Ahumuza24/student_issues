import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    college: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Hardcoded Makerere University colleges
  const colleges = [
    { id: 1, name: 'COCIS' },
    { id: 2, name: 'CEDAT' },
    { id: 3, name: 'LAW' },
    { id: 4, name: 'CAES' },
    { id: 5, name: 'CHUSS' },
    { id: 6, name: 'CONAS' },
    { id: 7, name: 'EDUC' },
    { id: 8, name: 'CHS' },
    { id: 9, name: 'COVAB' },
    { id: 10, name: 'COBAMS' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSend = {
      ...formData,
      college: formData.college ? parseInt(formData.college, 10) : null
    };

    console.log("Sending Data:", JSON.stringify(dataToSend, null, 2));

    try {
      const response = await signup(dataToSend);
      console.log("Signup Success:", response.data);
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('role', response.data.user.role);
      navigate('/dashboard');
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err);
      setError("Signup failed: " + JSON.stringify(err.response?.data || "Unknown error"));
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>Student SignUp</Typography>
      {error && <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>}
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="College"
          name="college"
          value={formData.college}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          <MenuItem value="">Select College</MenuItem>
          {colleges.map(college => (
            <MenuItem key={college.id} value={college.id}>
              {college.name}
            </MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Sign Up
        </Button>
      </form>
    </Box>
  );
};

export default SignUp;
