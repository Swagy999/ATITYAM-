import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, Users, CalendarCheck, ShieldAlert, BarChart3, 
  FileText, Settings, Shield, UserCheck, MapPin, Search, PlusCircle, CheckCircle, Menu, X
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  if (!user) return null;

  const role = user.role_slug;

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  const renderNavLinks = () => {
    switch (role) {
      case 'property_owner':
      case 'property_staff':
        return (
          <>
            <div className="sidebar-section-title">Property Operations</div>
            <NavLink to="/app/property" end onClick={handleLinkClick} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Building2 size={18} />
              <span>Property Overview</span>
            </NavLink>
            <NavLink to="/app/property/stays" onClick={handleLinkClick} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <CalendarCheck size={18} />
              <span>Active Stays & Check-Out</span>
            </NavLink>
            <NavLink to="/app/property/guests" onClick={handleLinkClick} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={18} />
              <span>Guest Directory</span>
            </NavLink>
            <NavLink to="/app/property/reports" onClick={handleLinkClick} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
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
            <NavLink to="/app/police" end onClick={handleLinkClick} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Shield size={18} />
              <span>Police Command Center</span>
            </NavLink>
            <NavLink to="/app/police/guest-search" onClick={handleLinkClick} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Search size={18} />
              <span>Authorized Guest Search</span>
            </NavLink>
            <NavLink to="/app/police/property-search" onClick={handleLinkClick} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Building2 size={18} />
              <span>Property Registry & Audit</span>
            </NavLink>
            <NavLink to="/app/police/alerts" onClick={handleLinkClick} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
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
            <NavLink to="/app/tourism" end onClick={handleLinkClick} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <BarChart3 size={18} />
              <span>Executive Dashboard</span>
            </NavLink>
            <NavLink to="/app/tourism/reports" onClick={handleLinkClick} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FileText size={18} />
              <span>State & District Reports</span>
            </NavLink>
            <NavLink to="/app/tourism/destinations" onClick={handleLinkClick} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <MapPin size={18} />
              <span>Destinations & Capacity</span>
            </NavLink>
            <NavLink to="/app/tourism/properties" onClick={handleLinkClick} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
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
            <NavLink to="/app/admin" end onClick={handleLinkClick} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Shield size={18} />
              <span>Super Admin Console</span>
            </NavLink>
            <NavLink to="/app/admin/users" onClick={handleLinkClick} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={18} />
              <span>User & Role Governance</span>
            </NavLink>
            <NavLink to="/app/admin/properties" onClick={handleLinkClick} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Building2 size={18} />
              <span>All Properties Verification</span>
            </NavLink>
            <NavLink to="/app/admin/audit-logs" onClick={handleLinkClick} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FileText size={18} />
              <span>Security Audit Logs</span>
            </NavLink>
            <NavLink to="/app/admin/settings" onClick={handleLinkClick} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Settings size={18} />
              <span>System Settings</span>
            </NavLink>
            
            <div className="sidebar-section-title" style={{ marginTop: 20 }}>Cross-Module Views</div>
            <NavLink to="/app/property" onClick={handleLinkClick} className="sidebar-link">
              <Building2 size={18} />
              <span>Hotel View</span>
            </NavLink>
            <NavLink to="/app/police" onClick={handleLinkClick} className="sidebar-link">
              <ShieldAlert size={18} />
              <span>Police View</span>
            </NavLink>
            <NavLink to="/app/tourism" onClick={handleLinkClick} className="sidebar-link">
              <BarChart3 size={18} />
              <span>Tourism BI View</span>
            </NavLink>
          </>
        );
    }
  };

  return (
    <>
      {/* Mobile Floating Toggle for Dashboard */}
      <button 
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        title="Toggle Dashboard Navigation"
        aria-label="Toggle Dashboard Menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        <span>Dashboard Menu</span>
      </button>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`app-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
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
      </aside>

      <style>{`
        .app-sidebar {
          width: 260px;
          background: #0d1322;
          border-right: 1px solid #1f2d47;
          min-height: calc(100vh - 71px);
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
        }

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

        .sidebar-mobile-toggle {
          display: none;
        }

        @media (max-width: 991px) {
          .sidebar-mobile-toggle {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 999;
            background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
            color: #ffffff;
            border: none;
            padding: 10px 16px;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 0.85rem;
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.5);
            cursor: pointer;
          }

          .app-sidebar {
            position: fixed;
            top: 71px;
            left: 0;
            bottom: 0;
            height: calc(100vh - 71px);
            max-width: 280px;
            transform: translateX(-100%);
            box-shadow: 20px 0 50px rgba(0, 0, 0, 0.8);
            z-index: 1001;
            overflow-y: auto;
          }

          .app-sidebar.mobile-open {
            transform: translateX(0);
          }

          .sidebar-backdrop {
            position: fixed;
            inset: 0;
            top: 71px;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(4px);
            z-index: 1000;
          }
        }
      `}</style>
    </>
  );
};
