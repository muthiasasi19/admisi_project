import DistribusiIncomeOrtu from "../components/DistribusiIncomeOrtu";
import DistribusiProfesiOrtu from "../components/DistribusiProfesiOrtu";
import ParentProbabilityByIncome from "../components/ParentProbabilityByIncome";
import ParentProbabilityByProfesi from "../components/ParentProbabilityByProfesi";

export default function ParentPage() {
  return (
    <>
      <DistribusiIncomeOrtu />
      <DistribusiProfesiOrtu />
      <ParentProbabilityByIncome />
      <ParentProbabilityByProfesi />
    </>
  );
}
