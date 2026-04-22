import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import "../pages/Dashboard.css"; // using same theme styles you already have

const nav = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", to: "/", icon: "📊" },
      { label: "Hybrid Cloud", to: "/hybrid-cloud", icon: "☁️" },
    ],
  },
  {
    title: "Zero Trust Pillars",
    items: [
      { label: "Identity Trust", to: "/identity-trust", icon: "🧑‍💼" },
      { label: "Device Trust", to: "/device-trust", icon: "💻" },
      { label: "Network Security", to: "/network-security", icon: "🌐" },
      { label: "Policy Engine", to: "/policy-engine", icon: "🧩" },
      { label: "Trust Engine", to: "/trust-engine", icon: "🛡️" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Threat Monitor", to: "/threat-monitor", icon: "🚨" },
      { label: "Audit Logs", to: "/audit-logs", icon: "🧾" },
    ],
  },
];

const linkStyle = ({ isActive }) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 10,
  textDecoration: "none",
  color: "white",
  background: isActive ? "rgba(0,230,230,0.14)" : "transparent",
  border: isActive ? "1px solid rgba(0,230,230,0.35)" : "1px solid transparent",
});

export default function Sidebar() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(() => ({
    Overview: true,
    "Zero Trust Pillars": true,
    Operations: true,
  }));

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return nav;

    return nav
      .map((section) => ({
        ...section,
        items: section.items.filter((i) => i.label.toLowerCase().includes(query)),
      }))
      .filter((section) => section.items.length > 0);
  }, [q]);

  return (
    <aside
      style={{
        width: 270,
        minHeight: "100vh",
        background: "#081a28",
        borderRight: "1px solid rgba(0,230,230,0.12)",
        padding: 14,
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 800, letterSpacing: 1.2 }}>ZERO TRUST</div>
        <div style={{ opacity: 0.7, fontSize: 12 }}>Hybrid Cloud Console</div>
      </div>

      <input
        className="input"
        style={{ width: "100%", marginBottom: 14 }}
        placeholder="Search pages..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {filtered.map((section) => (
        <div key={section.title} style={{ marginBottom: 14 }}>
          <button
            className="button"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 12px",
            }}
            onClick={() => setOpen((p) => ({ ...p, [section.title]: !p[section.title] }))}
          >
            <span style={{ fontWeight: 700 }}>{section.title}</span>
            <span style={{ opacity: 0.75 }}>{open[section.title] ? "▾" : "▸"}</span>
          </button>

          {open[section.title] && (
            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
              {section.items.map((item) => (
                <NavLink key={item.to} to={item.to} style={linkStyle}>
                  <span style={{ width: 22 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}