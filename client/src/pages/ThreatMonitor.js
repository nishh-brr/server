import React, { useMemo, useState } from "react";
import "./Dashboard.css";

const alertsSeed = [
  { id: "ALT-901", type: "Ransomware IOC", severity: "High", status: "Open" },
  { id: "ALT-774", type: "Credential stuffing", severity: "High", status: "Investigating" },
  { id: "ALT-612", type: "Suspicious DNS", severity: "Medium", status: "Open" },
  { id: "ALT-510", type: "Rare geo login", severity: "Low", status: "Open" }
];

function badgeClass(sev) {
  if (sev === "High") return "badge red";
  if (sev === "Medium") return "badge yellow";
  return "badge green";
}

function ThreatMonitor() {
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("Last 24h");
  const [alerts, setAlerts] = useState(alertsSeed);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return alerts;
    return alerts.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.severity.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q)
    );
  }, [search, alerts]);

  const resolve = (id) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: "Resolved" } : a)));
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Threat Monitor</h1>
      <div className="page-subtitle">Alert triage, incident queue & response status</div>

      <div className="filters-row">
        <div className="filters-left">
          <input
            className="input"
            placeholder="Search alerts..."
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
          <button className="button" onClick={() => alert("Send to SIEM (demo).")}>
            Forward to SIEM
          </button>
        </div>
      </div>

      <div className="card-container">
        <div className="card"><h3>Critical Alerts</h3><div className="kpi-value">2</div></div>
        <div className="card"><h3>Medium Alerts</h3><div className="kpi-value">6</div></div>
        <div className="card"><h3>Low Alerts</h3><div className="kpi-value">12</div></div>
        <div className="card"><h3>Resolved Incidents</h3><div className="kpi-value">18</div></div>
      </div>

      <div className="card">
        <h3>Alert Queue (filtered: {range})</h3>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.type}</td>
                <td><span className={badgeClass(a.severity)}>{a.severity}</span></td>
                <td>{a.status}</td>
                <td>
                  <button className="button" onClick={() => resolve(a.id)} disabled={a.status === "Resolved"}>
                    Resolve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="muted" style={{ marginTop: 10 }}>
          “Resolve” is demo-only — connect to backend later.
        </div>
      </div>
    </div>
  );
}

export default ThreatMonitor;