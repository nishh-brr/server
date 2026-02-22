import React from "react";

function ThreatMonitor() {
  return (
    <div>
      <h1>Threat Monitor</h1>
      <div className="card-container">
        <div className="card"><h3>Critical Alerts</h3><p>2</p></div>
        <div className="card"><h3>Medium Alerts</h3><p>6</p></div>
        <div className="card"><h3>Low Alerts</h3><p>12</p></div>
        <div className="card"><h3>Resolved Incidents</h3><p>18</p></div>
      </div>
    </div>
  );
}

export default ThreatMonitor;
