// frontend/src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { 
  LayoutDashboard, 
  School, 
  GraduationCap, 
  TrendingUp, 
  RefreshCcw, 
  Users, 
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function Sidebar({ collapsed }) {
  const [openParentMenu, setOpenParentMenu] = useState(false);

  const width = collapsed ? 70 : 220; 
  const sidebarGradient = "linear-gradient(180deg, #064e3b 0%, #15803d 100%)"; 

  const navLinkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    // Padding horizontal dihapus saat collapsed agar icon center sempurna
    padding: collapsed ? "12px 0" : "12px 16px", 
    borderRadius: "8px",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: 15,
    fontWeight: isActive ? 700 : 500,
    background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
    justifyContent: collapsed ? "center" : "flex-start",
    gap: collapsed ? 0 : 12,
    transition: "all 0.2s ease",
    width: "100%"
  });

  return (
    <aside
      style={{
        position: "fixed",
        top: 64,
        bottom: 0,
        left: 0,
        width,
        background: sidebarGradient, 
        padding: collapsed ? "10px 5px" : "12px 14px", 
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 999,
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.1)"
      }}
    >
      <nav style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 8, 
        marginTop: 10,
        alignItems: collapsed ? "center" : "stretch" 
      }}>
        
        <NavLink to="/dashboard" end style={navLinkStyle}>
          <LayoutDashboard size={22} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/dashboard/status-fakultas" style={navLinkStyle}>
          <School size={22}/>
          {!collapsed && <span>Status Fakultas</span>}
        </NavLink>

        <NavLink to="/dashboard/status-prodi" style={navLinkStyle}>
          <GraduationCap size={22}/>
          {!collapsed && <span>Status Prodi</span>}
        </NavLink>

        <NavLink to="/dashboard/trend-jenis" style={navLinkStyle}>
          <TrendingUp size={22}/>
          {!collapsed && <span>Trend Beasiswa</span>}
        </NavLink>

        <NavLink to="/dashboard/konversi-beasiswa" style={navLinkStyle}>
          <RefreshCcw size={22}/>
          {!collapsed && <span>Konversi Beasiswa</span>}
        </NavLink>

        {/* Parent Dropdown Header */}
        <div
          onClick={() => !collapsed && setOpenParentMenu(prev => !prev)}
          style={{
            display: "flex", 
            alignItems: "center", 
            padding: collapsed ? "12px 0" : "12px 16px",
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: "8px", 
            color: "#ffffff", 
            cursor: "pointer",
            fontSize: 15, 
            fontWeight: 500,
            gap: collapsed ? 0 : 10, // Jarak antara icon, teks, dan chevron
            width: "100%",
            background: openParentMenu && !collapsed ? "rgba(255, 255, 255, 0.1)" : "transparent",
            transition: "all 0.2s ease"
          }}
        >
          <Users size={22} style={{ flexShrink: 0 }} />
          {!collapsed && (
            <>
              <span>Pendapatan - Profesi</span>
              {/* Chevron diletakkan langsung setelah teks */}
              <div style={{ display: "flex", alignItems: "center", marginLeft: 4 }}>
                {openParentMenu ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
              </div>
            </>
          )}
        </div>

        {/* Dropdown Items */}
        {openParentMenu && !collapsed && (
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            marginLeft: 24, 
            gap: 6, 
            borderLeft: "2px solid rgba(255,255,255,0.2)", 
            paddingLeft: 12,
            marginTop: 4
          }}>
            <NavLink to="/dashboard/parent/camaru" style={({ isActive }) => ({
              fontSize: 14, color: "#fff", textDecoration: "none", padding: "10px 12px",
              background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
              borderRadius: 6, fontWeight: isActive ? 700 : 500
            })}>
              Orangtua Camaru
            </NavLink>

            <NavLink to="/dashboard/parent/mahasiswa" style={({ isActive }) => ({
              fontSize: 14, color: "#fff", textDecoration: "none", padding: "10px 12px",
              background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
              borderRadius: 6, fontWeight: isActive ? 700 : 500
            })}>
              Orangtua Mahasiswa
            </NavLink>

            <NavLink to="/dashboard/parent/probability" style={({ isActive }) => ({
              fontSize: 14, color: "#fff", textDecoration: "none", padding: "10px 12px",
              background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
              borderRadius: 6, fontWeight: isActive ? 700 : 500
            })}>
              Probabilitas 
            </NavLink>
          </div>
        )}
      </nav>
    </aside>
  );
}