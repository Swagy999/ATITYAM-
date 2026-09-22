import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0f19' }}>
        <div style={{ color: '#38bdf8', fontSize: '1.1rem', fontWeight: 600 }}>Loading ATITHYA360 Environment...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && user.role_slug !== 'super_admin' && !allowedRoles.includes(user.role_slug)) {
    return (
      <div style={{ minHeight: '100vh', background: '#0b0f19', color: '#fff' }}>
        <Navbar />
        <div style={{ maxWidth: 800, margin: '80px auto', padding: 32, background: '#162032', borderRadius: 16, border: '1px solid #1f2d47', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#f87171', marginBottom: 12 }}>Access Restricted</h2>
          <p style={{ color: '#94a3b8', marginBottom: 24 }}>
            Your account role (<strong>{user.role_name}</strong>) does not hold authorization to access this operational terminal.
          </p>
          <a href="/" className="btn btn-primary">Return to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0b0f19' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <Sidebar />
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
