
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import HybridCloud from "./pages/HybridCloud";
import IdentityTrust from "./pages/IdentityTrust";
import DeviceTrust from "./pages/DeviceTrust";
import NetworkSecurity from "./pages/NetworkSecurity";
import PolicyEngine from "./pages/PolicyEngine";
import ThreatMonitor from "./pages/ThreatMonitor";
import TrustEngine from "./pages/TrustEngine";
import AuditLogs from "./pages/AuditLogs";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout with Sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/hybrid-cloud" element={<HybridCloud />} />
          <Route path="/identity-trust" element={<IdentityTrust />} />
          <Route path="/device-trust" element={<DeviceTrust />} />
          <Route path="/network-security" element={<NetworkSecurity />} />
          <Route path="/policy-engine" element={<PolicyEngine />} />
          <Route path="/threat-monitor" element={<ThreatMonitor />} />
          <Route path="/trust-engine" element={<TrustEngine />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
        </Route>

        {/* Optional: 404 fallback */}
        {/* <Route path="*" element={<div style={{ padding: 20 }}>Page Not Found</div>} /> */}
      </Routes>
    </BrowserRouter>
  );
}