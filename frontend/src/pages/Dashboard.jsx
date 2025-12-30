// src/pages/Dashboard.jsx

import DashboardLayout from "../components/layout/DashboardLayout";

import TrendCamaruBeasiswa from "../components/TrendCamaruBeasiswa";
import TrendLolosPerTahun from "../components/TrendLolosPerTahun";
import TrendPendaftarPerJenis from "../components/TrendPendaftarPerJenis";
import TrendLolosPerJenis from "../components/TrendLolosPerJenis";
import StatusPerFakultas from "../components/StatusPerFakultas";
import StatusLolosPerProdi from "../components/StatusLolosPerProdi";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div style={{ padding: 24 }}>
        <TrendCamaruBeasiswa />
        <TrendLolosPerTahun />
        <TrendPendaftarPerJenis />
        <TrendLolosPerJenis />
        <StatusPerFakultas />
        <StatusLolosPerProdi />
      </div>
    </DashboardLayout>
  );
}
