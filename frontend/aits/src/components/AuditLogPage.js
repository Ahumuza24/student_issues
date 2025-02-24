import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, AppBar, Toolbar, Button, Typography } from '@mui/material';
import { getAuditLogs } from '../api';
import { Link } from 'react-router-dom';

const AuditLogPage = ({ onLogout, role }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await getAuditLogs();
      setLogs(res.data);
    };
    fetchLogs();
  }, []);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Audit Logs</Typography>
          <Button color="inherit" component={Link} to="/">Back to Dashboard</Button>
          <Button color="inherit" onClick={onLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <div style={{ padding: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Issue ID</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map(log => (
              <TableRow key={log.log_id}>
                <TableCell>{log.log_id}</TableCell>
                <TableCell>{log.issue.issue_id}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.user.first_name} {log.user.last_name}</TableCell>
                <TableCell>{new Date(log.action_timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AuditLogPage;