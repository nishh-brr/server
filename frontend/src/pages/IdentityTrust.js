import React from "react";

function IdentityTrust() {
  return (
    <div>
      <h1>Identity Trust</h1>
      <div className="card-container">
        <div className="card"><h3>Total Users</h3><p>320</p></div>
        <div className="card"><h3>MFA Enabled</h3><p>280</p></div>
        <div className="card"><h3>Privileged Accounts</h3><p>25</p></div>
        <div className="card"><h3>Failed Logins</h3><p>12</p></div>
      </div>
    </div>
  );
}

export default IdentityTrust;
