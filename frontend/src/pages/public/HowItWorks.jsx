import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Compass, CheckCircle2, ArrowRight, UserCheck, FileText, Database } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Accommodation Onboarding',
      desc: 'Hotels, homestays, guest houses, and resorts register with trade licenses, room inventory, and local police station jurisdictional mapping.',
      icon: Building2,
      badge: 'Hospitality Tier'
    },
    {
      step: '02',
      title: 'Digital Guest Registration',
      desc: 'Front desks register arriving Indian citizens and foreign visitors in under 60 seconds, capturing permitted document references without paper photocopies.',
      icon: UserCheck,
      badge: 'Front Desk'
    },
    {
      step: '03',
      title: 'Document Metadata & Validation',
      desc: 'Identity documents (Driving License, Voter ID, Passport, Visa) are validated for expiry, format consistency, and duplicate registration flags.',
      icon: FileText,
      badge: 'Security & Privacy'
    },
    {
      step: '04',
      title: 'Real-Time Stay Management',
      desc: 'Guest stays transition seamlessly from Checked In to Active Stay and Checked Out, releasing rooms and updating local occupancy metrics instantly.',
      icon: CheckCircle2,
      badge: 'Operations'
    },
    {
      step: '05',
      title: 'Authorized Law Enforcement Access',
      desc: 'Police officers perform authorized parameter queries within station limits to verify accommodation registries and review incident alerts.',
      icon: ShieldCheck,
      badge: 'Public Safety'
    },
    {
      step: '06',
      title: 'Macro Tourism Intelligence',
      desc: 'Aggregated, anonymized stay records power state-level dashboards, destination footfall predictions, and Azure Lakehouse analytics.',
      icon: Compass,
      badge: 'Data Intelligence'
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px', color: '#fff' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <h1 style={{ fontSize: '2.8rem', marginBottom: 16 }}>How ATITHYA360 Works</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: 700, margin: '0 auto' }}>
          An end-to-end digital lifecycle ensuring secure stays for tourists, streamlined operations for hoteliers, and actionable intelligence for tourism boards.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 60 }}>
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.step} className="glass-card" style={{ padding: 32, position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                  <Icon size={22} />
                </div>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#334155', fontFamily: 'monospace' }}>{s.step}</span>
              </div>
              <span className="badge badge-info" style={{ marginBottom: 12 }}>{s.badge}</span>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 10, color: '#ffffff' }}>{s.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-panel" style={{ padding: 40, textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.6rem', marginBottom: 12 }}>Ready to experience ATITHYA360?</h3>
        <p style={{ color: '#94a3b8', marginBottom: 24 }}>Explore live operational dashboards with our pre-loaded synthetic demonstration dataset.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <Link to="/register" className="btn btn-primary">Register Your Property</Link>
          <Link to="/login" className="btn btn-secondary">Access Demo Portal</Link>
        </div>
      </div>
    </div>
  );
};
