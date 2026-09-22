import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, ShieldCheck, Compass, ArrowRight, CheckCircle2, 
  Users, BarChart3, Lock, ShieldAlert, Sparkles, FileSpreadsheet, MapPin, Search
} from 'lucide-react';
import { analyticsService } from '../../services/services';

export const Home = () => {
  const { isAuthenticated, user, quickLogin } = useAuth();
  const [kpi, setKpi] = useState({
    properties: { active: 20 },
    visitors: { total_guests: 100, foreign_visitors: 20 },
    stays: { active_stays: 14 }
  });

  useEffect(() => {
    analyticsService.getOverview()
      .then(res => {
        if (res.success && res.data) setKpi(res.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ color: '#fff' }}>
      
      {/* Hero Section */}
      <section className="app-container" style={{ 
        position: 'relative', 
        paddingTop: 'clamp(40px, 8vw, 100px)',
        paddingBottom: 'clamp(40px, 6vw, 80px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
        gap: 'clamp(32px, 5vw, 60px)',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: 8, 
            background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)',
            padding: '6px 14px', borderRadius: 999, fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8',
            marginBottom: 20 
          }}>
            <Sparkles size={16} />
            <span>Digital Guest Registration & Tourism Intelligence</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1.1, fontWeight: 800, marginBottom: 16 }}>
            ATITHYA<span style={{ color: '#38bdf8' }}>360</span>
          </h1>
          
          <div style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', color: '#cbd5e1', fontWeight: 600, marginBottom: 16 }}>
            "Smarter Stays. Safer Destinations."
          </div>

          <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: 28 }}>
            A unified digital governance platform for digital guest check-ins, accommodation compliance, authorized police inspection, and macro tourism intelligence.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '12px 20px', fontSize: '0.95rem' }}>
              <span>Register Property</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/how-it-works" className="btn btn-secondary" style={{ padding: '12px 20px', fontSize: '0.95rem' }}>
              <span>Explore Platform</span>
            </Link>
          </div>

          {/* Key Metrics Banner */}
          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 16, 
            marginTop: 36, paddingTop: 24, borderTop: '1px solid #1f2d47' 
          }}>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>{kpi.properties.active}+</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Active Accommodations</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>{kpi.visitors.total_guests}+</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Registered Tourists</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b' }}>{kpi.stays.active_stays}</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Live Active Stays</div>
            </div>
          </div>

        </div>

        {/* Hero Illustration / Dashboard Preview Card */}
        <div className="glass-panel" style={{ padding: 24, boxShadow: '0 25px 60px rgba(0,0,0,0.6)', border: '1px solid #1f2d47' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid #1e293b', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: 8, fontFamily: 'monospace' }}>atithya360.gov.in/terminal</span>
            </div>
            <span className="badge badge-success">LIVE SYSTEM</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#0f172a', padding: 16, borderRadius: 10, border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Active Stay Stream</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>The Grand Heritage Park Hotel</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Room 201 • John Alexander Smith (USA)</div>
                </div>
                <span className="badge badge-success">Checked In</span>
              </div>
            </div>

            <div style={{ background: '#0f172a', padding: 16, borderRadius: 10, border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Security Compliance</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Document Metadata Verification</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Park Street Police Station Jurisdiction</div>
                </div>
                <span className="badge badge-info">Verified</span>
              </div>
            </div>

            <div style={{ background: '#0f172a', padding: 16, borderRadius: 10, border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Tourism Inflow Index</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Peak Weekend Occupancy</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>West Bengal • Odisha • Rajasthan • Goa</div>
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>78.4%</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 6 Core Pillars Section */}
      <section style={{ padding: '80px 24px', background: '#090d16', borderTop: '1px solid #1f2d47', borderBottom: '1px solid #1f2d47' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 60px' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: 16 }}>Unified Tri-Pillar Architecture</h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Bridging the gap between private hospitality operators, law enforcement agencies, and government tourism boards on a single zero-trust foundation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            
            <div className="glass-card" style={{ padding: 32 }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', marginBottom: 20 }}>
                <Building2 size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 12 }}>Digital Guest Registration</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Instant paperless check-ins for Indian citizens and foreign visitors. Securely captures document metadata without retaining unnecessary raw copies.
              </p>
            </div>

            <div className="glass-card" style={{ padding: 32 }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: 20 }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 12 }}>Police & Safety Terminal</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Jurisdictional search tools, property verification audits, and human-in-the-loop review alerts for law enforcement station officers.
              </p>
            </div>

            <div className="glass-card" style={{ padding: 32 }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4', marginBottom: 20 }}>
                <BarChart3 size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 12 }}>Tourism Intelligence</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Macro forecasting, seasonal demand analysis, international origin tracking, and district-level capacity utilization metrics.
              </p>
            </div>

            <div className="glass-card" style={{ padding: 32 }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', marginBottom: 20 }}>
                <Lock size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 12 }}>Role-Based Access Control</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Strict jurisdictional scoping. Property staff only view their guests; police search within authorized mandates; state admins oversee macro trends.
              </p>
            </div>

            <div className="glass-card" style={{ padding: 32 }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(14,165,233,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9', marginBottom: 20 }}>
                <FileSpreadsheet size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 12 }}>Audit & Compliance Trail</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Every check-in, search query, record lookup, and report generation is cryptographically logged with IP address and user identity.
              </p>
            </div>

            <div className="glass-card" style={{ padding: 32 }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7', marginBottom: 20 }}>
                <Compass size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 12 }}>Azure Medallion Ready</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Structured data models engineered for seamless future ingestion via Azure Data Factory, ADLS Gen2, Databricks PySpark, and Delta Lake.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 1-Click Interactive Demo Testing Callout */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '48px 32px', border: '1px solid rgba(59,130,246,0.3)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: 16 }}>Test the Live Demonstration</h2>
          <p style={{ color: '#94a3b8', maxWidth: 650, margin: '0 auto 32px', fontSize: '1rem', lineHeight: 1.6 }}>
            Select any operational role to experience ATITHYA360's customized workflows and access controls.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <button 
              onClick={() => quickLogin('property_owner')}
              className="btn btn-secondary" 
              style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            >
              <Building2 size={24} color="#38bdf8" />
              <span style={{ fontWeight: 700 }}>Hotel Owner</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Check-In & Room Mgmt</span>
            </button>

            <button 
              onClick={() => quickLogin('police_officer')}
              className="btn btn-secondary" 
              style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            >
              <ShieldCheck size={24} color="#10b981" />
              <span style={{ fontWeight: 700 }}>Police Officer</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Search & Safety Alerts</span>
            </button>

            <button 
              onClick={() => quickLogin('tourism_admin')}
              className="btn btn-secondary" 
              style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            >
              <BarChart3 size={24} color="#f59e0b" />
              <span style={{ fontWeight: 700 }}>Tourism Admin</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>BI & Macro Forecasts</span>
            </button>

            <button 
              onClick={() => quickLogin('super_admin')}
              className="btn btn-secondary" 
              style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            >
              <Lock size={24} color="#a855f7" />
              <span style={{ fontWeight: 700 }}>Super Admin</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Global Governance</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
