import React, { useState, useEffect } from 'react';
import { analyticsService, reportService, adminService } from '../../services/services';
import { StatCard } from '../../components/StatCard';
import { AlertBadge } from '../../components/AlertBadge';
import { 
  BarChart3, Globe, MapPin, Download, Filter, 
  TrendingUp, Building2, Users, FileSpreadsheet, Calendar
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const TourismDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [stateWise, setStateWise] = useState([]);
  const [countryWise, setCountryWise] = useState([]);
  const [destinations, setDestinations] = useState([]);

  // Filtered Report State
  const [reportData, setReportData] = useState({ summary: {}, records: [] });
  const [master, setMaster] = useState({ states: [] });
  const [filters, setFilters] = useState({
    report_type: '',
    state_id: '',
    nationality: '',
    date_from: '',
    date_to: ''
  });
  const [loadingReport, setLoadingReport] = useState(false);

  const loadData = () => {
    analyticsService.getOverview().then(res => res.success && setOverview(res.data)).catch(() => {});
    analyticsService.getMonthlyTrends().then(res => res.success && setMonthlyTrends(res.data.trends || [])).catch(() => {});
    analyticsService.getStateWise().then(res => res.success && setStateWise(res.data.states || [])).catch(() => {});
    analyticsService.getCountryWise().then(res => res.success && setCountryWise(res.data.countries || [])).catch(() => {});
    analyticsService.getDestinations().then(res => res.success && setDestinations(res.data.destinations || [])).catch(() => {});
    adminService.getMasterData().then(res => res.success && setMaster(res.data)).catch(() => {});
    
    fetchReport();
  };

  const fetchReport = () => {
    setLoadingReport(true);
    reportService.getReport(filters)
      .then(res => {
        if (res.success && res.data) {
          setReportData(res.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingReport(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchReport();
  };

  // Chart 1: Monthly Visitor Velocity Bar/Line
  const monthlyChartData = {
    labels: monthlyTrends.map(t => t.month),
    datasets: [
      {
        type: 'bar',
        label: 'Indian Guests',
        data: monthlyTrends.map(t => t.indian),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 4
      },
      {
        type: 'bar',
        label: 'Foreign Visitors',
        data: monthlyTrends.map(t => t.foreign),
        backgroundColor: 'rgba(6, 182, 212, 0.7)',
        borderRadius: 4
      }
    ]
  };

  // Chart 2: State Share Doughnut
  const stateChartData = {
    labels: stateWise.slice(0, 5).map(s => s.state),
    datasets: [
      {
        data: stateWise.slice(0, 5).map(s => s.visitors),
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'],
        borderWidth: 0
      }
    ]
  };

  // Chart 3: International Source Markets
  const countryChartData = {
    labels: countryWise.slice(0, 6).map(c => c.country),
    datasets: [
      {
        label: 'Arrivals',
        data: countryWise.slice(0, 6).map(c => c.visitors),
        backgroundColor: 'rgba(16, 185, 129, 0.75)',
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#cbd5e1', font: { family: 'inherit' } }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#1e293b' }
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#1e293b' }
      }
    }
  };

  return (
    <div style={{ color: '#fff' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,130,246,0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={22} />
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Tourism Intelligence & Macro Analytics</h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: 4 }}>
            State-wide tourist inflows, destination carrying capacity & economic indicators
          </p>
        </div>

        <a 
          href={reportService.getExportUrl(filters)} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          <Download size={16} />
          <span>Export Official CSV Report</span>
        </a>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard 
          title="Annual Visitors Total"
          value="218,000+"
          subtitle="Estimated synthetic annual footfall"
          icon={Users}
          color="#3b82f6"
        />
        <StatCard 
          title="Foreign Arrivals"
          value={overview?.visitors?.foreign_visitors ? `${overview.visitors.foreign_visitors}+` : '34,200'}
          subtitle="International tourists"
          icon={Globe}
          color="#10b981"
        />
        <StatCard 
          title="Average Occupancy"
          value={`${overview?.occupancy?.occupancy_rate || 73.8}%`}
          subtitle="State-wide bed capacity"
          icon={Building2}
          color="#f59e0b"
        />
        <StatCard 
          title="Active Accommodations"
          value={overview?.properties?.total || 21}
          subtitle="Verified operational properties"
          icon={MapPin}
          color="#06b6d4"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
        
        {/* Monthly Velocity Bar Chart */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Monthly Tourist Velocity (12-Month Curve)</h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Indian Citizens vs International Visitors</p>
            </div>
            <span className="badge badge-info">Peak: Sep 2026</span>
          </div>

          <div style={{ height: 280 }}>
            <Bar data={monthlyChartData} options={chartOptions} />
          </div>
        </div>

        {/* State Share Doughnut */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 4 }}>Top Destination States</h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 16 }}>Regional visitor share %</p>

          <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut data={stateChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } } }} />
          </div>
        </div>

      </div>

      {/* Secondary Chart: Foreign Country Origins & Destination Capacity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 36 }}>
        
        {/* International Origins */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 4 }}>International Source Markets</h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 20 }}>Top originating countries by arrivals</p>

          <div style={{ height: 240 }}>
            <Bar data={countryChartData} options={chartOptions} />
          </div>
        </div>

        {/* Destination Footfall List */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 4 }}>Key Destination Capacity</h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 20 }}>Annual estimated capacity thresholds</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {destinations.slice(0, 5).map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#0f172a', borderRadius: 8, border: '1px solid #1e293b' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{d.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{d.district_name}, {d.state_name} • {d.category}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8' }}>{d.annual_visitors_estimate?.toLocaleString()}</span>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>capacity/yr</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Filterable Stay Report Module */}
      <div className="glass-panel" style={{ padding: 24, marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Filter size={18} color="#38bdf8" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Custom Filterable Intelligence Reports</h2>
        </div>

        <form onSubmit={handleFilterSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Report Category</label>
            <select value={filters.report_type} onChange={e => setFilters({...filters, report_type: e.target.value})}>
              <option value="">All Records</option>
              <option value="foreign_only">Foreign Visitors Only</option>
              <option value="indian_only">Indian Citizens Only</option>
              <option value="active_stays">Active Checked-In Stays</option>
              <option value="completed_stays">Completed Stays</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>State</label>
            <select value={filters.state_id} onChange={e => setFilters({...filters, state_id: e.target.value})}>
              <option value="">All States</option>
              {master.states?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Date From</label>
            <input type="date" value={filters.date_from} onChange={e => setFilters({...filters, date_from: e.target.value})} />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Date To</label>
            <input type="date" value={filters.date_to} onChange={e => setFilters({...filters, date_to: e.target.value})} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: 42 }}>
            <Filter size={16} />
            <span>{loadingReport ? 'Filtering...' : 'Apply Filters'}</span>
          </button>
        </form>

        {/* Report Records Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Stay Code</th>
                <th>Guest</th>
                <th>Category</th>
                <th>Property</th>
                <th>State & District</th>
                <th>Check-In</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.records?.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
                    No report records matching criteria.
                  </td>
                </tr>
              ) : (
                reportData.records?.map(r => (
                  <tr key={r.stay_id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#38bdf8' }}>{r.stay_code}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.guest_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{r.nationality}</div>
                    </td>
                    <td>
                      <span className={`badge ${r.guest_type === 'Foreign Visitor' ? 'badge-warning' : 'badge-info'}`}>
                        {r.guest_type}
                      </span>
                    </td>
                    <td>{r.property_name}</td>
                    <td>{r.district_name}, {r.state_name}</td>
                    <td>{r.checkin_time?.substring(0, 10)}</td>
                    <td><AlertBadge status={r.stay_status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
