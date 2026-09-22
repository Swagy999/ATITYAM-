import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 71px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, color: '#fff' }}>
      <div className="glass-panel" style={{ maxWidth: 440, width: '100%', padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: 'rgba(59,130,246,0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Lock size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Reset Password</h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: 4 }}>
            Enter your registered email address to receive password reset authorization instructions.
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
              <CheckCircle2 size={20} />
              <span style={{ fontWeight: 700 }}>Reset Instructions Dispatched</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: 20 }}>
              (Demo Simulation) In production, a secure cryptographic single-use link is emailed to <strong>{email}</strong>.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Return to Sign In</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Email Address</label>
              <input required type="email" placeholder="admin@atithya360.demo" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: 12 }}>
              <span>Send Reset Instructions</span>
              <ArrowRight size={16} />
            </button>
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <Link to="/login" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Back to Sign In</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
