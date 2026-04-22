import React, { useMemo, useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { api } from '../utils/api';
import './Dashboard.css';

const findingsSeed = [
  { area: 'S3 bucket policy',   env: 'Cloud',   severity: 'High',   status: 'Open' },
  { area: 'Security group',     env: 'Cloud',   severity: 'Medium', status: 'Open' },
  { area: 'Old TLS config',     env: 'On-Prem', severity: 'Medium', status: 'Investigating' },
  { area: 'Privileged SSH key', env: 'On-Prem', severity: 'High',   status: 'Open' },
];

function badgeClass(sev) {
  if (sev === 'High')   return 'badge red';
  if (sev === 'Medium') return 'badge yellow';
  return 'badge green';
}

export default function HybridCloud() {
  const [search, setSearch] = useState('');
  const [range,  setRange]  = useState('Last 30d');
  const [summary, setSummary] = useState(null);
  const [events,  setEvents]  = useState({ onPrem: [], cloud: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/events/hybrid-summary'),
      api.get('/events/hybrid-events'),
    ]).then(([sum, evts]) => {
      setSummary(sum);
      setEvents(evts);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const workloadData = summary
    ? [
        { name: 'Cloud',   value: summary.cloud.total  || 0 },
        { name: 'On-Prem', value: summary.onPrem.total || 0 },
      ]
    : [{ name: 'Cloud', value: 0 }, { name: 'On-Prem', value: 0 }];

  // Combine + display recent events from both sources
  const allEvents = [
    ...events.onPrem.slice(0, 10).map(e => ({ ...e, source: 'On-Prem' })),
    ...events.cloud.slice(0, 10).map(e => ({ ...e, source: 'Cloud' })),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 15);

  const findings = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return findingsSeed;
    return findingsSeed.filter(f =>
      f.area.toLowerCase().includes(q) ||
      f.env.toLowerCase().includes(q) ||
      f.status.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Hybrid Cloud Security</h1>
      <div className="page-subtitle">
        Unified cloud + on-prem inventory, posture checks and real-time event split
      </div>

      <div className="filters-row">
        <div className="filters-left">
          <input
            className="input"
            placeholder="Search findings…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="select" value={range} onChange={e => setRange(e.target.value)}>
            <option>Last 7d</option>
            <option>Last 30d</option>
            <option>Last 90d</option>
          </select>
        </div>
        <div className="filters-right">
          <button className="button" onClick={() => alert('Run posture scan (demo).')}>
            Run Posture Scan
          </button>
        </div>
      </div>

      {/* Live KPI cards */}
      <div className="card-container">
        <div className="card"><h3>Cloud Events</h3>
          <div className="kpi-value">{loading ? '…' : summary?.cloud.total ?? 0}</div>
          <div className="kpi-sub">{summary?.cloud.failed ?? 0} failed</div>
        </div>
        <div className="card"><h3>On-Prem Events</h3>
          <div className="kpi-value">{loading ? '…' : summary?.onPrem.total ?? 0}</div>
          <div className="kpi-sub">{summary?.onPrem.failed ?? 0} failed</div>
        </div>
        <div className="card"><h3>Misconfigurations</h3><div className="kpi-value">3</div></div>
        <div className="card"><h3>Access Violations</h3><div className="kpi-value">2</div></div>
      </div>

      <div className="split-grid">
        <div className="card">
          <h3>Event Distribution ({range})</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={workloadData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#00e6e6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Posture Findings</h3>
          <table className="table">
            <thead>
              <tr><th>Area</th><th>Env</th><th>Severity</th><th>Status</th></tr>
            </thead>
            <tbody>
              {findings.map((f, i) => (
                <tr key={i}>
                  <td>{f.area}</td>
                  <td>{f.env}</td>
                  <td><span className={badgeClass(f.severity)}>{f.severity}</span></td>
                  <td>{f.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live events table */}
      {allEvents.length > 0 && (
        <div className="card" style={{ marginTop: 18 }}>
          <h3>Recent Hybrid Events (live from MongoDB / Firebase)</h3>
          <table className="table">
            <thead>
              <tr><th>Time</th><th>Email</th><th>Source</th><th>IP</th><th>Device</th><th>Success</th></tr>
            </thead>
            <tbody>
              {allEvents.map((e, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 12 }}>{e.timestamp ? new Date(e.timestamp).toLocaleTimeString() : '—'}</td>
                  <td>{e.email || '—'}</td>
                  <td><span className={e.source === 'Cloud' ? 'badge yellow' : 'badge green'}>{e.source}</span></td>
                  <td style={{ fontSize: 12 }}>{e.ip || '—'}</td>
                  <td style={{ fontSize: 12 }}>{e.deviceType || '—'}</td>
                  <td><span className={e.success ? 'badge green' : 'badge red'}>{e.success ? 'Yes' : 'No'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
