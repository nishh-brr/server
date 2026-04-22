import React, { useMemo, useState, useEffect } from 'react';
import { api } from '../utils/api';
import './Dashboard.css';

export default function AuditLogs() {
  const [search, setSearch] = useState('');
  const [range,  setRange]  = useState('Last 24h');
  const [logs,   setLogs]   = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/events/login-events'),
      api.get('/events/login-summary'),
    ]).then(([events, sum]) => {
      setLogs(events);
      setSummary(sum);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter(l =>
      (l.email      || '').toLowerCase().includes(q) ||
      (l.ip         || '').toLowerCase().includes(q) ||
      (l.reason     || '').toLowerCase().includes(q) ||
      (l.source     || '').toLowerCase().includes(q) ||
      (l.deviceType || '').toLowerCase().includes(q)
    );
  }, [search, logs]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Audit Logs</h1>
      <div className="page-subtitle">
        Real login events stored in MongoDB — identity, device, IP, source &amp; outcome
      </div>

      <div className="filters-row">
        <div className="filters-left">
          <input
            className="input"
            placeholder="Search by email / IP / source / reason…"
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
          <button className="button" onClick={() => alert(`Export audit logs: ${range} (demo).`)}>
            Export Logs
          </button>
        </div>
      </div>

      <div className="card-container">
        <div className="card"><h3>Total Logins</h3>
          <div className="kpi-value">{loading ? '…' : summary?.total ?? 0}</div>
        </div>
        <div className="card"><h3>Failed Logins</h3>
          <div className="kpi-value" style={{ color: '#ff5252' }}>{loading ? '…' : summary?.failed ?? 0}</div>
        </div>
        <div className="card"><h3>Today</h3>
          <div className="kpi-value">{loading ? '…' : summary?.todayCount ?? 0}</div>
        </div>
        <div className="card"><h3>Device Types</h3>
          <div className="kpi-value">{loading ? '…' : summary?.devices?.length ?? 0}</div>
          <div className="kpi-sub">unique categories</div>
        </div>
      </div>

      <div className="card">
        <h3>Login Audit Trail ({loading ? 'loading…' : `${filtered.length} records`})</h3>

        {!loading && logs.length === 0 ? (
          <div className="muted" style={{ padding: '20px 0', textAlign: 'center' }}>
            No login events recorded yet. Events appear here after your first login.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Email</th>
                <th>IP</th>
                <th>Source</th>
                <th>Device</th>
                <th>Browser</th>
                <th>Reason</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 11 }}>
                    {l.timestamp ? new Date(l.timestamp).toLocaleString() : '—'}
                  </td>
                  <td>{l.email || '—'}</td>
                  <td style={{ fontSize: 11 }}>{l.ip || '—'}</td>
                  <td>
                    <span className={l.source === 'cloud' ? 'badge yellow' : 'badge green'}>
                      {l.source || 'on-prem'}
                    </span>
                  </td>
                  <td style={{ fontSize: 11 }}>{l.deviceType || '—'}</td>
                  <td style={{ fontSize: 11 }}>{l.browser || '—'}</td>
                  <td style={{ fontSize: 11 }}>{l.reason || '—'}</td>
                  <td>
                    <span className={l.success ? 'badge green' : 'badge red'}>
                      {l.success ? 'Success' : 'Failed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
