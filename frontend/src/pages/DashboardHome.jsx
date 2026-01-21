// src/pages/DashboardHome.jsx
import Card from "../components/ui/Card";

import TrendCamaruBeasiswa from "../components/TrendCamaruBeasiswa";
import TrendLolosPerTahun from "../components/TrendLolosPerTahun";
import TrendPendaftarPerJenis from "../components/TrendPendaftarPerJenis";
import TrendLolosPerJenis from "../components/TrendLolosPerJenis";
import StatusPerFakultas from "../components/StatusPerFakultas";
import StatusLolosPerProdi from "../components/StatusLolosPerProdi";
import DistribusiIncomeCamaruParent from "../components/DistribusiIncomeCamaruParent";
import DistribusiProfesiCamaruParent from "../components/DistribusiProfesiCamaruParent";
import DistribusiIncomeMahasiswaParent from "../components/DistribusiIncomeMahasiswaParent";
import DistribusiProfesiMahasiswaParent from "../components/DistribusiProfesiMahasiswaParent";

export default function DashboardHome() {
  // Style grid fleksibel agar grafik tidak penyet dan tetap luas
  const flexibleGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: 24,
    width: "100%"
  };

  // Helper style untuk pembungkus grafik di dalam Card
  const chartWrapperStyle = {
    flex: 1, 
    minWidth: 0, 
    width: "100%", 
    height: "100%"
  };

  // Komponen Pembatas Cantik
  const SectionDivider = ({ title }) => (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      margin: "40px 0 20px 0", 
      gap: "20px" 
    }}>
      <div style={{ flex: 1, height: "2px", background: "linear-gradient(to right, transparent, #e2e8f0)" }} />
      <div style={{ 
        padding: "10px 24px", 
        background: "#064e3b", 
        color: "white", 
        borderRadius: "30px", 
        fontWeight: "bold", 
        fontSize: "14px",
        letterSpacing: "1px",
        boxShadow: "0 4px 12px rgba(6, 78, 59, 0.2)",
        textTransform: "uppercase"
      }}>
        {title}
      </div>
      <div style={{ flex: 1, height: "2px", background: "linear-gradient(to left, transparent, #e2e8f0)" }} />
    </div>
  );

  return (
    <div style={{ display: "grid", gap: 24, padding: "10px" }}>

      {/* PEMBATAS */}
      <SectionDivider title="Camaru Beasiswa" />
      {/* ===== ROW 1 ===== */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card>
          <TrendCamaruBeasiswa />
        </Card>
        <Card>
          <TrendLolosPerTahun />
        </Card>
      </div>

      {/* ===== ROW 2 ===== */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card>
          <StatusPerFakultas />
        </Card>
        <Card>
          <StatusLolosPerProdi />
        </Card>
      </div>

      {/* ===== ROW 3 ===== */}
      <Card>
        <TrendPendaftarPerJenis isDashboard={true} />
      </Card>

      <Card>
        <TrendLolosPerJenis />
      </Card>

      {/* PEMBATAS ANTARA ROW 3 DAN 4 */}
      <SectionDivider title="Orangtua Camaru - Mahasiswa" />

{/* ===== ROW 4 (Distribusi Income) ===== */}
      <div style={flexibleGridStyle}>
        <Card style={{ padding: "20px", minHeight: 540 }}>
          <DistribusiIncomeCamaruParent hideHeader={true} />
        </Card>

        <Card style={{ padding: "20px", minHeight: 540 }}>
          {/* Tambahkan hideHeader={true} di sini juga */}
          <DistribusiIncomeMahasiswaParent hideHeader={true} />
        </Card>
      </div>

      {/* ===== ROW 5 (Distribusi Profesi) ===== */}
      <div style={flexibleGridStyle}>
        <Card style={{ padding: "20px", minHeight: 540 }}>
          <DistribusiProfesiCamaruParent />
        </Card>
        
        <Card style={{ padding: "20px", minHeight: 540 }}>
          <DistribusiProfesiMahasiswaParent />
        </Card>
      </div>
    </div>
  );
}