// DashboardLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 72 : 240;

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {/* SIDEBAR FIXED */}
      <Sidebar collapsed={collapsed} />

      {/* HEADER FIXED */}
      <Header
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      {/* ===== MAIN CONTENT ===== */}
      <main
        style={{
          position: "relative",
          height: "calc(100vh - 100px)", // 60 header + 40 footer
          marginTop: 60,
          marginBottom: 40,

          /* 🔥 KUNCI PERBAIKAN */
          paddingLeft: sidebarWidth + 24,
          paddingRight: 24,
          paddingTop: 24,
          paddingBottom: 24,

          background: "#f8fafc",
          overflow: "auto",
          transition: "padding-left 0.2s ease"
        }}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
