//componets/ParentProbabilityByProfesi.jsx

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/analytics/profesi-probability/registrasi-by-profesi-per-tahun";

// Palet warna kontras tinggi (Vibrant Violet & Deep Purple)
const BAR_COLORS = ["#4c1d95", "#5b21b6", "#6d28d9", "#7c3aed", "#8b5cf6", "#a78bfa"];

export default function ParentProbabilityByProfesi() {
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [tahunAktif, setTahunAktif] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(API_URL);
        const raw = res.data;
        if (!raw.length) return;

        const years = [...new Set(raw.map((item) => Number(item.tahun)))].sort((a, b) => b - a);
        const defaultYear = years[0];

        setAllData(raw);
        setTahunList(years);
        setTahunAktif(defaultYear);
        applyFilter(raw, defaultYear);
        setLoading(false);
      } catch (err) {
        console.error("Error fetch probability profesi:", err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const applyFilter = (rawData, tahun) => {
    const filtered = rawData
      .filter((item) => Number(item.tahun) === Number(tahun))
      .map((item) => ({
        profesi: item.profesi,
        probabilitas: item.probabilitas,
        total_camaru: item.total_camaru,
        total_registrasi: item.total_registrasi
      }));
    setData(filtered);
  };

  const handleChangeTahun = (e) => {
    const year = Number(e.target.value);
    setTahunAktif(year);
    applyFilter(allData, year);
  };

  if (loading) return <div style={{ padding: 24, color: "#64748b" }}>Memuat data probabilitas profesi...</div>;

  return (
    <div style={{ width: "100%" }}>
      {/* ===== HEADER & FILTER ===== */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "2px solid #e2e8f0"
      }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Probabilitas Registrasi vs Profesi
          </h2>
          <p style={{ fontSize: 14, color: "#475569", margin: "4px 0 0 0" }}>
            Persentase peluang registrasi berdasarkan latar belakang pekerjaan orang tua
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
            Tahun Ajaran
          </label>
          <select
            value={tahunAktif ?? ""}
            onChange={handleChangeTahun}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              background: "#fff",
              fontSize: 14,
              fontWeight: 700,
              color: "#1e293b",
              cursor: "pointer"
            }}
          >
            {tahunList.map((tahun) => (
              <option key={tahun} value={tahun}>Tahun {tahun}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== CHART AREA ===== */}
      <div style={{ 
        background: "#ffffff", 
        borderRadius: 12, 
        padding: "24px", 
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 50, left: 60, bottom: 5 }}
          >
            {/* Grid Vertikal Saja */}
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#cbd5e1" />

            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              axisLine={{ stroke: '#475569', strokeWidth: 2 }} // Garis tegas
              tick={{ fill: '#0f172a', fontSize: 13, fontWeight: 700 }}
            />

            <YAxis
              type="category"
              dataKey="profesi"
              axisLine={{ stroke: '#475569', strokeWidth: 2 }} // Garis tegas
              tick={{ fill: '#0f172a', fontSize: 12, fontWeight: 700 }}
              width={180} // Lebar cukup untuk teks profesi yang panjang
            />

            <Tooltip
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid #cbd5e1', 
                fontWeight: 700,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' 
              }}
              formatter={(value) => [`${value}%`, "Peluang Registrasi"]}
            />

            <Legend 
              verticalAlign="top" 
              align="right" 
              wrapperStyle={{ paddingBottom: 20, fontWeight: 700, fontSize: "13px" }} 
            />

            <Bar
              dataKey="probabilitas"
              name="Probabilitas Registrasi (%)"
              radius={[0, 4, 4, 0]}
              barSize={30}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== FOOTER INFO ===== */}
      <div style={{ 
        marginTop: 20, 
        padding: "16px", 
        background: "#f5f3ff", 
        borderRadius: "8px",
        border: "1px solid #ddd6fe",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
        <span style={{ fontSize: "20px" }}>🔍</span>
        <div style={{ fontSize: "14px", color: "#5b21b6", fontWeight: 600 }}>
          Data ini membantu mengidentifikasi profesi orang tua mana yang memiliki loyalitas registrasi paling tinggi di setiap tahunnya.
        </div>
      </div>
    </div>
  );
}