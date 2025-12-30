// Header.jsx
export default function Header({ collapsed, onToggle }) {
  return (
    <header
      style={{
        position: "fixed",      
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        background: "#0f172a",
        color: "white",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 12,
        zIndex: 1000            
      }}
    >
      <button
        onClick={onToggle}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: 20,
          cursor: "pointer"
        }}
        title="Toggle Sidebar"
      >
        ☰
      </button>

      <span style={{ fontSize: 18 }}>
        Dashboard Camaru Beasiswa
      </span>
    </header>
  );
}
