import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = '#3b82f6', onClick }) => {
  return (
    <div 
      className="glass-card" 
      onClick={onClick}
      style={{ 
        padding: '20px 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      {/* Background Subtle Gradient Glow */}
      <div 
        style={{ 
          position: 'absolute', right: -20, bottom: -20, width: 90, height: 90, 
          borderRadius: '50%', background: color, opacity: 0.08, filter: 'blur(20px)', pointerEvents: 'none' 
        }} 
      />

      <div>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
          {title}
        </div>
        <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            {trend && (
              <span style={{ color: trend.startsWith('+') ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                {trend}
              </span>
            )}
            <span>{subtitle}</span>
          </div>
        )}
      </div>

      {Icon && (
        <div 
          style={{ 
            width: 46, height: 46, borderRadius: 12, 
            background: `${color}18`, border: `1px solid ${color}35`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: color
          }}
        >
          <Icon size={22} />
        </div>
      )}
    </div>
  );
};
