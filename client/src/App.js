import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import MainLayout   from './layout/MainLayout';
import AuthGuard    from './components/AuthGuard';

// Auth pages
import Login    from './pages/Login';
import Register from './pages/Register';

// Dashboard pages
import Dashboard      from './pages/Dashboard';
import HybridCloud    from './pages/HybridCloud';
import IdentityTrust  from './pages/IdentityTrust';
import DeviceTrust    from './pages/DeviceTrust';
import NetworkSecurity from './pages/NetworkSecurity';
import PolicyEngine   from './pages/PolicyEngine';
import ThreatMonitor  from './pages/ThreatMonitor';
import TrustEngine    from './pages/TrustEngine';
import AuditLogs      from './pages/AuditLogs';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public routes ────────────────────────────────────────── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Protected routes (require JWT in localStorage) ───────── */}
        <Route element={
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        }>
          <Route path="/"                 element={<Dashboard />} />
          <Route path="/hybrid-cloud"     element={<HybridCloud />} />
          <Route path="/identity-trust"   element={<IdentityTrust />} />
          <Route path="/device-trust"     element={<DeviceTrust />} />
          <Route path="/network-security" element={<NetworkSecurity />} />
          <Route path="/policy-engine"    element={<PolicyEngine />} />
          <Route path="/threat-monitor"   element={<ThreatMonitor />} />
          <Route path="/trust-engine"     element={<TrustEngine />} />
          <Route path="/audit-logs"       element={<AuditLogs />} />
        </Route>

        {/* ── Catch-all ────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
