import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { policeService, alertService } from '../../services/services';
import { StatCard } from '../../components/StatCard';
import { AlertBadge } from '../../components/AlertBadge';
import { Modal } from '../../components/Modal';
import { 
  ShieldCheck, Search, ShieldAlert, Building2, Users, 
  CheckCircle2, AlertCircle, FileText, Lock, Globe, Clock
} from 'lucide-react';

export const PoliceDashboard = () => {
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [guestTypeFilter, setGuestTypeFilter] = useState('');
  const [stayStatusFilter, setStayStatusFilter] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Alerts
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [alertReviewNotes, setAlertReviewNotes] = useState('');
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  // Property Registry
  const [properties, setProperties] = useState([]);
  const [propSearch, setPropSearch] = useState('');

  // Selected Guest Modal for Full Stay Timeline
  const [selectedGuestRecord, setSelectedGuestRecord] = useState(null);

  const loadAlerts = () => {
    alertService.list({ status: 'Open' })
      .then(res => res.success && setAlerts(res.data || []))
      .catch(() => {});
  };

  const loadProperties = () => {
    policeService.propertySearch({})
      .then(res => res.success && setProperties(res.data.properties || []))
      .catch(() => {});
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setSearching(true);
    policeService.search({
      query: searchQuery,
      guest_type: guestTypeFilter,
      stay_status: stayStatusFilter
    })
      .then(res => {
        if (res.success && res.data) {
          setSearchResults(res.data.results || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setSearching(false));
  };

  useEffect(() => {
    handleSearch();
    loadAlerts();
    loadProperties();
  }, []);

  const handleAlertResolve = async (newStatus) => {
    if (!selectedAlert) return;
    try {
      const res = await alertService.updateStatus({
        alert_id: selectedAlert.id,
        status: newStatus,
        resolved_notes: alertReviewNotes || 'Verified by station officer.'
      });
      if (res.success) {
        setAlertModalOpen(false);
        setSelectedAlert(null);
        setAlertReviewNotes('');
        loadAlerts();
      }
    } catch (err) {
      alert(err.message || 'Alert update failed');
    }
  };

  const activeForeignersCount = searchResults.filter(r => r.guest_type === 'Foreign Visitor' && r.stay_status === 'Checked In').length;

  return (
    <div style={{ color: '#fff' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(16,185,129,0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} />
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Police & Public Safety Command</h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: 4 }}>
            Officer In-Charge: <strong>{user?.full_name}</strong> • Jurisdiction: <span style={{ color: '#38bdf8' }}>Park Street & District Command</span>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', padding: '8px 14px', borderRadius: 8, fontSize: '0.8rem', color: '#38bdf8' }}>
          <Lock size={14} />
          <span>All Queries Encrypted & Audited</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard 
          title="Jurisdiction Properties"
          value={properties.length}
          subtitle="Registered accommodations"
          icon={Building2}
          color="#3b82f6"
        />
        <StatCard 
          title="Active Live Stays"
          value={searchResults.filter(r => r.stay_status === 'Checked In').length}
          subtitle="Current registered guests"
          icon={Users}
          color="#10b981"
        />
        <StatCard 
          title="Active Foreign Visitors"
          value={activeForeignersCount}
          subtitle="Passport & visa verified"
          icon={Globe}
          color="#f59e0b"
        />
        <StatCard 
          title="Open Review Alerts"
          value={alerts.length}
          subtitle="Pending officer review"
          icon={ShieldAlert}
          color="#ef4444"
        />
      </div>

      {/* Authorized Parameter Search Form */}
      <div className="glass-panel" style={{ padding: 24, marginBottom: 32, border: '1px solid rgba(59,130,246,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Search size={18} color="#38bdf8" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Authorized Search Terminal</h2>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Search Name / Mobile / Passport / Code</label>
            <input 
              type="text" 
              placeholder="e.g. John, 98311, PASS-USA" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Visitor Category</label>
            <select value={guestTypeFilter} onChange={e => setGuestTypeFilter(e.target.value)}>
              <option value="">All Categories</option>
              <option value="Indian Guest">Indian Guest</option>
              <option value="Foreign Visitor">Foreign Visitor</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Stay Status</label>
            <select value={stayStatusFilter} onChange={e => setStayStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Checked In">Checked In (Active Stay)</option>
              <option value="Checked Out">Checked Out</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Search size={16} />
              <span>{searching ? 'Querying...' : 'Search'}</span>
            </button>
            <button 
              type="button" 
              onClick={() => { setSearchQuery(''); setGuestTypeFilter(''); setStayStatusFilter(''); handleSearch(); }}
              className="btn btn-secondary"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Main Grid: Search Results & Safety Alerts Queue */}
      <div className="grid-property-dashboard" style={{ display: 'grid', gap: 24, marginBottom: 36 }}>
        
        {/* Search Results Table */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Stay Records ({searchResults.length})</h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Real-time accommodation stay registry</p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Stay Code</th>
                  <th>Guest Name</th>
                  <th>Category</th>
                  <th>Accommodation</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
                      No records found matching search criteria.
                    </td>
                  </tr>
                ) : (
                  searchResults.map(row => (
                    <tr key={row.stay_id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#38bdf8' }}>{row.stay_code}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{row.full_name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {row.nationality} {row.passport_number ? `• ${row.passport_number}` : `• ${row.mobile}`}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${row.guest_type === 'Foreign Visitor' ? 'badge-warning' : 'badge-info'}`}>
                          {row.guest_type}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{row.property_name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{row.station_name}</div>
                      </td>
                      <td style={{ fontWeight: 700 }}>Room {row.room_number}</td>
                      <td><AlertBadge status={row.stay_status} /></td>
                      <td>
                        <button
                          onClick={() => setSelectedGuestRecord(row)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Review Queue Panel */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <ShieldAlert size={20} color="#f59e0b" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Review Queue ({alerts.length})</h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 20 }}>Human-in-the-loop verification items</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {alerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
                <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 8px', display: 'block' }} />
                <span>All verification items cleared.</span>
              </div>
            ) : (
              alerts.map(a => (
                <div 
                  key={a.id}
                  className="glass-card"
                  style={{ padding: 16, borderLeft: `4px solid ${a.severity === 'High' ? '#ef4444' : '#f59e0b'}` }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>{a.alert_code}</span>
                    <AlertBadge status={a.severity} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{a.title}</div>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: 12 }}>{a.message}</p>
                  <button
                    onClick={() => {
                      setSelectedAlert(a);
                      setAlertModalOpen(true);
                    }}
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    Review & Clear
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* INSPECTION DETAIL MODAL */}
      <Modal
        isOpen={!!selectedGuestRecord}
        onClose={() => setSelectedGuestRecord(null)}
        title="Stay & Identity Dossier"
        subtitle="Authorized law enforcement verification metadata"
        maxWidth={640}
      >
        {selectedGuestRecord && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#0f172a', padding: 16, borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#94a3b8' }}>Guest Name:</span>
                <span style={{ fontWeight: 800 }}>{selectedGuestRecord.full_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#94a3b8' }}>Nationality & Category:</span>
                <span>{selectedGuestRecord.nationality} ({selectedGuestRecord.guest_type})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#94a3b8' }}>Contact:</span>
                <span>{selectedGuestRecord.mobile} • {selectedGuestRecord.email || 'N/A'}</span>
              </div>
              {selectedGuestRecord.passport_number && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#94a3b8' }}>Passport & Visa:</span>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>{selectedGuestRecord.passport_number} • {selectedGuestRecord.visa_number}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Address:</span>
                <span>{selectedGuestRecord.guest_address}, {selectedGuestRecord.guest_city}</span>
              </div>
            </div>

            <div style={{ background: '#0f172a', padding: 16, borderRadius: 10 }}>
              <div style={{ fontWeight: 700, marginBottom: 8, color: '#38bdf8' }}>Stay Location</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#94a3b8' }}>Accommodation:</span>
                <span style={{ fontWeight: 700 }}>{selectedGuestRecord.property_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#94a3b8' }}>Room Allocated:</span>
                <span>Room {selectedGuestRecord.room_number} ({selectedGuestRecord.room_type})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Check-In Timestamp:</span>
                <span>{selectedGuestRecord.checkin_time}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={() => setSelectedGuestRecord(null)} className="btn btn-primary">Close Dossier</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ALERT REVIEW MODAL */}
      <Modal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        title="Security Alert Review"
        subtitle="Human verification decision for automated flag"
        maxWidth={500}
      >
        {selectedAlert && (
          <div>
            <div style={{ background: '#0f172a', padding: 16, borderRadius: 10, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{selectedAlert.title}</div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>{selectedAlert.message}</p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Review / Inspection Notes
              </label>
              <textarea 
                rows={3} 
                placeholder="Enter official resolution notes..." 
                value={alertReviewNotes}
                onChange={e => setAlertReviewNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setAlertModalOpen(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={() => handleAlertResolve('Under Review')} className="btn btn-secondary" style={{ color: '#fbbf24' }}>Mark Under Review</button>
              <button onClick={() => handleAlertResolve('Resolved')} className="btn btn-success">Clear & Resolve</button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
