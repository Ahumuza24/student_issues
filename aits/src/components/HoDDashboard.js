import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Select, MenuItem, AppBar, Toolbar, IconButton } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { getIssues, getStats, updateIssue, getStaff } from '../api';
import NotificationDrawer from './NotificationDrawer';
import { Link } from 'react-router-dom';

const HoDDashboard = ({ onLogout }) => {
  const [stats, setStats] = useState({});
  const [issues, setIssues] = useState([]);
  const [staff, setStaff] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const statsRes = await getStats();
      const issuesRes = await getIssues();
      const staffRes = await getStaff();
      setStats(statsRes.data);
      setIssues(issuesRes.data);
      setStaff(staffRes.data);
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleReassign = async (issueId) => {
    if (assignments[issueId]) {
      await updateIssue(issueId, { assigned_to: assignments[issueId] });
      const issuesRes = await getIssues();
      setIssues(issuesRes.data);
      setAssignments(prev => ({ ...prev, [issueId]: '' }));
    }
  };

  const handleResolve = async (issueId) => {
    await updateIssue(issueId, { status: 'Resolved' });
    const issuesRes = await getIssues();
    setIssues(issuesRes.data);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>HoD Dashboard</Typography>
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
              <Typography variant="h6">Unresolved</Typography>
              <Typography variant="h4">{stats.open_issues || 0}</Typography>
            </CardContent>
          </Card>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {issues.map(issue => (
              <TableRow key={issue.issue_id}>
                <TableCell>{issue.issue_id}</TableCell>
                <TableCell>{issue.student.first_name} {issue.student.last_name}</TableCell>
                <TableCell>{issue.course.course_name}</TableCell>
                <TableCell>{issue.issue_type}</TableCell>
                <TableCell>{issue.status}</TableCell>
                <TableCell>{issue.assigned_to ? `${issue.assigned_to.first_name} ${issue.assigned_to.last_name}` : 'Unassigned'}</TableCell>
                <TableCell>
                  {issue.status !== 'Resolved' && (
                    <>
                      <Select
                        value={assignments[issue.issue_id] || ''}
                        onChange={(e) => setAssignments({ ...assignments, [issue.issue_id]: e.target.value })}
                        sx={{ mr: 1, minWidth: 120 }}
                      >
                        <MenuItem value="">Select Staff</MenuItem>
                        {staff.map(s => (
                          <MenuItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</MenuItem>
                        ))}
                      </Select>
                      <Button onClick={() => handleReassign(issue.issue_id)}>Reassign</Button>
                      <Button onClick={() => handleResolve(issue.issue_id)}>Resolve</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
};

export default HoDDashboard;