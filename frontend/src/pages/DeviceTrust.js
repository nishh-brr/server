import React from "react";

function DeviceTrust() {
  return (
    <div>
      <h1>Device Trust</h1>
      <div className="card-container">
        <div className="card"><h3>Registered Devices</h3><p>210</p></div>
        <div className="card"><h3>Compliant Devices</h3><p>185</p></div>
        <div className="card"><h3>Outdated OS</h3><p>15</p></div>
        <div className="card"><h3>Blocked Devices</h3><p>6</p></div>
      </div>
    </div>
  );
}

export default DeviceTrust;
