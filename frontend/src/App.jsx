import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { HowItWorks } from './pages/public/HowItWorks';
import { ForHotels } from './pages/public/ForHotels';
import { ForAuthorities } from './pages/public/ForAuthorities';
import { TourismIntelligence } from './pages/public/TourismIntelligence';
import { Contact } from './pages/public/Contact';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';

// Dashboard Pages
import { PropertyDashboard } from './pages/property/PropertyDashboard';
import { PoliceDashboard } from './pages/police/PoliceDashboard';
import { TourismDashboard } from './pages/tourism/TourismDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Public Layout Wrapper with Navbar & Footer
const PublicLayout = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0b0f19' }}>
    <Navbar />
    <main style={{ flex: 1 }}>{children}</main>
    <Footer />
  </div>
);

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/how-it-works" element={<PublicLayout><HowItWorks /></PublicLayout>} />
          <Route path="/features" element={<PublicLayout><HowItWorks /></PublicLayout>} />
          <Route path="/for-hotels" element={<PublicLayout><ForHotels /></PublicLayout>} />
          <Route path="/for-authorities" element={<PublicLayout><ForAuthorities /></PublicLayout>} />
          <Route path="/tourism-intelligence" element={<PublicLayout><TourismIntelligence /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          
          {/* Auth Pages */}
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
          <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />

          {/* Operational Role Terminals */}
          <Route path="/app" element={<ProtectedRoute />}>
            <Route path="property" element={<PropertyDashboard />} />
            <Route path="property/*" element={<PropertyDashboard />} />
            
            <Route path="police" element={<PoliceDashboard />} />
            <Route path="police/*" element={<PoliceDashboard />} />
            
            <Route path="tourism" element={<TourismDashboard />} />
            <Route path="tourism/*" element={<TourismDashboard />} />
            
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/*" element={<AdminDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
