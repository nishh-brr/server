import React, { useMemo, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import "./Dashboard.css";

const hybridData = [
  { name: "Cloud", value: 60 },
  { name: "On-Prem", value: 40 }
];

const riskData = [
  { name: "Cloud", value: 70 },
  { name: "On-Prem", value: 55 }
];

const exfilData = [
  { time: "10:00", value: 40 },
  { time: "10:05", value: 55 },
  { time: "10:10", value: 35 },
  { time: "10:15", value: 65 },
  { time: "10:20", value: 50 }
];

const sensitiveData = [
  { name: "Sensitive Data", value: 65 },
  { name: "Other Data", value: 35 }
];

const recentEventsSeed = [
  { time: "10:21", type: "Policy", message: "Blocked lateral movement attempt", severity: "High" },
  { time: "10:18", type: "IAM", message: "MFA challenged: privileged user", severity: "Medium" },
  { time: "10:12", type: "Device", message: "Non-compliant OS detected", severity: "Medium" },
  { time: "10:05", type: "Network", message: "Suspicious DNS query pattern", severity: "Low" },
  { time: "09:58", type: "Audit", message: "Admin policy updated", severity: "Low" }
];

const COLORS = ["#00e6e6", "#8884d8"];

function badgeClass(sev) {
  if (sev === "High") return "badge red";
  if (sev === "Medium") return "badge yellow";
  return "badge green";
}

function Dashboard() {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      window.history.replaceState({}, "", "/");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "http://localhost:4000";
    }
  }, []);

  const [search, setSearch] = useState("");
  const [range, setRange] = useState("Last 24h");

  const recentEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return recentEventsSeed;
    return recentEventsSeed.filter(
      (e) =>
        e.type.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q) ||
        e.severity.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">ZERO TRUST ARCHITECTURE - HYBRID CLOUD DASHBOARD</h1>
      <div className="page-subtitle">
        Unified posture, identity, device, network, policy & audit visibility
      </div>

      <div className="filters-row">
        <div className="filters-left">
          <input
            className="input"
            placeholder="Search events (policy / iam / device...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="select" value={range} onChange={(e) => setRange(e.target.value)}>
            <option>Last 1h</option>
            <option>Last 24h</option>
            <option>Last 7d</option>
            <option>Last 30d</option>
          </select>
        </div>

        <div className="filters-right">
          <button
            className="button"
            onClick={() => {
              alert(`Export requested for ${range}. (Hook this to backend later)`);
            }}
          >
            Export Summary
          </button>
        </div>
      </div>

      {/* TOP SECTION */}
      <div className="top-grid">
        <div className="card">
          <h3>Hybrid Access Requests</h3>
          <div className="muted">Traffic split across environments</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hybridData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#00bcd4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card center-card">
          <h3>Global Zero Trust Score</h3>
          <div className="big-score">78 / 100</div>
          <div className="kpi-sub">Based on identity + device + policy compliance</div>
        </div>

        <div className="card center-card">
          <h3>Policy Enforcement</h3>
          <div className="circle green">99.9%</div>
          <div className="kpi-sub">Blocks / allows evaluated per request</div>
        </div>

        <div className="card center-card">
          <h3>Active Threat Index</h3>
          <div className="circle red">ELEVATED</div>
          <div className="kpi-sub">Requires monitoring & response</div>
        </div>
      </div>

      {/* 5 PILLARS */}
      <h2 className="pillar-title">5 Pillars of Zero Trust</h2>
      <div className="pillar-grid">
        <div className="card">
          <h3>IDENTITY (Who)</h3>
          <ul className="log-list">
            <li>Real-time Authentication ✔</li>
            <li>MFA Verified ✔</li>
            <li>Least Privilege Enforced ✔</li>
          </ul>
        </div>

        <div className="card">
          <h3>DEVICE (What)</h3>
          <div className="heatmap">
            <div></div><div></div><div></div>
            <div></div><div></div><div></div>
          </div>
          <div className="muted" style={{ marginTop: 10 }}>
            Heatmap: compliance checks by device category
          </div>
        </div>

        <div className="card">
          <h3>NETWORK (Where)</h3>
          <p className="muted">East-West Traffic Visualizer</p>
          <div className="network-visual"></div>
        </div>

        <div className="card">
          <h3>APPLICATION</h3>
          <div className="muted">Risk by environment</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={riskData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#ffc107" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>DATA (Security)</h3>
          <div className="muted">Exfiltration attempts trend</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={exfilData}>
              <XAxis dataKey="time" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#ff5252" />
            </LineChart>
          </ResponsiveContainer>

          <div className="muted" style={{ marginTop: 12 }}>Sensitive data ratio</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={sensitiveData} dataKey="value" outerRadius={70}>
                {sensitiveData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT EVENTS + SOAR */}
      <div className="split-grid">
        <div className="card">
          <h3>Recent Security Events (filtered: {range})</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Message</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((e, idx) => (
                <tr key={idx}>
                  <td>{e.time}</td>
                  <td>{e.type}</td>
                  <td>{e.message}</td>
                  <td><span className={badgeClass(e.severity)}>{e.severity}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>SOAR & Incident Response</h3>
          <div className="muted">Auto-actions executed based on detections</div>

          <div style={{ marginTop: 12 }}>
            <div className="kpi-value">176</div>
            <div className="kpi-sub">SOAR Actions Taken</div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div className="muted">Active Incidents</div>
            <ul className="log-list">
              <li>Hybrid Connector: auth spike</li>
              <li>Hybrid NS: suspicious DNS</li>
              <li>Policy Engine: repeated deny events</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;