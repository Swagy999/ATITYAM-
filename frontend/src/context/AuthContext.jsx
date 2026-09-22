import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/services';

const AuthContext = createContext(null);

export const DEMO_ACCOUNTS = [
  { role: 'Super Admin', email: 'admin@atithya360.demo', name: 'Vikram Malhotra', slug: 'super_admin', desc: 'Full System Governance & Oversight' },
  { role: 'Property Owner', email: 'hotel@atithya360.demo', name: 'Rajesh Sen (Grand Heritage)', slug: 'property_owner', desc: 'Hotel Check-In/Out & Guest Mgmt' },
  { role: 'Police Officer', email: 'police@atithya360.demo', name: 'Inspector Ananya Roy', slug: 'police_officer', desc: 'Jurisdiction Search & Safety Alerts' },
  { role: 'Tourism Admin', email: 'tourism@atithya360.demo', name: 'Dr. Arindam Bose', slug: 'tourism_admin', desc: 'State Analytics & Destination BI' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('atithya_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('atithya_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      if (res.success && res.data) {
        const { token: jwtToken, user: userData } = res.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('atithya_token', jwtToken);
        localStorage.setItem('atithya_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Authentication error' };
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (roleSlug) => {
    const acc = DEMO_ACCOUNTS.find(a => a.slug === roleSlug) || DEMO_ACCOUNTS[0];
    return await login(acc.email, 'Demo@123');
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignore logout errors
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('atithya_token');
      localStorage.removeItem('atithya_user');
    }
  };

  const hasRole = (...roles) => {
    if (!user) return false;
    if (user.role_slug === 'super_admin') return true;
    return roles.includes(user.role_slug);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        quickLogin,
        logout,
        hasRole,
        demoAccounts: DEMO_ACCOUNTS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
