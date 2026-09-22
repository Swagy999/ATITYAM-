import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, ShieldCheck, Compass, User, LogOut, Menu, X, 
  LogIn, ChevronDown, Sparkles, Layers, FileSpreadsheet, Lock
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, quickLogin, demoAccounts } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickLoginOpen, setQuickLoginOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role_slug) {
      case 'property_owner':
      case 'property_staff':
        return '/app/property';
      case 'police_officer':
      case 'police_admin':
        return '/app/police';
      case 'tourism_admin':
      case 'district_admin':
      case 'state_admin':
        return '/app/tourism';
      case 'super_admin':
      default:
        return '/app/admin';
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'For Hotels', path: '/for-hotels' },
    { name: 'For Authorities', path: '/for-authorities' },
    { name: 'Tourism Intelligence', path: '/tourism-intelligence' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 1000, borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{ 
            width: 42, height: 42, borderRadius: 10, 
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 15px rgba(59,130,246,0.4)'
          }}>
            <Building2 size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>ATITHYA<span style={{ color: '#38bdf8' }}>360</span></span>
              <span style={{ fontSize: '0.65rem', background: 'rgba(56,189,248,0.2)', color: '#38bdf8', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>DEMO</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', letterSpacing: '0.02em', fontWeight: 500 }}>
              Smarter Stays. Safer Destinations.
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: 20 }} className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: location.pathname === link.path ? '#38bdf8' : '#cbd5e1',
                padding: '6px 10px',
                borderRadius: 6,
                transition: 'all 0.2s'
              }}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          
          {/* Quick Demo Role Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setQuickLoginOpen(!quickLoginOpen)}
              className="btn btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              title="Quick Demo Role Switcher"
            >
              <Sparkles size={16} color="#fbbf24" />
              <span>Demo Roles</span>
              <ChevronDown size={14} />
            </button>

            {quickLoginOpen && (
              <div 
                className="glass-panel animate-fade" 
                style={{ 
                  position: 'absolute', right: 0, top: '110%', width: 260, 
                  background: '#0f172a', border: '1px solid #334155', padding: 8, 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)', zIndex: 1001 
                }}
              >
                <div style={{ padding: '6px 8px', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                  1-Click Role Switch
                </div>
                {demoAccounts.map(acc => (
                  <button
                    key={acc.slug}
                    onClick={async () => {
                      setQuickLoginOpen(false);
                      const res = await quickLogin(acc.slug);
                      if (res.success) {
                        navigate(getDashboardPath());
                      }
                    }}
                    style={{
                      width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                      padding: '8px 10px', background: user?.role_slug === acc.slug ? '#1e293b' : 'transparent',
                      border: 'none', borderRadius: 6, cursor: 'pointer', textAlign: 'left',
                      marginBottom: 4, transition: 'background 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.85rem' }}>{acc.role}</span>
                      {user?.role_slug === acc.slug && <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>ACTIVE</span>}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{acc.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link to={getDashboardPath()} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <Layers size={16} />
                <span>Dashboard</span>
              </Link>
              
              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="btn btn-secondary" 
                style={{ padding: '8px 12px' }}
                title="Log Out"
              >
                <LogOut size={16} color="#f87171" />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link to="/register" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                <span>Register Property</span>
              </Link>
              <Link to="/login" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                <LogIn size={16} />
                <span>Login</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary mobile-menu-btn"
            style={{ padding: 8, display: 'inline-flex' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{ background: '#0f172a', borderTop: '1px solid #1f2d47', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: location.pathname === link.path ? '#38bdf8' : '#cbd5e1',
                padding: '8px 0',
                borderBottom: '1px solid #1e293b'
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
      
      <style>{`
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};
