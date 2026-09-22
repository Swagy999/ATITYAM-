import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px', color: '#fff' }}>
      <div style={{ textAlign: 'center', marginBottom: 50 }}>
        <span className="badge badge-info" style={{ marginBottom: 16 }}>Platform Support Desk</span>
        <h1 style={{ fontSize: '2.8rem', marginBottom: 16 }}>Contact & Grievance Cell</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: 650, margin: '0 auto' }}>
          Have inquiries regarding accommodation onboarding, police terminal access, or technical API integration? Reach out to our technical support team.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }}>
        {/* Contact Info */}
        <div className="glass-card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: 20 }}>Support Directorate</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <Mail size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Technical Inquiries</div>
                <div style={{ color: '#ffffff', fontWeight: 600 }}>support@atithya360.demo</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <Phone size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Helpdesk Toll-Free</div>
                <div style={{ color: '#ffffff', fontWeight: 600 }}>1800-360-STAY (Demo Line)</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                <MapPin size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>National Tourism Tech Complex</div>
                <div style={{ color: '#ffffff', fontWeight: 600 }}>Sector V, Digital Hub, Kolkata 700091</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-panel" style={{ padding: 32 }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: 8 }}>Inquiry Recorded</h3>
              <p style={{ color: '#94a3b8' }}>Thank you for your message. Our technical support team will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Full Name</label>
                <input required type="text" placeholder="e.g. Ramesh Chandra" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Official Email</label>
                <input required type="email" placeholder="ramesh@hotel.demo" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Subject / Department</label>
                <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                  <option value="">Select Topic</option>
                  <option value="property">Accommodation Registration Support</option>
                  <option value="police">Police Station Verification</option>
                  <option value="api">Technical & Cloud API Integration</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Message</label>
                <textarea required rows={4} placeholder="Describe your inquiry..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
                <Send size={16} />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
