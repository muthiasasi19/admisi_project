//frontend/src/pages/ParentMahasiswa.jsx
import DistribusiIncomeOrtu from "../components/DistribusiIncomeMahasiswaParent";
import DistribusiProfesiOrtu from "../components/DistribusiProfesiMahasiswaParent";


export default function ParentPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
      <DistribusiIncomeOrtu />
      <DistribusiProfesiOrtu />
    </div>
  );
}

