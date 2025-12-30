// ui/Card.jsx
export default function Card({ title, children }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 8,
        padding: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}
    >
      {title && (
        <h3 style={{ marginBottom: 12, fontSize: 16 }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
