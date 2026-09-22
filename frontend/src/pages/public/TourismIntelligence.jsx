import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, MapPin, Globe, Database, ArrowRight, Layers } from 'lucide-react';
import { analyticsService } from '../../services/services';

export const TourismIntelligence = () => {
  const [trends, setTrends] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    analyticsService.getMonthlyTrends().then(res => res.success && setTrends(res.data.trends || [])).catch(() => {});
    analyticsService.getStateWise().then(res => res.success && setStates(res.data.states || [])).catch(() => {});
    analyticsService.getCountryWise().then(res => res.success && setCountries(res.data.countries || [])).catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px', color: '#fff' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <span className="badge badge-info" style={{ marginBottom: 16 }}>Macro Data Intelligence</span>
        <h1 style={{ fontSize: '2.8rem', marginBottom: 16 }}>State & District Tourism Intelligence</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: 750, margin: '0 auto' }}>
          Real-time visitor velocity, destination carrying capacity, and international origin analytics for tourism planning and policy.
        </p>
      </div>

      {/* Highlights Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 48 }}>
        
        {/* State Inflow Leaders */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <MapPin size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Top Inflow States</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {states.slice(0, 5).map((s, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#0f172a', borderRadius: 6 }}>
                <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{s.state}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>{s.visitors?.toLocaleString()} visitors</span>
              </div>
            ))}
          </div>
        </div>

        {/* International Source Markets */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Globe size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Top International Origins</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {countries.slice(0, 5).map((c, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#0f172a', borderRadius: 6 }}>
                <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{c.country}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>{c.visitors?.toLocaleString()} arrivals</span>
              </div>
            ))}
          </div>
        </div>

        {/* Future Cloud Lakehouse Architecture */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Database size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Azure Lakehouse Ready</h3>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 16 }}>
            Data seamlessly structured to feed Azure Data Factory, ADLS Gen2, and Databricks PySpark Gold datamarts for AI demand forecasting.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.82rem', color: '#cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>• Bronze: Raw Ingestion Parquet</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>• Silver: Cleansed Delta Lake</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>• Gold: Star Schema Datamarts</div>
          </div>
        </div>

      </div>

      <div className="glass-panel" style={{ padding: 40, textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: 12 }}>Explore Interactive Tourism Dashboards</h2>
        <p style={{ color: '#94a3b8', maxWidth: 600, margin: '0 auto 24px' }}>
          Log in with the Tourism Admin demo role to interact with dynamic graphs, filter monthly reports, and download CSVs.
        </p>
        <Link to="/login" className="btn btn-primary" style={{ padding: '12px 28px' }}>
          <span>Launch Tourism BI Dashboard</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};
