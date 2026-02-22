import React from "react";

function NetworkSecurity() {
  return (
    <div>
      <h1>Network Security</h1>
      <div className="card-container">
        <div className="card"><h3>Blocked IPs</h3><p>45</p></div>
        <div className="card"><h3>Active Connections</h3><p>128</p></div>
        <div className="card"><h3>Suspicious Events</h3><p>5</p></div>
        <div className="card"><h3>Firewall Status</h3><p>Active</p></div>
      </div>
    </div>
  );
}

export default NetworkSecurity;
