import React from 'react';
import { Building2, Shield, Compass, Lock, CheckCircle2 } from 'lucide-react';

export const About = () => {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 24px', color: '#fff' }}>
      <div style={{ textAlign: 'center', marginBottom: 50 }}>
        <span className="badge badge-info" style={{ marginBottom: 16 }}>Platform Mission</span>
        <h1 style={{ fontSize: '2.8rem', marginBottom: 16 }}>About ATITHYA360</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.6 }}>
          "Smarter Stays. Safer Destinations."
        </p>
      </div>

      <div className="glass-card" style={{ padding: 36, marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 16, color: '#38bdf8' }}>The Vision</h2>
        <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: 16 }}>
          The hospitality and tourism ecosystem involves thousands of independent accommodation providers—from grand city hotels and luxury resorts to rural homestays and eco-lodges. Traditionally, guest check-in relied on manual paper registers, physical photocopies of identity proofs, and cumbersome inspection processes.
        </p>
        <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
          <strong>ATITHYA360</strong> establishes a modern, privacy-first digital architecture that facilitates effortless digital guest registration for hoteliers while providing authorized law enforcement officers and tourism policy planners with real-time jurisdictional visibility and macro intelligence.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.1rem', color: '#10b981', marginBottom: 10 }}>Privacy by Design</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Captures only essential verification metadata. No redundant physical photocopies or unencrypted identity dumps.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.1rem', color: '#38bdf8', marginBottom: 10 }}>Scoped RBAC Security</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Cryptographically bounded access controls ensure hotel staff, station officers, and state planners access only authorized scopes.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.1rem', color: '#f59e0b', marginBottom: 10 }}>Demonstration Prototype</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Designed as a high-performance demonstration and software architecture prototype with complete synthetic test datasets.
          </p>
        </div>
      </div>
    </div>
  );
};
