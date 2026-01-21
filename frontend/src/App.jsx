//App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";

import DashboardHome from "./pages/DashboardHome";
import StatusFakultasPage from "./pages/StatusFakultasPage";
import StatusProdiPage from "./pages/StatusProdiPage";
import TrendBeasiswaPage from "./pages/TrendBeasiswaPage";
import Konversi from "./pages/Konversi";
import LoginPage from "./pages/LoginPage";
import ParentCamaru from "./pages/ParentCamaru";
import ParentMahasiswa from "./pages/ParentMahasiswa";
import ParentProbability from "./pages/ParentProbability";


function App() {
  const token = localStorage.getItem("userToken");

  return (
    <BrowserRouter>
      <Routes>

        {/* Login jadi default pertama kali */}
        <Route path="/" element={!token ? <LoginPage /> : <Navigate to="/dashboard" />} />

        {/* Dashboard setelah login */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />

          <Route path="status-fakultas" element={<StatusFakultasPage />} />
          <Route path="status-prodi" element={<StatusProdiPage />} />
          <Route path="trend-jenis" element={<TrendBeasiswaPage />} />
          <Route path="konversi-beasiswa" element={<Konversi />} />

          <Route path="parent/camaru" element={<ParentCamaru />} />
          <Route path="parent/mahasiswa" element={<ParentMahasiswa />} />
          <Route path="parent/probability" element={<ParentProbability />} />
        </Route>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
