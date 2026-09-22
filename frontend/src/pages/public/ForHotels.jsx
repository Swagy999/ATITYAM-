import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, CheckCircle2, Clock, ShieldCheck, FileSpreadsheet, Users, ArrowRight } from 'lucide-react';

export const ForHotels = () => {
  const benefits = [
    { title: '60-Second Digital Check-In', desc: 'Eliminate slow manual paper ledgers with fast search-and-register digital forms.' },
    { title: 'Zero Physical Paper Storage', desc: 'Avoid collecting and storing risky physical photocopies of guest identity documents.' },
    { title: 'Automated Regulatory Compliance', desc: 'Maintain 100% compliance with district administrative and police record requirements.' },
    { title: 'Instant Room Inventory Tracking', desc: 'Live room status toggles between Available, Occupied, and Maintenance.' },
    { title: 'Secure Staff Access Delegation', desc: 'Add front desk staff with scoped operational permissions under your property account.' },
    { title: '1-Click CSV Monthly Reporting', desc: 'Generate and export clean occupancy and visitor records directly for auditing.' }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px', color: '#fff' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <span className="badge badge-info" style={{ marginBottom: 16 }}>For Accommodation Providers</span>
        <h1 style={{ fontSize: '2.8rem', marginBottom: 16 }}>Empowering Hotels, Homestays & Resorts</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: 750, margin: '0 auto' }}>
          ATITHYA360 simplifies compliance, eliminates physical paperwork, and speeds up guest arrival workflows for hospitality operators of all sizes.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 60 }}>
        {benefits.map((b, idx) => (
          <div key={idx} className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <CheckCircle2 size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>{b.title}</h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>{b.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 40, textAlign: 'center', border: '1px solid rgba(59,130,246,0.3)' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: 12 }}>Join the ATITHYA360 Digital Network</h2>
        <p style={{ color: '#94a3b8', maxWidth: 600, margin: '0 auto 24px' }}>
          Register your hotel, homestay, or resort in minutes and experience modern digital guest management.
        </p>
        <Link to="/register" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
          <span>Register Your Accommodation</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};
