import React, { useMemo, useState } from "react";
import "./Dashboard.css";

const policiesSeed = [
  { name: "Block unmanaged devices", status: "Active", violations: 2, action: "Auto-Remediate" },
  { name: "Require MFA for admins", status: "Active", violations: 1, action: "Challenge" },
  { name: "Deny risky geo access", status: "Active", violations: 1, action: "Block" },
  { name: "Allow service-to-service (signed)", status: "Draft", violations: 0, action: "N/A" }
];

function statusBadge(status) {
  if (status === "Active") return "badge green";
  if (status === "Draft") return "badge yellow";
  return "badge red";
}

function PolicyEngine() {
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("Last 30d");

  const policies = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return policiesSeed;
    return policiesSeed.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q) ||
        p.action.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Policy Engine</h1>
      <div className="page-subtitle">Policy lifecycle, enforcement outcomes, violations & remediation actions</div>

      <div className="filters-row">
        <div className="filters-left">
          <input
            className="input"
            placeholder="Search policies..."
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
          <button className="button" onClick={() => alert("Open policy builder (demo).")}>
            New Policy
          </button>
        </div>
      </div>

      <div className="card-container">
        <div className="card"><h3>Total Policies</h3><div className="kpi-value">56</div><div className="kpi-sub">Configured rules</div></div>
        <div className="card"><h3>Active Policies</h3><div className="kpi-value">50</div><div className="kpi-sub">Enforced</div></div>
        <div className="card"><h3>Violations</h3><div className="kpi-value">4</div><div className="kpi-sub">In {range}</div></div>
        <div className="card"><h3>Auto Remediation</h3><div className="kpi-value">2</div><div className="kpi-sub">Actions executed</div></div>
      </div>

      <div className="card">
        <h3>Policy List (sample)</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Policy</th>
              <th>Status</th>
              <th>Violations</th>
              <th>Default Action</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p, idx) => (
              <tr key={idx}>
                <td>{p.name}</td>
                <td><span className={statusBadge(p.status)}>{p.status}</span></td>
                <td>{p.violations}</td>
                <td>{p.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PolicyEngine;