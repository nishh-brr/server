import React from "react";

function TrustEngine() {
  return (
    <div>
      <h1>Trust Engine</h1>
      <div className="card-container">
        <div className="card"><h3>High Trust</h3><p>250</p></div>
        <div className="card"><h3>Medium Trust</h3><p>50</p></div>
        <div className="card"><h3>Low Trust</h3><p>20</p></div>
        <div className="card"><h3>System Trust Score</h3><p>87%</p></div>
      </div>
    </div>
  );
}

export default TrustEngine;
