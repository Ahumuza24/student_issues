// src/components/StudentDashboard.js
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, AppBar, Toolbar, IconButton, Dialog, DialogTitle, DialogContent, TextField, MenuItem } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { getIssues, getStats, createIssue, getCourses } from '../api';
import NotificationDrawer from './NotificationDrawer';
import { Link } from 'react-router-dom';

const StudentDashboard = ({ onLogout }) => {
  const [stats, setStats] = useState({});
  const [issues, setIssues] = useState([]);
  const [courses, setCourses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newIssue, setNewIssue] = useState({ course: '', issue_type: '', description: '' });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await getStats();
        const issuesRes = await getIssues();
        const coursesRes = await getCourses();
        setStats(statsRes.data);
        setIssues(issuesRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateIssue = async () => {
    try {
      await createIssue({
        course: newIssue.course,
        issue_type: newIssue.issue_type,
        description: newIssue.description,
      });
      setNewIssue({ course: '', issue_type: '', description: '' });
      setOpenDialog(false);
      const issuesRes = await getIssues();
      setIssues(issuesRes.data);
    } catch (err) {
      console.error('Failed to create issue:', err);
    }
  };

  const handleInputChange = (e) => {
    setNewIssue({ ...newIssue, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Student Dashboard</Typography>
          <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
            <NotificationsIcon />
          </IconButton>
          <Button color="inherit" component={Link} to="/audit-logs">Audit Logs</Button>
          <Button color="inherit" onClick={onLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6">Total Issues</Typography>
              <Typography variant="h4">{stats.total_issues || 0}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6">Resolved</Typography>
              <Typography variant="h4">{stats.resolved_issues || 0}</Typography>
            </CardContent>
          </Card>
        </div>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>Create New Issue</Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {issues.map(issue => (
              <TableRow key={issue.issue_id}>
                <TableCell>{issue.issue_id}</TableCell>
                <TableCell>{issue.course.course_name}</TableCell>
                <TableCell>{issue.issue_type}</TableCell>
                <TableCell>{issue.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Issue</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Course"
            name="course"
            value={newIssue.course}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          >
            {courses.map(course => (
              <MenuItem key={course.course_id} value={course.course_id}>
                {course.course_name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Issue Type"
            name="issue_type"
            value={newIssue.issue_type}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="MissingMarks">Missing Marks</MenuItem>
            <MenuItem value="Appeals">Appeals</MenuItem>
            <MenuItem value="Corrections">Corrections</MenuItem>
          </TextField>
          <TextField
            label="Description"
            name="description"
            value={newIssue.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />
          <Button variant="contained" onClick={handleCreateIssue} fullWidth sx={{ mt: 2 }}>
            Submit
          </Button>
        </DialogContent>
      </Dialog>
      <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
};

export default StudentDashboard;