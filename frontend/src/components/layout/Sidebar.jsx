// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";

const MENU = [
  { to: "/", label: "Dashboard", icon: "📊", end: true },
  { to: "/status-fakultas", label: "Status Fakultas", icon: "🏫" },
  { to: "/status-prodi", label: "Status Prodi", icon: "🎓" },
  { to: "/trend-jenis", label: "Trend Beasiswa", icon: "📈" },
  { to: "/parent", label: "Parent", icon: "👪" }
];

export default function Sidebar({ collapsed }) {
  const width = collapsed ? 72 : 240; // 🔥 72 = standar icon sidebar

  const baseLinkStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 6,
    color: "#e5e7eb",
    textDecoration: "none",
    marginBottom: 6,
    whiteSpace: "nowrap",
    fontSize: 14,
    transition: "background 0.15s ease"
  };

  return (
    <aside
      style={{
        position: "fixed",
        top: 60,              // tinggi Header
        bottom: 40,           // tinggi Footer
        left: 0,

        width,
        minWidth: width,
        maxWidth: width,

        background: "#020617",
        padding: 12,
        overflow: "hidden",
        transition: "width 0.2s ease",
        zIndex: 999
      }}
    >
      {/* TITLE */}
      {!collapsed && (
        <h3
          style={{
            color: "#e5e7eb",
            marginBottom: 16,
            paddingLeft: 4,
            fontSize: 14,
            fontWeight: 600
          }}
        >
          Menu
        </h3>
      )}

      {/* MENU ITEMS */}
      {MENU.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          title={collapsed ? item.label : undefined}
          style={({ isActive }) => ({
            ...baseLinkStyle,
            background: isActive ? "#1e293b" : "transparent",
            fontWeight: isActive ? 600 : 400
          })}
        >
          <span
            style={{
              width: 24,
              textAlign: "center",
              fontSize: 16
            }}
          >
            {item.icon}
          </span>

          {!collapsed && item.label}
        </NavLink>
      ))}
    </aside>
  );
}
