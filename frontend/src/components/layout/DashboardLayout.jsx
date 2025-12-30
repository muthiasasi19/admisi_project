//DashboardLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <Sidebar collapsed={collapsed} />

      <div
        style={{
          flex: 1,                 // 🔥 INI KUNCI
          display: "flex",
          flexDirection: "column",
          minWidth: 0              // 🔥 cegah overflow
        }}
      >
        <Header
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />

        <main
        style={{
          flex: 1,
          background: "#f8fafc",
          overflow: "auto",
          padding: 24,

          marginTop: 60,
          marginBottom: 40,
          marginLeft: collapsed ? 72 : 240 // 🔥 HARUS SAMA DENGAN SIDEBAR
        }}
      >
        <Outlet />
      </main>


        <Footer />
      </div>
    </div>
  );
}

