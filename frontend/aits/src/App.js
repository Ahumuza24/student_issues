// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Login from './components/Login';
import SignUp from './components/SignUp';
import StartScreen from './components/StartScreen';
import StudentDashboard from './components/StudentDashboard';
import LecturerDashboard from './components/LecturerDashboard';
import HoDDashboard from './components/HoDDashboard';
import RegistrarDashboard from './components/RegistrarDashboard';
import AuditLogPage from './components/AuditLogPage';
import { setAuthToken } from './api';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setAuthToken(token);
      setUser({ role });
    }
  }, []);

  const handleLogin = (userData) => {
    setUser({ role: userData.role });
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    setAuthToken(userData.token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuthToken(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Start Screen is the root entry point for all the users */}
          <Route path="/" element={<StartScreen />} />
          {/* Login redirects authenticated users to dashboard */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          {/* SignUp is unrestricted, redirects to dashboard after signup */}
          <Route path="/signup" element={<SignUp />} />
          {/* Dashboard route for authenticated users, redirects to login if not authenticated */}
          <Route path="/dashboard" element={
            !user ? <Navigate to="/login" /> : (
              <>
                {user.role === 'Student' && <StudentDashboard onLogout={handleLogout} />}
                {user.role === 'Lecturer' && <LecturerDashboard onLogout={handleLogout} />}
                {user.role === 'HeadOfDepartment' && <HoDDashboard onLogout={handleLogout} />}
                {user.role === 'AcademicRegistrar' && <RegistrarDashboard onLogout={handleLogout} />}
              </>
            )
          } />
          {/* Audit logs route, requires authentication */}
          <Route path="/audit-logs" element={
            !user ? <Navigate to="/login" /> : <AuditLogPage onLogout={handleLogout} role={user.role} />
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;