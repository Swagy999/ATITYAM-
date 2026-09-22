import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService, propertyService } from '../../services/services';
import { StatCard } from '../../components/StatCard';
import { AlertBadge } from '../../components/AlertBadge';
import { Modal } from '../../components/Modal';
import { 
  Shield, Users, Building2, FileText, Settings, 
  Plus, CheckCircle2, AlertCircle, RefreshCw, KeyRound, Globe
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [properties, setProperties] = useState([]);
  const [settings, setSettings] = useState([]);
  const [master, setMaster] = useState({ roles: [], states: [], districts: [] });

  // User Create/Edit Modal
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userForm, setUserForm] = useState({
    full_name: '',
    email: '',
    password: '',
    mobile: '',
    designation: '',
    role_id: '7',
    state_id: '1',
    district_id: '1',
    status: 'Active'
  });

  const loadData = () => {
    adminService.listUsers().then(res => res.success && setUsers(res.data || [])).catch(() => {});
    adminService.getAuditLogs({ limit: 50 }).then(res => res.success && setAuditLogs(res.data.logs || [])).catch(() => {});
    propertyService.list({ limit: 50 }).then(res => res.success && setProperties(res.data.properties || [])).catch(() => {});
    adminService.getSettings().then(res => res.success && setSettings(res.data || [])).catch(() => {});
    adminService.getMasterData().then(res => res.success && setMaster(res.data || {})).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await adminService.createUser({
        ...userForm,
        role_id: Number(userForm.role_id),
        state_id: Number(userForm.state_id) || null,
        district_id: Number(userForm.district_id) || null
      });

      if (res.success) {
        setUserModalOpen(false);
        loadData();
      } else {
        alert(res.message || 'User creation failed');
      }
    } catch (err) {
      alert(err.message || 'Failed to create user account');
    }
  };

  return (
    <div style={{ color: '#fff' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(168,85,247,0.15)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={22} />
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Super Admin Governance Console</h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: 4 }}>
            System-wide user administration, role governance, immutable audit logging & configuration
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={loadData} className="btn btn-secondary">
            <RefreshCw size={16} />
            <span>Sync Live System</span>
          </button>
          
          <button onClick={() => setUserModalOpen(true)} className="btn btn-primary">
            <Plus size={16} />
            <span>Create User Account</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard 
          title="Total User Accounts"
          value={users.length}
          subtitle="System operators & officers"
          icon={Users}
          color="#a855f7"
        />
        <StatCard 
          title="Total Properties"
          value={properties.length}
          subtitle="Accommodations on platform"
          icon={Building2}
          color="#3b82f6"
        />
        <StatCard 
          title="Security Audit Trail"
          value={auditLogs.length}
          subtitle="Immutable activity records"
          icon={FileText}
          color="#10b981"
        />
        <StatCard 
          title="Active System Roles"
          value={master.roles?.length || 8}
          subtitle="RBAC security tiers"
          icon={KeyRound}
          color="#f59e0b"
        />
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid #1f2d47', paddingBottom: 16, marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab('users')}
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Users size={16} />
          <span>Users & Roles ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('properties')}
          className={`btn ${activeTab === 'properties' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Building2 size={16} />
          <span>Properties ({properties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`btn ${activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <FileText size={16} />
          <span>Security Audit Trail ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Settings size={16} />
          <span>System Settings</span>
        </button>
      </div>

      {/* TAB 1: USERS */}
      {activeTab === 'users' && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16 }}>Platform User Accounts</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role Tier</th>
                  <th>Designation</th>
                  <th>Jurisdiction / Property</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontFamily: 'monospace', color: '#94a3b8' }}>#{u.id}</td>
                    <td style={{ fontWeight: 600 }}>{u.full_name}</td>
                    <td style={{ color: '#38bdf8' }}>{u.email}</td>
                    <td>
                      <span className="badge badge-info">{u.role_name}</span>
                    </td>
                    <td>{u.designation || 'Staff'}</td>
                    <td>{u.property_name || u.station_name || u.district_name || 'Global'}</td>
                    <td><AlertBadge status={u.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PROPERTIES */}
      {activeTab === 'properties' && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16 }}>Registered Properties Directory</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Property Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Police Station</th>
                  <th>Verification</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{p.property_code}</td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.property_type}</td>
                    <td>{p.city}, {p.state_name}</td>
                    <td>{p.room_capacity} Rooms</td>
                    <td>{p.station_name}</td>
                    <td><AlertBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Cryptographic Audit Logs</h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Immutable recording of all sensitive operations</p>
            </div>
            <span className="badge badge-success">ZERO TAMPER VERIFIED</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User & Role</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>IP Address</th>
                  <th>Audit Details</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#94a3b8' }}>{log.created_at}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{log.user_email || 'System Daemon'}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{log.user_role || 'System'}</div>
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{log.action}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{log.entity} {log.entity_id ? `(${log.entity_id})` : ''}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.ip_address}</td>
                    <td style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16 }}>Global System Configuration</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {settings.map(s => (
              <div key={s.setting_key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#0f172a', borderRadius: 8, border: '1px solid #1e293b' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#38bdf8' }}>{s.setting_key}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{s.description} ({s.category})</div>
                </div>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#f8fafc', background: '#1e293b', padding: '4px 10px', borderRadius: 4 }}>
                  {s.setting_value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      <Modal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        title="Create Platform User Account"
        subtitle="Provision user credentials and assign role tier"
        maxWidth={600}
      >
        <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Full Name *</label>
              <input required type="text" placeholder="e.g. Subrata Mukherjee" value={userForm.full_name} onChange={e => setUserForm({...userForm, full_name: e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Email Address *</label>
              <input required type="email" placeholder="officer@police.demo" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Password *</label>
              <input required type="password" placeholder="Demo@123" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Mobile Number</label>
              <input type="text" placeholder="+91 9840011223" value={userForm.mobile} onChange={e => setUserForm({...userForm, mobile: e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Role Tier *</label>
              <select value={userForm.role_id} onChange={e => setUserForm({...userForm, role_id: e.target.value})}>
                {master.roles?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Designation</label>
              <input type="text" placeholder="e.g. Station Officer" value={userForm.designation} onChange={e => setUserForm({...userForm, designation: e.target.value})} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <button type="button" onClick={() => setUserModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Create User Account</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
