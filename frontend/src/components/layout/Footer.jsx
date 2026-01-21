// Footer.jsx
export default function Footer() {
  const footerGradient = "linear-gradient(90deg, #064e3b 0%, #15803d 100%)"; 

  return (
    <footer
      style={{
        position: "fixed",      
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
        // Background menggunakan gradasi horizontal (90deg)
        background: footerGradient, 
        color: "rgba(255, 255, 255, 0.9)", 
        textAlign: "center",
        lineHeight: "40px",
        fontSize: 12,
        fontWeight: 600, // Sedikit lebih tebal agar terlihat pro
        letterSpacing: "0.5px",
        zIndex: 1000,
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)" // Tambahan shadow halus agar terpisah dari konten dashboard
      }}
    >
      ©Dashboard Admisi UMY
    </footer>
  );
}