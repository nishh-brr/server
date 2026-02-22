import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import IdentityTrust from "./pages/IdentityTrust";
import DeviceTrust from "./pages/DeviceTrust";
import NetworkSecurity from "./pages/NetworkSecurity";
import HybridCloud from "./pages/HybridCloud";
import PolicyEngine from "./pages/PolicyEngine";
import ThreatMonitor from "./pages/ThreatMonitor";
import TrustEngine from "./pages/TrustEngine";
import AuditLogs from "./pages/AuditLogs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="identity" element={<IdentityTrust />} />
          <Route path="device" element={<DeviceTrust />} />
          <Route path="network" element={<NetworkSecurity />} />
          <Route path="cloud" element={<HybridCloud />} />
          <Route path="policy" element={<PolicyEngine />} />
          <Route path="threat" element={<ThreatMonitor />} />
          <Route path="trust" element={<TrustEngine />} />
          <Route path="audit" element={<AuditLogs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
