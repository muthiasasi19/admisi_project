// components/pages/TrendBeasiswaPage.jsx

import TrendPendaftarPerJenis from "../components/TrendPendaftarPerJenis";
import TrendLolosPerJenis from "../components/TrendLolosPerJenis";

export default function TrendBeasiswaPage() {
  return (
    <>
      <TrendPendaftarPerJenis showTable={true} />
      <TrendLolosPerJenis showTable={true} />
    </>
  );
}
