import React, { useMemo, useState, useEffect } from 'react';
import { api } from '../utils/api';
import './Dashboard.css';

function badgeClass(sev) {
  if (sev === 'high' || sev === 'High')   return 'badge red';
  if (sev === 'medium' || sev === 'Medium') return 'badge yellow';
  return 'badge green';
}

export default function ThreatMonitor() {
  const [search, setSearch]   = useState('');
  const [range,  setRange]    = useState('Last 24h');
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/events/threat-events'),
      api.get('/events/threat-summary'),
    ]).then(([events, sum]) => {
      setLiveAlerts(events);
      setSummary(sum);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return liveAlerts;
    return liveAlerts.filter(a =>
      (a.ip      || '').toLowerCase().includes(q) ||
      (a.reason  || '').toLowerCase().includes(q) ||
      (a.email   || '').toLowerCase().includes(q) ||
      (a.threatLevel || '').toLowerCase().includes(q)
    );
  }, [search, liveAlerts]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Threat Monitor</h1>
      <div className="page-subtitle">
        Live threat events, blocked IPs, incident queue &amp; response status
      </div>

      <div className="filters-row">
        <div className="filters-left">
          <input
            className="input"
            placeholder="Search by IP / reason / email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="select" value={range} onChange={e => setRange(e.target.value)}>
            <option>Last 1h</option>
            <option>Last 24h</option>
            <option>Last 7d</option>
          </select>
        </div>
        <div className="filters-right">
          <button className="button" onClick={() => alert('Forward to SIEM (demo).')}>
            Forward to SIEM
          </button>
        </div>
      </div>

      <div className="card-container">
        <div className="card"><h3>Total Threats</h3>
          <div className="kpi-value">{loading ? '…' : summary?.total ?? 0}</div>
        </div>
        <div className="card"><h3>Blocked</h3>
          <div className="kpi-value" style={{ color: '#ff5252' }}>{loading ? '…' : summary?.blocked ?? 0}</div>
        </div>
        <div className="card"><h3>High Severity</h3>
          <div className="kpi-value" style={{ color: '#ff5252' }}>{loading ? '…' : summary?.high ?? 0}</div>
        </div>
        <div className="card"><h3>Today</h3>
          <div className="kpi-value">{loading ? '…' : summary?.todayCount ?? 0}</div>
        </div>
      </div>

      <div className="card">
        <h3>
          Threat Events ({loading ? 'loading…' : `${filtered.length} records`})
        </h3>

        {!loading && liveAlerts.length === 0 ? (
          <div className="muted" style={{ padding: '20px 0', textAlign: 'center' }}>
            ✅ No threat events recorded yet. Events appear here after blocked login attempts.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>IP</th>
                <th>Email</th>
                <th>Reason</th>
                <th>Level</th>
                <th>Blocked</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 12 }}>
                    {a.timestamp ? new Date(a.timestamp).toLocaleString() : '—'}
                  </td>
                  <td style={{ fontSize: 12 }}>{a.ip || '—'}</td>
                  <td>{a.email || '—'}</td>
                  <td>{a.reason || '—'}</td>
                  <td><span className={badgeClass(a.threatLevel)}>{a.threatLevel || '—'}</span></td>
                  <td><span className={a.blocked ? 'badge red' : 'badge green'}>{a.blocked ? 'Yes' : 'No'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
