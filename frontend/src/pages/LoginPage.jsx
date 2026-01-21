//LoginPage
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/umy.jpg"; 
import logoUmy from "../assets/logo_umy.jpg";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // SIMPAN TOKEN KE STORAGE (Ini yang bikin anda bisa masuk)
    localStorage.setItem("userToken", "active_session_123");


    window.location.href = "/dashboard";
  };

  return (
    <div style={{ 
      position: "relative", minHeight: "100vh", width: "100vw",
      display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden"
    }}>
      
      {/* BACKGROUND & OVERLAY */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover",
        backgroundPosition: "center", filter: "blur(8px)", transform: "scale(1.1)", zIndex: -2
      }} />
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.3)", zIndex: -1
      }} />

      {/* LOGIN CARD */}
      <form onSubmit={handleLogin} style={{ 
        position: "relative", zIndex: 1, padding: "40px", 
        background: "rgba(255, 255, 255, 0.95)", borderRadius: "20px", 
        boxShadow: "0 15px 35px rgba(0,0,0,0.2)", width: "100%", maxWidth: "400px",
        boxSizing: "border-box", textAlign: "center" 
      }}>
        
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
          <img src={logoUmy} alt="Logo UMY" style={{ width: "70%", height: "auto" }} />
        </div>

        <h2 style={{ marginBottom: "30px", color: "#154e13", marginTop: "0" }}>Login</h2>
        
        <div style={{ marginBottom: "15px", textAlign: "left" }}>
          <label style={{ fontSize: "14px", fontWeight: "bold", color: "#154e13" }}>Email</label>
          <input 
            type="email" placeholder="Masukkan email Anda" required 
            style={{ width: "100%", padding: "12px", marginTop: "8px", borderRadius: "10px", border: "1px solid #D1D5DB", boxSizing: "border-box" }} 
          />
        </div>

        <div style={{ marginBottom: "25px", textAlign: "left" }}>
          <label style={{ fontSize: "14px", fontWeight: "bold", color: "#154e13" }}>Password</label>
          <input 
            type="password" placeholder="Masukkan password Anda" required 
            style={{ width: "100%", padding: "12px", marginTop: "8px", borderRadius: "10px", border: "1px solid #D1D5DB", boxSizing: "border-box" }} 
          />
        </div>

        <button type="submit" style={{ 
          width: "100%", padding: "12px", backgroundColor: "#064e3b", color: "white", 
          border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer"
        }}>
          Sign In
        </button>
      </form>
    </div>
  );
}