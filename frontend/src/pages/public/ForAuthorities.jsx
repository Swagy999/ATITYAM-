import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Search, ShieldAlert, Lock, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

export const ForAuthorities = () => {
  const capabilities = [
    { title: 'Authorized Parameter Search', desc: 'Query active or historical guest stays using authorized identity parameters, mobile numbers, or passport records.' },
    { title: 'Jurisdiction Accommodation Registry', desc: 'Inspect registered hotels, lodges, and homestays mapped directly to your local police station.' },
    { title: 'Human-in-the-Loop Review Alerts', desc: 'Receive automated system flags for pending document verifications or irregular registration patterns for official human review.' },
    { title: 'Cryptographic Security & Audit Trail', desc: 'Every query executed by an officer is immutably logged with timestamp, user ID, and IP address.' },
    { title: 'Foreign Tourist Compliance Oversight', desc: 'Verify international traveler visa types, port of entry metadata, and length of stay compliance.' },
    { title: 'Zero Data Exposure to Unauthorized Users', desc: 'Strict role boundaries prevent hospitality staff or unauthorized third parties from accessing security data.' }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px', color: '#fff' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <span className="badge badge-success" style={{ marginBottom: 16 }}>Law Enforcement & Public Safety</span>
        <h1 style={{ fontSize: '2.8rem', marginBottom: 16 }}>Authorized Security & Compliance Terminal</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: 750, margin: '0 auto' }}>
          Equipping station officers and police superintendents with real-time jurisdiction verification, search capabilities, and auditable governance.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 60 }}>
        {capabilities.map((c, idx) => (
          <div key={idx} className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>{c.title}</h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 40, textAlign: 'center', border: '1px solid rgba(16,185,129,0.3)' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: 12 }}>Experience the Police Officer Terminal</h2>
        <p style={{ color: '#94a3b8', maxWidth: 600, margin: '0 auto 24px' }}>
          Test the authorized law enforcement search and inspection workflows in our live demonstration.
        </p>
        <Link to="/login" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
          <span>Access Police Terminal Demo</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};
