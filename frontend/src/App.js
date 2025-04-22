// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Dashboard from './pages/Dashboard';
import Pupils from './pages/Pupils';
import Events from './pages/Events';
import Reports from './pages/Reports';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const login = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const AuthenticatedApp = () => (
    <>
      <NavigationBar onLogout={logout} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pupils" element={<Pupils />} />
        <Route path="/events" element={<Events />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <Route path="/*" element={<Login onLogin={login} error={loginError} />} />
        ) : (
          <Route path="/*" element={<AuthenticatedApp />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
