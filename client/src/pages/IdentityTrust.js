import React, { useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import "./Dashboard.css";

const authTrends = [
  { name: "Mon", failed: 6 },
  { name: "Tue", failed: 9 },
  { name: "Wed", failed: 12 },
  { name: "Thu", failed: 8 },
  { name: "Fri", failed: 5 }
];

const loginEventsSeed = [
  { user: "admin@corp", action: "MFA Challenge", result: "Success", severity: "Medium" },
  { user: "ops@corp", action: "Login", result: "Failed", severity: "High" },
  { user: "dev@corp", action: "Password Reset", result: "Success", severity: "Low" },
  { user: "guest@corp", action: "Login", result: "Denied", severity: "High" }
];

function badgeClass(sev) {
  if (sev === "High") return "badge red";
  if (sev === "Medium") return "badge yellow";
  return "badge green";
}

function IdentityTrust() {
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("Last 7d");

  const events = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return loginEventsSeed;
    return loginEventsSeed.filter(
      (e) =>
        e.user.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q) ||
        e.result.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Identity Trust</h1>
      <div className="page-subtitle">User risk, MFA posture, privileged access & suspicious login visibility</div>

      <div className="filters-row">
        <div className="filters-left">
          <input
            className="input"
            placeholder="Search users/events..."
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
          <button className="button" onClick={() => alert("Trigger MFA audit (demo).")}>
            Run MFA Audit
          </button>
        </div>
      </div>

      <div className="card-container">
        <div className="card"><h3>Total Users</h3><div className="kpi-value">320</div><div className="kpi-sub">Directory synced</div></div>
        <div className="card"><h3>MFA Enabled</h3><div className="kpi-value">280</div><div className="kpi-sub">87.5% coverage</div></div>
        <div className="card"><h3>Privileged Accounts</h3><div className="kpi-value">25</div><div className="kpi-sub">Needs tighter controls</div></div>
        <div className="card"><h3>Failed Logins</h3><div className="kpi-value">12</div><div className="kpi-sub">Trend shown below</div></div>
      </div>

      <div className="split-grid">
        <div className="card">
          <h3>Failed Login Trend ({range})</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={authTrends}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="failed" fill="#ff5252" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Suspicious / Important Auth Events</h3>
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Result</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e, idx) => (
                <tr key={idx}>
                  <td>{e.user}</td>
                  <td>{e.action}</td>
                  <td>{e.result}</td>
                  <td><span className={badgeClass(e.severity)}>{e.severity}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default IdentityTrust;