import React, { useMemo, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import "./Dashboard.css";

const deviceSplit = [
  { name: "Compliant", value: 185 },
  { name: "Non-Compliant", value: 25 }
];

const COLORS = ["#00e6e6", "#ff5252"];

const devicesSeed = [
  { id: "LAP-1142", owner: "dev@corp", os: "Windows 11", status: "Compliant", risk: "Low" },
  { id: "MOB-3321", owner: "ops@corp", os: "Android 12", status: "Non-Compliant", risk: "Medium" },
  { id: "LAP-2210", owner: "admin@corp", os: "Windows 10", status: "Non-Compliant", risk: "High" },
  { id: "MAC-7782", owner: "design@corp", os: "macOS", status: "Compliant", risk: "Low" }
];

function badgeClass(sev) {
  if (sev === "High") return "badge red";
  if (sev === "Medium") return "badge yellow";
  return "badge green";
}

function DeviceTrust() {
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("Last 30d");

  const devices = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return devicesSeed;
    return devicesSeed.filter(
      (d) =>
        d.id.toLowerCase().includes(q) ||
        d.owner.toLowerCase().includes(q) ||
        d.os.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Device Trust</h1>
      <div className="page-subtitle">Device inventory, compliance health, OS hygiene & risk scoring</div>

      <div className="filters-row">
        <div className="filters-left">
          <input
            className="input"
            placeholder="Search device / owner / OS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="select" value={range} onChange={(e) => setRange(e.target.value)}>
            <option>Last 24h</option>
            <option>Last 7d</option>
            <option>Last 30d</option>
          </select>
        </div>
        <div className="filters-right">
          <button className="button" onClick={() => alert("Push compliance re-check (demo).")}>
            Re-Check Compliance
          </button>
        </div>
      </div>

      <div className="card-container">
        <div className="card"><h3>Registered Devices</h3><div className="kpi-value">210</div><div className="kpi-sub">All enrolled endpoints</div></div>
        <div className="card"><h3>Compliant Devices</h3><div className="kpi-value">185</div><div className="kpi-sub">Policy passes</div></div>
        <div className="card"><h3>Outdated OS</h3><div className="kpi-value">15</div><div className="kpi-sub">Upgrade recommended</div></div>
        <div className="card"><h3>Blocked Devices</h3><div className="kpi-value">6</div><div className="kpi-sub">Quarantined</div></div>
      </div>

      <div className="split-grid">
        <div className="card">
          <h3>Compliance Split ({range})</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={deviceSplit} dataKey="value" outerRadius={90}>
                {deviceSplit.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="muted">Tip: connect this with real MDM/EDR data later.</div>
        </div>

        <div className="card">
          <h3>Device Inventory (sample)</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Device</th>
                <th>Owner</th>
                <th>OS</th>
                <th>Status</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d, idx) => (
                <tr key={idx}>
                  <td>{d.id}</td>
                  <td>{d.owner}</td>
                  <td>{d.os}</td>
                  <td>{d.status}</td>
                  <td><span className={badgeClass(d.risk)}>{d.risk}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DeviceTrust;