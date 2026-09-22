import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, HeartHandshake, Compass } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ background: '#090d16', borderTop: '1px solid #1f2d47', padding: '60px 24px 30px', color: '#94a3b8' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40, marginBottom: 40 }}>
        
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} color="#fff" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>ATITHYA<span style={{ color: '#38bdf8' }}>360</span></span>
          </div>
          <p style={{ fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 16 }}>
            Digital Guest Registration, Accommodation Management, Authorized Security & Tourism Intelligence Platform.
          </p>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Tagline: <em>"Smarter Stays. Safer Destinations."</em>
          </div>
        </div>

        {/* Public Solutions */}
        <div>
          <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Solutions</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
            <li><Link to="/for-hotels" style={{ color: '#94a3b8' }}>For Hotels & Homestays</Link></li>
            <li><Link to="/for-authorities" style={{ color: '#94a3b8' }}>For Police & Authorities</Link></li>
            <li><Link to="/tourism-intelligence" style={{ color: '#94a3b8' }}>Tourism Intelligence BI</Link></li>
            <li><Link to="/how-it-works" style={{ color: '#94a3b8' }}>Digital Check-In Workflow</Link></li>
            <li><Link to="/register" style={{ color: '#94a3b8' }}>Register Accommodation</Link></li>
          </ul>
        </div>

        {/* Architecture & Tech */}
        <div>
          <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Architecture & Stack</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
            <li>React 18 & Vite Frontend</li>
            <li>PHP 8+ REST API Engine</li>
            <li>MySQL 8+ Normalized OLTP</li>
            <li>Azure Medallion Lakehouse Spec</li>
            <li>Role-Based Security & Audit Logs</li>
          </ul>
        </div>

        {/* Disclaimer & Compliance */}
        <div>
          <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prototype Disclaimer</h4>
          <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: '#64748b' }}>
            ATITHYA360 is a demonstration and portfolio prototype platform. All sample data, guest identities, and registration identifiers are synthetic. No real Aadhaar or immigration APIs are queried.
          </p>
        </div>

      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', paddingTop: 24, borderTop: '1px solid #1f2d47', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, fontSize: '0.82rem' }}>
        <div>
          © {new Date().getFullYear()} ATITHYA360 Platform. All rights reserved. (Demonstration / Prototype Platform)
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/about" style={{ color: '#64748b' }}>About</Link>
          <Link to="/contact" style={{ color: '#64748b' }}>Contact Support</Link>
          <Link to="/login" style={{ color: '#64748b' }}>Portal Login</Link>
        </div>
      </div>
    </footer>
  );
};
