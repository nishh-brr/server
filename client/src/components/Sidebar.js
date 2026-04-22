import React, { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../pages/Dashboard.css';

const nav = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard',    to: '/',             icon: '📊' },
      { label: 'Hybrid Cloud', to: '/hybrid-cloud',  icon: '☁️' },
    ],
  },
  {
    title: 'Zero Trust Pillars',
    items: [
      { label: 'Identity Trust',    to: '/identity-trust',    icon: '🧑‍💼' },
      { label: 'Device Trust',      to: '/device-trust',      icon: '💻' },
      { label: 'Network Security',  to: '/network-security',  icon: '🌐' },
      { label: 'Policy Engine',     to: '/policy-engine',     icon: '🧩' },
      { label: 'Trust Engine',      to: '/trust-engine',      icon: '🛡️' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Threat Monitor', to: '/threat-monitor', icon: '🚨' },
      { label: 'Audit Logs',     to: '/audit-logs',     icon: '🧾' },
    ],
  },
];

const linkStyle = ({ isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 12px',
  borderRadius: 10,
  textDecoration: 'none',
  color: 'white',
  fontSize: 14,
  background: isActive ? 'rgba(0,230,230,0.14)' : 'transparent',
  border:     isActive ? '1px solid rgba(0,230,230,0.35)' : '1px solid transparent',
  transition: 'all 0.15s',
});

export default function Sidebar() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState({ Overview: true, 'Zero Trust Pillars': true, Operations: true });

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('zt_user')) || {}; }
    catch { return {}; }
  })();

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return nav;
    return nav
      .map(s => ({ ...s, items: s.items.filter(i => i.label.toLowerCase().includes(query)) }))
      .filter(s => s.items.length > 0);
  }, [q]);

  const handleLogout = () => {
    localStorage.removeItem('zt_token');
    localStorage.removeItem('zt_user');
    navigate('/login');
  };

  return (
    <aside style={{
      width: 260,
      minHeight: '100vh',
      background: '#081a28',
      borderRight: '1px solid rgba(0,230,230,0.12)',
      padding: 14,
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Brand */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 800, letterSpacing: 1.5, color: '#00e6e6', fontSize: 15 }}>
          🛡️ ZERO TRUST
        </div>
        <div style={{ opacity: 0.55, fontSize: 11, marginTop: 2 }}>Hybrid Cloud Console</div>
      </div>

      {/* User badge */}
      {user.email && (
        <div style={{
          background: 'rgba(0,230,230,0.06)',
          border: '1px solid rgba(0,230,230,0.15)',
          borderRadius: 10,
          padding: '8px 12px',
          marginBottom: 14,
          fontSize: 12,
        }}>
          <div style={{ color: '#00e6e6', fontWeight: 600 }}>{user.name || user.email}</div>
          <div style={{ opacity: 0.5, fontSize: 11 }}>{user.role || 'user'} · authenticated</div>
        </div>
      )}

      {/* Search */}
      <input
        className="input"
        style={{ width: '100%', marginBottom: 14, boxSizing: 'border-box', fontSize: 13 }}
        placeholder="Search pages…"
        value={q}
        onChange={e => setQ(e.target.value)}
      />

      {/* Nav sections */}
      <div style={{ flex: 1 }}>
        {filtered.map(section => (
          <div key={section.title} style={{ marginBottom: 12 }}>
            <button
              className="button"
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
                opacity: 0.7,
              }}
              onClick={() => setOpen(p => ({ ...p, [section.title]: !p[section.title] }))}
            >
              <span>{section.title}</span>
              <span>{open[section.title] ? '▾' : '▸'}</span>
            </button>

            {open[section.title] && (
              <div style={{ marginTop: 6, display: 'grid', gap: 4 }}>
                {section.items.map(item => (
                  <NavLink key={item.to} to={item.to} style={linkStyle}>
                    <span style={{ width: 22 }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: 'auto',
          width: '100%',
          padding: '10px 12px',
          background: 'rgba(255,23,68,0.1)',
          border: '1px solid rgba(255,23,68,0.3)',
          borderRadius: 10,
          color: '#ff5252',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 600,
          transition: 'all 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,23,68,0.2)'}
        onMouseOut={e  => e.currentTarget.style.background = 'rgba(255,23,68,0.1)'}
      >
        🚪 Logout
      </button>
    </aside>
  );
}
