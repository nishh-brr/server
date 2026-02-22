import React from "react";

function AuditLogs() {
  return (
    <div>
      <h1>Audit Logs</h1>
      <div className="card-container">
        <div className="card"><h3>Total Logs</h3><p>1245</p></div>
        <div className="card"><h3>Login Attempts</h3><p>340</p></div>
        <div className="card"><h3>Access Denied</h3><p>18</p></div>
        <div className="card"><h3>Admin Changes</h3><p>3</p></div>
      </div>
    </div>
  );
}

export default AuditLogs;
