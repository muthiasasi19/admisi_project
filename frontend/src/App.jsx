//App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";

import DashboardHome from "./pages/DashboardHome";
import StatusFakultasPage from "./pages/StatusFakultasPage";
import StatusProdiPage from "./pages/StatusProdiPage";
import TrendBeasiswaPage from "./pages/TrendBeasiswaPage";
import ParentPage from "./pages/ParentPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="status-fakultas" element={<StatusFakultasPage />} />
          <Route path="status-prodi" element={<StatusProdiPage />} />
          <Route path="trend-jenis" element={<TrendBeasiswaPage />} />
          <Route path="parent" element={<ParentPage />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
