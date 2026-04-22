import React, { useMemo, useState } from "react";
import "./Dashboard.css";

const trustRulesSeed = [
  { factor: "MFA enabled", weight: "High", effect: "+15" },
  { factor: "Device compliant", weight: "High", effect: "+20" },
  { factor: "Risky geo login", weight: "Medium", effect: "-10" },
  { factor: "Policy violation", weight: "High", effect: "-20" }
];

function TrustEngine() {
  const [search, setSearch] = useState("");

  const rules = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return trustRulesSeed;
    return trustRulesSeed.filter(
      (r) =>
        r.factor.toLowerCase().includes(q) ||
        r.weight.toLowerCase().includes(q) ||
        r.effect.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Trust Engine</h1>
      <div className="page-subtitle">How trust is calculated across identity, device, network and policy signals</div>

      <div className="filters-row">
        <div className="filters-left">
          <input
            className="input"
            placeholder="Search trust factors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filters-right">
          <button className="button" onClick={() => alert("Recalculate trust score (demo).")}>
            Recalculate
          </button>
        </div>
      </div>

      <div className="card-container">
        <div className="card"><h3>High Trust</h3><div className="kpi-value">250</div></div>
        <div className="card"><h3>Medium Trust</h3><div className="kpi-value">50</div></div>
        <div className="card"><h3>Low Trust</h3><div className="kpi-value">20</div></div>
        <div className="card"><h3>System Trust Score</h3><div className="kpi-value">87%</div><div className="kpi-sub">Overall posture</div></div>
      </div>

      <div className="card">
        <h3>Trust Scoring Rules (sample)</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Factor</th>
              <th>Weight</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r, idx) => (
              <tr key={idx}>
                <td>{r.factor}</td>
                <td>{r.weight}</td>
                <td>{r.effect}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="muted" style={{ marginTop: 10 }}>
          Next step: hook these rules to live signals (IAM, EDR, Network, Policy).
        </div>
      </div>
    </div>
  );
}

export default TrustEngine;