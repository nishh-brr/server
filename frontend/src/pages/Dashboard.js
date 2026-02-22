import React from "react";
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

const COLORS = ["#00e6e6", "#8884d8"];

function Dashboard() {
  return (
    <div className="dashboard-container">

      <h1 className="dashboard-title">
        ZERO TRUST ARCHITECTURE - HYBRID CLOUD DASHBOARD
      </h1>

      {/* TOP SECTION */}
      <div className="top-grid">

        <div className="card">
          <h3>Hybrid Access Requests</h3>
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
        </div>

        <div className="card center-card">
          <h3>Policy Enforcement</h3>
          <div className="circle green">99.9%</div>
        </div>

        <div className="card center-card">
          <h3>Active Threat Index</h3>
          <div className="circle red">ELEVATED</div>
        </div>

      </div>

      {/* 5 PILLARS */}
      <h2 className="pillar-title">5 Pillars of Zero Trust</h2>

      <div className="pillar-grid">

        {/* Identity */}
        <div className="card">
          <h3>IDENTITY (Who)</h3>
          <ul className="log-list">
            <li>Real-time Authentication ✔</li>
            <li>MFA Verified ✔</li>
            <li>Least Privilege Enforced ✔</li>
          </ul>
        </div>

        {/* Device */}
        <div className="card">
          <h3>DEVICE (What)</h3>
          <div className="heatmap">
            <div></div><div></div><div></div>
            <div></div><div></div><div></div>
          </div>
        </div>

        {/* Network */}
        <div className="card">
          <h3>NETWORK (Where)</h3>
          <p>East-West Traffic Visualizer</p>
          <div className="network-visual"></div>
        </div>

        {/* Application */}
        <div className="card">
          <h3>APPLICATION</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={riskData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#ffc107" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Data */}
        <div className="card">
          <h3>DATA (Security)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={exfilData}>
              <XAxis dataKey="time" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#ff5252" />
            </LineChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={sensitiveData}
                dataKey="value"
                outerRadius={70}
              >
                {sensitiveData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* SOAR SECTION */}
      <h2 className="pillar-title">SOAR & Incident Response</h2>

      <div className="soar-grid">
        <div className="card">
          <h3>Active Incidents</h3>
          <p>Zero Trust Architecture - Hybrid INF</p>
          <p>Zero Trust Architecture - Hybrid Connector</p>
          <p>Zero Trust Architecture - Hybrid NS</p>
        </div>

        <div className="card">
          <h3>SOAR Actions Taken</h3>
          <div className="big-score">176</div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
