import React, { useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import "./Dashboard.css";

const workloadData = [
  { name: "Cloud", value: 75 },
  { name: "On-Prem", value: 40 }
];

const findingsSeed = [
  { area: "S3 bucket policy", env: "Cloud", severity: "High", status: "Open" },
  { area: "Security group", env: "Cloud", severity: "Medium", status: "Open" },
  { area: "Old TLS config", env: "On-Prem", severity: "Medium", status: "Investigating" },
  { area: "Privileged SSH key", env: "On-Prem", severity: "High", status: "Open" }
];

function badgeClass(sev) {
  if (sev === "High") return "badge red";
  if (sev === "Medium") return "badge yellow";
  return "badge green";
}

function HybridCloud() {
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("Last 30d");

  const findings = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return findingsSeed;
    return findingsSeed.filter(
      (f) =>
        f.area.toLowerCase().includes(q) ||
        f.env.toLowerCase().includes(q) ||
        f.status.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Hybrid Cloud Security</h1>
      <div className="page-subtitle">Unified cloud + on-prem inventory, posture checks and misconfiguration insights</div>

      <div className="filters-row">
        <div className="filters-left">
          <input
            className="input"
            placeholder="Search findings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="select" value={range} onChange={(e) => setRange(e.target.value)}>
            <option>Last 7d</option>
            <option>Last 30d</option>
            <option>Last 90d</option>
          </select>
        </div>
        <div className="filters-right">
          <button className="button" onClick={() => alert("Run posture scan (demo).")}>
            Run Posture Scan
          </button>
        </div>
      </div>

      <div className="card-container">
        <div className="card"><h3>Cloud Workloads</h3><div className="kpi-value">75</div></div>
        <div className="card"><h3>On-Prem Servers</h3><div className="kpi-value">40</div></div>
        <div className="card"><h3>Misconfigurations</h3><div className="kpi-value">3</div></div>
        <div className="card"><h3>Access Violations</h3><div className="kpi-value">2</div></div>
      </div>

      <div className="split-grid">
        <div className="card">
          <h3>Inventory Breakdown ({range})</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={workloadData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#00e6e6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Posture Findings (sample)</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Area</th>
                <th>Env</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {findings.map((f, idx) => (
                <tr key={idx}>
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
    </div>
  );
}

export default HybridCloud;