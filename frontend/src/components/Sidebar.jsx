import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, Users, CalendarCheck, ShieldAlert, BarChart3, 
  FileText, Settings, Shield, UserCheck, MapPin, Search, PlusCircle, CheckCircle
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role_slug;

  const renderNavLinks = () => {
    switch (role) {
      case 'property_owner':
      case 'property_staff':
        return (
          <>
            <div className="sidebar-section-title">Property Operations</div>
            <NavLink to="/app/property" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Building2 size={18} />
              <span>Property Overview</span>
            </NavLink>
            <NavLink to="/app/property/stays" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <CalendarCheck size={18} />
              <span>Active Stays & Check-Out</span>
            </NavLink>
            <NavLink to="/app/property/guests" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={18} />
              <span>Guest Directory</span>
            </NavLink>
            <NavLink to="/app/property/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FileText size={18} />
              <span>Property Reports</span>
            </NavLink>
          </>
        );

      case 'police_officer':
      case 'police_admin':
        return (
          <>
            <div className="sidebar-section-title">Safety & Enforcement</div>
            <NavLink to="/app/police" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Shield size={18} />
              <span>Police Command Center</span>
            </NavLink>
            <NavLink to="/app/police/guest-search" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Search size={18} />
              <span>Authorized Guest Search</span>
            </NavLink>
            <NavLink to="/app/police/property-search" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Building2 size={18} />
              <span>Property Registry & Audit</span>
            </NavLink>
            <NavLink to="/app/police/alerts" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <ShieldAlert size={18} />
              <span>Security Review Alerts</span>
            </NavLink>
          </>
        );

      case 'tourism_admin':
      case 'district_admin':
      case 'state_admin':
        return (
          <>
            <div className="sidebar-section-title">Tourism Intelligence</div>
            <NavLink to="/app/tourism" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <BarChart3 size={18} />
              <span>Executive Dashboard</span>
            </NavLink>
            <NavLink to="/app/tourism/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FileText size={18} />
              <span>State & District Reports</span>
            </NavLink>
            <NavLink to="/app/tourism/destinations" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <MapPin size={18} />
              <span>Destinations & Capacity</span>
            </NavLink>
            <NavLink to="/app/tourism/properties" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Building2 size={18} />
              <span>Accommodation Directory</span>
            </NavLink>
          </>
        );

      case 'super_admin':
      default:
        return (
          <>
            <div className="sidebar-section-title">System Governance</div>
            <NavLink to="/app/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Shield size={18} />
              <span>Super Admin Console</span>
            </NavLink>
            <NavLink to="/app/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={18} />
              <span>User & Role Governance</span>
            </NavLink>
            <NavLink to="/app/admin/properties" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Building2 size={18} />
              <span>All Properties Verification</span>
            </NavLink>
            <NavLink to="/app/admin/audit-logs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FileText size={18} />
              <span>Security Audit Logs</span>
            </NavLink>
            <NavLink to="/app/admin/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Settings size={18} />
              <span>System Settings</span>
            </NavLink>
            
            <div className="sidebar-section-title" style={{ marginTop: 20 }}>Cross-Module Views</div>
            <NavLink to="/app/property" className="sidebar-link">
              <Building2 size={18} />
              <span>Hotel View</span>
            </NavLink>
            <NavLink to="/app/police" className="sidebar-link">
              <ShieldAlert size={18} />
              <span>Police View</span>
            </NavLink>
            <NavLink to="/app/tourism" className="sidebar-link">
              <BarChart3 size={18} />
              <span>Tourism BI View</span>
            </NavLink>
          </>
        );
    }
  };

  return (
    <aside style={{ width: 260, background: '#0d1322', borderRight: '1px solid #1f2d47', minHeight: 'calc(100vh - 71px)', padding: '24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* User Identity Card */}
        <div style={{ background: '#162032', border: '1px solid #1f2d47', borderRadius: 10, padding: '12px 14px', marginBottom: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {user.role_name}
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.full_name}
          </div>
          {user.property_name && (
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Building2 size={12} color="#38bdf8" />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.property_name}</span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {renderNavLinks()}
        </nav>
      </div>

      {/* Footer Tag */}
      <div style={{ paddingTop: 16, borderTop: '1px solid #1f2d47', fontSize: '0.72rem', color: '#64748b', textAlign: 'center' }}>
        ATITHYA360 Platform v1.0<br/>Demonstration Environment
      </div>

      <style>{`
        .sidebar-section-title {
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 8px 12px 4px 12px;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          color: #cbd5e1;
          font-size: 0.88rem;
          font-weight: 600;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .sidebar-link:hover {
          background: #1a2438;
          color: #38bdf8;
        }
        .sidebar-link.active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }
      `}</style>
    </aside>
  );
};
