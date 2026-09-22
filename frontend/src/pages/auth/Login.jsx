import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, Lock, Mail, ArrowRight, Sparkles, Shield, User, BarChart3, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login, quickLogin, demoAccounts, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const redirectByRole = (roleSlug) => {
    switch (roleSlug) {
      case 'property_owner':
      case 'property_staff':
        navigate('/app/property');
        break;
      case 'police_officer':
      case 'police_admin':
        navigate('/app/police');
        break;
      case 'tourism_admin':
      case 'district_admin':
      case 'state_admin':
        navigate('/app/tourism');
        break;
      case 'super_admin':
      default:
        navigate('/app/admin');
        break;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      redirectByRole(res.user.role_slug);
    } else {
      setError(res.message || 'Invalid email or password');
    }
  };

  const handleQuickDemo = async (slug) => {
    setError('');
    const res = await quickLogin(slug);
    if (res.success) {
      redirectByRole(res.user.role_slug);
    } else {
      setError(res.message || 'Demo login failed');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 71px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'radial-gradient(ellipse at top, #111d33 0%, #0b0f19 70%)', color: '#fff' }}>
      <div style={{ width: '100%', maxWidth: 960, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
        
        {/* Left Column: Traditional Login Form */}
        <div className="glass-panel" style={{ padding: '36px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Portal Sign In</h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Access your authorized operational terminal</p>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input 
                  required
                  type="email" 
                  placeholder="admin@atithya360.demo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: 38 }}
                />
                <Mail size={16} color="#64748b" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: '#38bdf8' }}>Forgot?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: 38 }}
                />
                <Lock size={16} color="#64748b" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary" 
              style={{ marginTop: 8, padding: '12px' }}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Terminal'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
            New accommodation operator? <Link to="/register" style={{ color: '#38bdf8', fontWeight: 600 }}>Register Property</Link>
          </div>
        </div>

        {/* Right Column: 1-Click Interactive Demo Selector */}
        <div className="glass-panel" style={{ padding: '36px 32px', border: '1px solid rgba(59,130,246,0.35)', background: 'linear-gradient(180deg, rgba(17,29,51,0.8) 0%, rgba(11,15,25,0.9) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Sparkles size={20} color="#fbbf24" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Quick 1-Click Demo Login</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: 20 }}>
            Instantly log in as any stakeholder persona to explore specialized UI views, permission gates, and live synthetic datasets.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {demoAccounts.map((acc) => (
              <button
                key={acc.slug}
                onClick={() => handleQuickDemo(acc.slug)}
                className="glass-card"
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#0f172a',
                  border: '1px solid #1f2d47',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderRadius: 10
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.92rem' }}>{acc.role}</span>
                    <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{acc.slug}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>{acc.name} • {acc.email}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>{acc.desc}</div>
                </div>
                <ArrowRight size={16} color="#38bdf8" />
              </button>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: 12, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 8, fontSize: '0.75rem', color: '#fbbf24', textAlign: 'center' }}>
            Demo Password for all roles is <strong>Demo@123</strong>
          </div>
        </div>

      </div>
    </div>
  );
};
