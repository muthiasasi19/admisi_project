// Header.jsx
import logoUMY from "../../assets/logo_umy.jpg";

export default function Header({ collapsed, onToggle }) {
  const darkGreen = "#064e3b";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        zIndex: 1000 // Layer dasar header
      }}
    >
      {/* === BUTTON DI POJOK KIRI (Layer Paling Atas) === */}
<button
        onClick={onToggle}
        style={{
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent", // Menghapus background
          border: "none",
          padding: "12px", // Memberikan sedikit ruang klik tanpa background
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: darkGreen,
          zIndex: 9999, 
          outline: "none",
          boxShadow: "none", // Memastikan tidak ada bayangan
          transition: "opacity 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"} // Efek hover sederhana
        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        title="Toggle Sidebar"
      >
        <svg 
          width="34" 
          height="30" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ display: 'block' }} 
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* === CENTER LOGO === */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          whiteSpace: "nowrap",
          zIndex: 1100 // Tetap di bawah tombol burger
        }}
      >
        <img
          src={logoUMY}
          alt="UMY Logo"
          style={{
            height: 42,
            width: "auto",
            objectFit: "contain"
          }}
        />

        <div
          style={{
            height: 24,
            width: 2,
            background: "#e2e8f0",
            margin: "0 4px"
          }}
        />

        <span
          style={{
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.5px",
            color: "#1e293b"
          }}
        >
          <span style={{ color: darkGreen }}>DASHBOARD</span> ADMISI UMY
        </span>
      </div>
    </header>
  );
}