// src/pages/DashboardHome.jsx

import Card from "../components/ui/Card";

import TrendCamaruBeasiswa from "../components/TrendCamaruBeasiswa";
import TrendLolosPerTahun from "../components/TrendLolosPerTahun";
import TrendPendaftarPerJenis from "../components/TrendPendaftarPerJenis";
import TrendLolosPerJenis from "../components/TrendLolosPerJenis";
import StatusPerFakultas from "../components/StatusPerFakultas";
import StatusLolosPerProdi from "../components/StatusLolosPerProdi";
import DistribusiIncomeOrtu from "../components/DistribusiIncomeOrtu";
import DistribusiProfesiOrtu from "../components/DistribusiProfesiOrtu";
import ParentProbabilityByIncome from "../components/ParentProbabilityByIncome";
import ParentProbabilityByProfesi from "../components/ParentProbabilityByProfesi";

export default function DashboardHome() {
  return (
    <div style={{ display: "grid", gap: 24 }}>

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
          <StatusPerFakultas /> {/* TANPA TABEL */}
        </Card>
        <Card>
          <StatusLolosPerProdi />
        </Card>
      </div>

      {/* ===== ROW 3 ===== */}
      <Card>
        <TrendPendaftarPerJenis />
      </Card>

      <Card>
        <TrendLolosPerJenis />
      </Card>

      {/* ===== ROW 4 ===== */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card>
          <DistribusiIncomeOrtu />
        </Card>
        <Card>
          <DistribusiProfesiOrtu />
        </Card>
      </div>

      {/* ===== ROW 5 ===== */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card>
          <ParentProbabilityByIncome />
        </Card>
        <Card>
          <ParentProbabilityByProfesi />
        </Card>
      </div>

    </div>
  );
}

