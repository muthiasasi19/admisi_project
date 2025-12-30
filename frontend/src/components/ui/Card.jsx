// ui/Card.jsx
export default function Card({ title, children }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        border: "1px solid #e2e8f0",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {title && (
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          marginBottom: 20, 
          paddingBottom: 12, 
          borderBottom: "1px solid #f1f5f9" 
        }}>
          <h3 style={{ 
            fontSize: 16, 
            fontWeight: 600, 
            color: "#334155",
            margin: 0
          }}>
            {title}
          </h3>
        </div>
      )}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}