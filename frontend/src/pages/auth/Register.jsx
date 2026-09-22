import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminService, propertyService, authService } from '../../services/services';
import { Building2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [master, setMaster] = useState({ states: [], districts: [], police_stations: [] });
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    // User Account
    full_name: '',
    email: '',
    password: '',
    mobile: '',
    // Property Data
    property_name: '',
    property_type: 'Hotel',
    address: '',
    city: '',
    state_id: '',
    district_id: '',
    police_station_id: '',
    pincode: '',
    license_number: '',
    registration_number: '',
    room_capacity: 10,
    contact_person: ''
  });

  useEffect(() => {
    adminService.getMasterData()
      .then(res => {
        if (res.success && res.data) {
          setMaster(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleStateChange = (stateId) => {
    setForm({ ...form, state_id: stateId, district_id: '', police_station_id: '' });
    const dists = master.districts.filter(d => Number(d.state_id) === Number(stateId));
    setFilteredDistricts(dists);
    setFilteredStations([]);
  };

  const handleDistrictChange = (districtId) => {
    setForm({ ...form, district_id: districtId, police_station_id: '' });
    const stns = master.police_stations.filter(p => Number(p.district_id) === Number(districtId));
    setFilteredStations(stns);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Register User Account
      const userRes = await authService.register({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        mobile: form.mobile,
        designation: 'Property Owner',
        state_id: form.state_id ? Number(form.state_id) : null,
        district_id: form.district_id ? Number(form.district_id) : null
      });

      if (!userRes.success) {
        throw new Error(userRes.message || 'User account creation failed');
      }

      // 2. Register Property under new account
      const propRes = await propertyService.create({
        name: form.property_name,
        property_type: form.property_type,
        owner_name: form.full_name,
        contact_number: form.mobile,
        email: form.email,
        address: form.address,
        city: form.city,
        state_id: Number(form.state_id) || 1,
        district_id: Number(form.district_id) || 1,
        police_station_id: Number(form.police_station_id) || 1,
        pincode: form.pincode,
        license_number: form.license_number || ('LIC-' + randStr()),
        registration_number: form.registration_number || ('REG-TRM-' + randStr()),
        room_capacity: Number(form.room_capacity) || 10,
        contact_person: form.contact_person || form.full_name,
        status: 'Verified'
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const randStr = () => Math.floor(1000 + Math.random() * 9000);

  if (success) {
    return (
      <div style={{ minHeight: 'calc(100vh - 71px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, color: '#fff' }}>
        <div className="glass-panel" style={{ maxWidth: 540, width: '100%', padding: 40, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>Registration Successful!</h2>
          <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: 28 }}>
            Your property <strong>{form.property_name}</strong> and owner account have been registered and verified on ATITHYA360.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ padding: '12px 28px' }}>
            Proceed to Login Terminal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 71px)', padding: '60px 24px', color: '#fff' }}>
      <div className="glass-panel" style={{ maxWidth: 840, margin: '0 auto', padding: '40px 36px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span className="badge badge-info" style={{ marginBottom: 12 }}>Accommodation Onboarding</span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Register Your Accommodation</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Join the state-wide digital guest registration network</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '12px 16px', borderRadius: 8, fontSize: '0.9rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <h3 style={{ fontSize: '1.15rem', color: '#38bdf8', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #1e293b' }}>
            1. Proprietor & Account Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 28 }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Owner Full Name *</label>
              <input required type="text" placeholder="e.g. Rajesh Sen" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Email Address *</label>
              <input required type="email" placeholder="owner@hotel.demo" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Mobile Number *</label>
              <input required type="text" placeholder="+91 9830012345" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Portal Password *</label>
              <input required type="password" placeholder="Create secure password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
          </div>

          <h3 style={{ fontSize: '1.15rem', color: '#38bdf8', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #1e293b' }}>
            2. Property & Legal Registration
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 28 }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Property Name *</label>
              <input required type="text" placeholder="e.g. Nilgiri Tea Estate Homestay" value={form.property_name} onChange={e => setForm({...form, property_name: e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Property Type *</label>
              <select value={form.property_type} onChange={e => setForm({...form, property_type: e.target.value})}>
                <option value="Hotel">Hotel</option>
                <option value="Homestay">Homestay</option>
                <option value="Guest House">Guest House</option>
                <option value="Resort">Resort</option>
                <option value="Lodge">Lodge</option>
                <option value="Other">Other Accommodation</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>State *</label>
              <select required value={form.state_id} onChange={e => handleStateChange(e.target.value)}>
                <option value="">Select State</option>
                {master.states?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>District *</label>
              <select required value={form.district_id} onChange={e => handleDistrictChange(e.target.value)}>
                <option value="">Select District</option>
                {(filteredDistricts.length ? filteredDistricts : master.districts)?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Jurisdiction Police Station *</label>
              <select required value={form.police_station_id} onChange={e => setForm({...form, police_station_id: e.target.value})}>
                <option value="">Select Police Station</option>
                {(filteredStations.length ? filteredStations : master.police_stations)?.map(ps => <option key={ps.id} value={ps.id}>{ps.station_name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>City / Town *</label>
              <input required type="text" placeholder="e.g. Darjeeling" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>PIN Code *</label>
              <input required type="text" placeholder="734101" value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Room Capacity *</label>
              <input required type="number" min="1" max="500" value={form.room_capacity} onChange={e => setForm({...form, room_capacity: e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Trade License Number</label>
              <input type="text" placeholder="LIC-WB-2024-8891" value={form.license_number} onChange={e => setForm({...form, license_number: e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Tourism Registration No.</label>
              <input type="text" placeholder="REG-TRM-0192" value={form.registration_number} onChange={e => setForm({...form, registration_number: e.target.value})} />
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Full Address *</label>
            <textarea required rows={2} placeholder="Building, Street, Landmark" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: 14, fontSize: '1.05rem' }}>
            <span>{loading ? 'Submitting Registration...' : 'Complete Accommodation Onboarding'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

      </div>
    </div>
  );
};
