//frontend/src/pages/ParentProbability.jsx
import ParentProbabilityByIncome from "../components/ParentProbabilityByIncome";
import ParentProbabilityByProfesi from "../components/ParentProbabilityByProfesi";

export default function ParentPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
      <ParentProbabilityByIncome />
      <ParentProbabilityByProfesi />
    </div>
  );
}

