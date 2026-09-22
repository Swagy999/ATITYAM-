import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { propertyService, stayService, guestService, adminService } from '../../services/services';
import { StatCard } from '../../components/StatCard';
import { AlertBadge } from '../../components/AlertBadge';
import { Modal } from '../../components/Modal';
import { 
  Building2, Users, CalendarCheck, DoorOpen, Plus, LogOut, 
  Search, FileText, CheckCircle2, AlertCircle, RefreshCw, UploadCloud
} from 'lucide-react';

export const PropertyDashboard = () => {
  const { user } = useAuth();
  const propertyId = user?.property_id || 1;

  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchStay, setSearchStay] = useState('');

  // Modals
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [checkOutModalOpen, setCheckOutModalOpen] = useState(false);
  const [selectedStay, setSelectedStay] = useState(null);
  const [docUploadModalOpen, setDocUploadModalOpen] = useState(false);

  // Master Data
  const [master, setMaster] = useState({ states: [], destinations: [] });

  // Check-In Form State
  const [checkInForm, setCheckInForm] = useState({
    guest_type: 'Indian Guest',
    full_name: '',
    dob: '1990-01-01',
    gender: 'Male',
    mobile: '',
    email: '',
    nationality: 'Indian',
    address: '',
    city: '',
    state_id: '1',
    emergency_contact: '',
    purpose_of_visit: 'Tourism',
    // Foreign fields
    passport_number: '',
    visa_number: '',
    visa_type: 'e-Tourist (30 Days)',
    visa_expiry: '2027-01-01',
    port_of_entry: 'Netaji Subhash Chandra Bose Intl Airport',
    // Stay fields
    room_id: '',
    num_guests: 1,
    expected_checkout: '2026-09-25 11:00:00',
    primary_destination_id: '',
    // Document
    document_type: 'Driving License',
    document_reference: ''
  });

  const loadData = () => {
    setLoading(true);
    propertyService.getDetails(propertyId)
      .then(res => {
        if (res.success && res.data) {
          setPropertyData(res.data);
          if (res.data.rooms?.length > 0 && !checkInForm.room_id) {
            const avail = res.data.rooms.find(r => r.status === 'Available');
            if (avail) setCheckInForm(f => ({ ...f, room_id: avail.id }));
          }
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    adminService.getMasterData()
      .then(res => res.success && setMaster(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, [propertyId]);

  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        property_id: propertyId,
        ...checkInForm,
        room_id: Number(checkInForm.room_id)
      };

      const res = await stayService.checkin(payload);
      if (res.success) {
        setCheckInModalOpen(false);
        loadData();
      } else {
        alert(res.message || 'Check-in failed');
      }
    } catch (err) {
      alert(err.message || 'Check-in submission failed');
    }
  };

  const handleCheckOutSubmit = async () => {
    if (!selectedStay) return;
    try {
      const res = await stayService.checkout(selectedStay.id);
      if (res.success) {
        setCheckOutModalOpen(false);
        setSelectedStay(null);
        loadData();
      } else {
        alert(res.message || 'Check-out failed');
      }
    } catch (err) {
      alert(err.message || 'Check-out failed');
    }
  };

  const prop = propertyData?.property;
  const rooms = propertyData?.rooms || [];
  const activeStays = propertyData?.active_stays || [];

  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const occupancyRate = rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0;

  const filteredStays = activeStays.filter(s => 
    s.guest_name?.toLowerCase().includes(searchStay.toLowerCase()) ||
    s.guest_code?.toLowerCase().includes(searchStay.toLowerCase()) ||
    s.room_number?.toLowerCase().includes(searchStay.toLowerCase())
  );

  return (
    <div style={{ color: '#fff' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>{prop?.name || 'Accommodation Terminal'}</h1>
            {prop?.status && <AlertBadge status={prop.status} />}
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: 4 }}>
            Property Code: <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{prop?.property_code || 'PROP-KOL-1001'}</span> • {prop?.city}, {prop?.state_name} • Police Stn: {prop?.station_name}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={loadData} className="btn btn-secondary" title="Refresh Live Data">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          
          <button 
            onClick={() => {
              // Pre-select first available room
              const avail = rooms.find(r => r.status === 'Available');
              if (avail) setCheckInForm(f => ({ ...f, room_id: avail.id }));
              setCheckInModalOpen(true);
            }} 
            className="btn btn-primary"
          >
            <Plus size={18} />
            <span>Digital Guest Check-In</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard 
          title="Active Occupancy"
          value={`${occupancyRate}%`}
          subtitle={`${occupiedRooms} of ${rooms.length} rooms occupied`}
          icon={Building2}
          color="#3b82f6"
        />
        <StatCard 
          title="Current In-House Guests"
          value={activeStays.length}
          subtitle="Live registered stay records"
          icon={Users}
          color="#10b981"
        />
        <StatCard 
          title="Available Rooms"
          value={availableRooms}
          subtitle="Ready for instant check-in"
          icon={DoorOpen}
          color="#06b6d4"
        />
        <StatCard 
          title="Foreign Visitors Stay"
          value={activeStays.filter(s => s.guest_type === 'Foreign Visitor').length}
          subtitle="Verified international passports"
          icon={FileText}
          color="#f59e0b"
        />
      </div>

      {/* Main Grid: Active Stays Table & Room Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 36 }}>
        
        {/* Active Stays Panel */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>In-House Guest Stays</h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Live checked-in guests at this property</p>
            </div>
            <div style={{ position: 'relative', width: 220 }}>
              <input 
                type="text" 
                placeholder="Search guest / room..." 
                value={searchStay}
                onChange={e => setSearchStay(e.target.value)}
                style={{ paddingLeft: 34, fontSize: '0.85rem' }}
              />
              <Search size={14} color="#64748b" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Stay Code</th>
                  <th>Guest Name</th>
                  <th>Category</th>
                  <th>Room</th>
                  <th>Check-In Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStays.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
                      No active guests currently checked in matching search filter.
                    </td>
                  </tr>
                ) : (
                  filteredStays.map(stay => (
                    <tr key={stay.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#38bdf8' }}>{stay.stay_code}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{stay.guest_name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{stay.nationality} • {stay.guest_mobile}</div>
                      </td>
                      <td>
                        <span className={`badge ${stay.guest_type === 'Foreign Visitor' ? 'badge-warning' : 'badge-info'}`}>
                          {stay.guest_type}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{stay.room_number} <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({stay.room_type})</span></td>
                      <td style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{stay.checkin_time?.substring(0, 16)}</td>
                      <td><AlertBadge status={stay.stay_status} /></td>
                      <td>
                        <button
                          onClick={() => {
                            setSelectedStay(stay);
                            setCheckOutModalOpen(true);
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        >
                          <LogOut size={14} color="#f87171" />
                          <span>Check-Out</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Room Inventory Status Panel */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4 }}>Room Inventory</h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 20 }}>Live room availability matrix</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 10 }}>
            {rooms.map(r => {
              const isOccupied = r.status === 'Occupied';
              const isMaint = r.status === 'Maintenance';
              return (
                <div 
                  key={r.id}
                  style={{
                    padding: '12px 8px',
                    borderRadius: 8,
                    textAlign: 'center',
                    background: isOccupied ? 'rgba(59, 130, 246, 0.15)' : (isMaint ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.12)'),
                    border: `1px solid ${isOccupied ? '#3b82f6' : (isMaint ? '#ef4444' : '#10b981')}44`
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{r.room_number}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>{r.room_type}</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: 4, color: isOccupied ? '#38bdf8' : (isMaint ? '#fca5a5' : '#34d399') }}>
                    {r.status}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> Available ({availableRooms})</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} /> Occupied ({occupiedRooms})</span>
          </div>
        </div>

      </div>

      {/* CHECK-IN MODAL */}
      <Modal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        title="Digital Guest Check-In"
        subtitle="Register arriving guest & allocate room"
        maxWidth={720}
      >
        <form onSubmit={handleCheckInSubmit}>
          
          {/* Guest Category Toggle */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <button
              type="button"
              onClick={() => setCheckInForm({...checkInForm, guest_type: 'Indian Guest', nationality: 'Indian'})}
              className={`btn ${checkInForm.guest_type === 'Indian Guest' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              Indian Citizen
            </button>
            <button
              type="button"
              onClick={() => setCheckInForm({...checkInForm, guest_type: 'Foreign Visitor', nationality: 'American'})}
              className={`btn ${checkInForm.guest_type === 'Foreign Visitor' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              Foreign Visitor (Passport / Visa)
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 18 }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Full Name *</label>
              <input required type="text" placeholder="e.g. Amitabh Sengupta" value={checkInForm.full_name} onChange={e => setCheckInForm({...checkInForm, full_name: e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Mobile Number *</label>
              <input required type="text" placeholder="+91 9831122334" value={checkInForm.mobile} onChange={e => setCheckInForm({...checkInForm, mobile: e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Gender</label>
              <select value={checkInForm.gender} onChange={e => setCheckInForm({...checkInForm, gender: e.target.value})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Purpose of Visit</label>
              <select value={checkInForm.purpose_of_visit} onChange={e => setCheckInForm({...checkInForm, purpose_of_visit: e.target.value})}>
                <option value="Tourism">Tourism</option>
                <option value="Business">Business</option>
                <option value="Medical">Medical</option>
                <option value="Education">Education</option>
                <option value="Family Visit">Family Visit</option>
              </select>
            </div>
          </div>

          {/* Foreign Visitor Specific Fields */}
          {checkInForm.guest_type === 'Foreign Visitor' && (
            <div style={{ padding: 14, background: 'rgba(59, 130, 246, 0.08)', borderRadius: 8, border: '1px solid rgba(59, 130, 246, 0.25)', marginBottom: 18 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', marginBottom: 10 }}>International Travel Credentials (Demo Verification)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Nationality *</label>
                  <input required type="text" value={checkInForm.nationality} onChange={e => setCheckInForm({...checkInForm, nationality: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Passport Number *</label>
                  <input required type="text" placeholder="PASS-USA-998811" value={checkInForm.passport_number} onChange={e => setCheckInForm({...checkInForm, passport_number: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Visa Number *</label>
                  <input required type="text" placeholder="VISA-IND-T-88192" value={checkInForm.visa_number} onChange={e => setCheckInForm({...checkInForm, visa_number: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Visa Type</label>
                  <input type="text" value={checkInForm.visa_type} onChange={e => setCheckInForm({...checkInForm, visa_type: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          {/* Document & Room Allocation */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 18 }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>ID Document Type</label>
              <select value={checkInForm.document_type} onChange={e => setCheckInForm({...checkInForm, document_type: e.target.value})}>
                <option value="Driving License">Driving License</option>
                <option value="Voter ID">Voter ID</option>
                <option value="Passport">Passport</option>
                <option value="National ID Card">National ID Card</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>ID Reference Number</label>
              <input type="text" placeholder="e.g. DL-WB-2024-00192" value={checkInForm.document_reference} onChange={e => setCheckInForm({...checkInForm, document_reference: e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Allocate Room *</label>
              <select required value={checkInForm.room_id} onChange={e => setCheckInForm({...checkInForm, room_id: e.target.value})}>
                <option value="">Select Room</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id} disabled={r.status !== 'Available'}>
                    Room {r.room_number} ({r.room_type}) - {r.status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Expected Check-Out *</label>
              <input required type="datetime-local" value={checkInForm.expected_checkout.replace(' ', 'T')} onChange={e => setCheckInForm({...checkInForm, expected_checkout: e.target.value.replace('T', ' ')})} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Residential Address & City</label>
            <input type="text" placeholder="City, State, Country" value={checkInForm.address} onChange={e => setCheckInForm({...checkInForm, address: e.target.value, city: e.target.value.split(',')[0] || 'Unknown'})} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" onClick={() => setCheckInModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} />
              <span>Confirm Digital Check-In</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* CHECK-OUT CONFIRMATION MODAL */}
      <Modal
        isOpen={checkOutModalOpen}
        onClose={() => setCheckOutModalOpen(false)}
        title="Confirm Guest Check-Out"
        subtitle="Complete stay & release room into available inventory"
        maxWidth={480}
      >
        {selectedStay && (
          <div>
            <div style={{ background: '#0f172a', padding: 16, borderRadius: 10, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Guest Name:</span>
                <span style={{ fontWeight: 700 }}>{selectedStay.guest_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Room Number:</span>
                <span style={{ fontWeight: 700 }}>Room {selectedStay.room_number}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Check-In Time:</span>
                <span>{selectedStay.checkin_time}</span>
              </div>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: 24, textAlign: 'center' }}>
              Are you sure you want to mark this stay as <strong>Checked Out</strong> and release the room?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setCheckOutModalOpen(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleCheckOutSubmit} className="btn btn-primary">
                <CheckCircle2 size={16} />
                <span>Confirm Check-Out</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
