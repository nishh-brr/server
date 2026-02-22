import React from "react";

function PolicyEngine() {
  return (
    <div>
      <h1>Policy Engine</h1>
      <div className="card-container">
        <div className="card"><h3>Total Policies</h3><p>56</p></div>
        <div className="card"><h3>Active Policies</h3><p>50</p></div>
        <div className="card"><h3>Violations</h3><p>4</p></div>
        <div className="card"><h3>Auto Remediation</h3><p>2</p></div>
      </div>
    </div>
  );
}

export default PolicyEngine;
