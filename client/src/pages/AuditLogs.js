import React, { useMemo, useState } from "react";
import "./Dashboard.css";

const logsSeed = [
  { time: "10:22", actor: "admin@corp", action: "Policy updated", target: "MFA for admins", status: "Success" },
  { time: "10:18", actor: "ops@corp", action: "Login attempt", target: "VPN gateway", status: "Failed" },
  { time: "10:12", actor: "dev@corp", action: "Access request", target: "K8s cluster", status: "Denied" },
  { time: "09:55", actor: "sec@corp", action: "Export report", target: "Compliance", status: "Success" }
];

function AuditLogs() {
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("Last 24h");

  const logs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return logsSeed;
    return logsSeed.filter(
      (l) =>
        l.actor.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.target.toLowerCase().includes(q) ||
        l.status.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Audit Logs</h1>
      <div className="page-subtitle">Track admin changes, access decisions, authentication and exports</div>

      <div className="filters-row">
        <div className="filters-left">
          <input
            className="input"
            placeholder="Search audit logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="select" value={range} onChange={(e) => setRange(e.target.value)}>
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
        <div className="card"><h3>Total Logs</h3><div className="kpi-value">1245</div></div>
        <div className="card"><h3>Login Attempts</h3><div className="kpi-value">340</div></div>
        <div className="card"><h3>Access Denied</h3><div className="kpi-value">18</div></div>
        <div className="card"><h3>Admin Changes</h3><div className="kpi-value">3</div></div>
      </div>

      <div className="card">
        <h3>Recent Audit Entries (filtered: {range})</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Target</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l, idx) => (
              <tr key={idx}>
                <td>{l.time}</td>
                <td>{l.actor}</td>
                <td>{l.action}</td>
                <td>{l.target}</td>
                <td>{l.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditLogs;