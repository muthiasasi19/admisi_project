//frontend/src/pages/ParentCamaru.jsx
import DistribusiIncomeOrtu from "../components/DistribusiIncomeCamaruParent";
import DistribusiProfesiOrtu from "../components/DistribusiProfesiCamaruParent";


export default function ParentPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
      <DistribusiIncomeOrtu />
      <DistribusiProfesiOrtu />
    </div>
  );
}

