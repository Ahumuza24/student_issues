import React, { useState } from 'react';
import { Modal, Box, TextField, Button, MenuItem, Typography } from '@mui/material';

const IssueModal = ({ open, onClose, onSubmit, courses }) => {
  const [formData, setFormData] = useState({ course_id: '', issue_type: '', description: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({ course_id: '', issue_type: '', description: '' });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'white', p: 4, width: 400, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Log New Issue</Typography>
        <TextField
          select
          label="Course"
          name="course_id"
          value={formData.course_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        >
          {courses.map(course => (
            <MenuItem key={course.course_id} value={course.course_id}>
              {course.course_code} - {course.course_name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Issue Type"
          name="issue_type"
          value={formData.issue_type}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        >
          <MenuItem value="MissingMarks">Missing Marks</MenuItem>
          <MenuItem value="Appeals">Appeals</MenuItem>
          <MenuItem value="Corrections">Corrections</MenuItem>
        </TextField>
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>Submit</Button>
      </Box>
    </Modal>
  );
};

export default IssueModal;