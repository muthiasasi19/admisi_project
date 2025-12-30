// Header.jsx
export default function Header({ collapsed, onToggle }) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        background: "rgba(15, 23, 42, 0.9)", // Dark Slate dengan transparansi
        backdropFilter: "blur(8px)",
        color: "white",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        zIndex: 1000
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={onToggle}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "none",
            color: "white",
            width: 36,
            height: 36,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
          onMouseOut={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
        >
          {collapsed ? "→" : "←"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, background: "#6366f1", borderRadius: 8 }}></div>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px" }}>
            ADMISI<span style={{ color: "#6366f1" }}></span>
          </span>
        </div>
      </div>
      
      <div style={{ fontSize: 13, color: "#94a3b8" }}>
      </div>
    </header>
  );
}