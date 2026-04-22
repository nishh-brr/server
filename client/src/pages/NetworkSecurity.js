import React, { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import "./Dashboard.css";

const eventsTrend = [
  { t: "10:00", value: 2 },
  { t: "10:05", value: 3 },
  { t: "10:10", value: 5 },
  { t: "10:15", value: 4 },
  { t: "10:20", value: 6 }
];

const blockedSeed = [
  { ip: "185.11.22.90", reason: "Brute force", hits: 43, severity: "High" },
  { ip: "92.44.10.12", reason: "Port scan", hits: 17, severity: "Medium" },
  { ip: "10.10.5.22", reason: "Policy deny", hits: 5, severity: "Low" }
];

function badgeClass(sev) {
  if (sev === "High") return "badge red";
  if (sev === "Medium") return "badge yellow";
  return "badge green";
}

function NetworkSecurity() {
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("Last 24h");

  const blocked = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return blockedSeed;
    return blockedSeed.filter(
      (b) =>
        b.ip.toLowerCase().includes(q) ||
        b.reason.toLowerCase().includes(q) ||
        String(b.hits).includes(q)
    );
  }, [search]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Network Security</h1>
      <div className="page-subtitle">Blocked sources, live connections, suspicious events & firewall posture</div>

      <div className="filters-row">
        <div className="filters-left">
          <input
            className="input"
            placeholder="Search IP / reason..."
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
          <button className="button" onClick={() => alert("Rotate firewall ruleset (demo).")}>
            Apply Ruleset
          </button>
        </div>
      </div>

      <div className="card-container">
        <div className="card"><h3>Blocked IPs</h3><div className="kpi-value">45</div><div className="kpi-sub">Auto-block + manual</div></div>
        <div className="card"><h3>Active Connections</h3><div className="kpi-value">128</div><div className="kpi-sub">Current sessions</div></div>
        <div className="card"><h3>Suspicious Events</h3><div className="kpi-value">5</div><div className="kpi-sub">Needs review</div></div>
        <div className="card"><h3>Firewall Status</h3><span className="badge green">Active</span><div className="kpi-sub">Rules enforced</div></div>
      </div>

      <div className="split-grid">
        <div className="card">
          <h3>Suspicious Event Trend ({range})</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={eventsTrend}>
              <XAxis dataKey="t" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#00e6e6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Blocked Sources (sample)</h3>
          <table className="table">
            <thead>
              <tr>
                <th>IP</th>
                <th>Reason</th>
                <th>Hits</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {blocked.map((b, idx) => (
                <tr key={idx}>
                  <td>{b.ip}</td>
                  <td>{b.reason}</td>
                  <td>{b.hits}</td>
                  <td><span className={badgeClass(b.severity)}>{b.severity}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default NetworkSecurity;