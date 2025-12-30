// Sidebar.jsx
import { NavLink } from "react-router-dom";

const MENU = [
  { to: "/", label: "Dashboard", icon: "📊", end: true },
  { to: "/status-fakultas", label: "Status Fakultas", icon: "🏫" },
  { to: "/status-prodi", label: "Status Prodi", icon: "🎓" },
  { to: "/trend-jenis", label: "Trend Beasiswa", icon: "📈" },
  { to: "/parent", label: " Orang Tua", icon: "👪" }
];

export default function Sidebar({ collapsed }) {
  const width = collapsed ? 80 : 260;

  return (
    <aside
      style={{
        position: "fixed",
        top: 64,
        bottom: 0,
        left: 0,
        width,
        background: "#0f172a",
        padding: "20px 0px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 999,
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.05)"
      }}
    >
      <div style={{ marginBottom: 20, paddingLeft: collapsed ? 0 : 12, textAlign: collapsed ? 'center' : 'left' }}>
        {!collapsed && (
          <p style={{ color: "#eeefefff", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
            MENU
          </p>
        )}
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {MENU.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "12px",
              borderRadius: "10px",
              color: isActive ? "#fff" : "#94a3b8",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              background: isActive ? "linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)" : "transparent",
              boxShadow: isActive ? "0 4px 12px rgba(99, 102, 241, 0.3)" : "none",
              transition: "all 0.2s ease"
            })}
          >
            <span style={{ fontSize: 18, minWidth: 24, textAlign: "center" }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}