// components/ParentProbabilityByIncome.jsx

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

const API_URL = "http://127.0.0.1:8000/analytics/parent-probability/registrasi-by-income-per-tahun";

// Palet warna kontras untuk tiap bar agar lebih hidup
const BAR_COLORS = ["#1e3a8a", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];

export default function ParentProbabilityByIncome() {
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
        console.error("Error fetch parent probability:", err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const applyFilter = (rawData, tahun) => {
    const filtered = rawData
      .filter((item) => Number(item.tahun) === Number(tahun))
      .map((item) => ({
        kategori_income: item.kategori_income,
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

  if (loading) return <div style={{ padding: 24, color: "#64748b" }}>Memuat data probabilitas...</div>;

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
            Probabilitas Registrasi vs Income
          </h2>
          <p style={{ fontSize: 14, color: "#475569", margin: "4px 0 0 0" }}>
            Persentase peluang registrasi mahasiswa baru berdasarkan penghasilan orang tua
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
              fontWeight: 600,
              color: "#334155",
              cursor: "pointer",
              outline: "none"
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
            margin={{ top: 5, right: 50, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#cbd5e1" />

            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              axisLine={{ stroke: '#475569', strokeWidth: 2 }}
              tick={{ fill: '#0f172a', fontSize: 13, fontWeight: 700 }}
            />

            <YAxis
              type="category"
              dataKey="kategori_income"
              axisLine={{ stroke: '#475569', strokeWidth: 2 }}
              tick={{ fill: '#0f172a', fontSize: 12, fontWeight: 700 }}
              width={140} // Lebar ditambah agar teks income tidak terpotong
            />

            <Tooltip
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid #cbd5e1', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                fontWeight: 700
              }}
              formatter={(value) => [`${value}%`, "Peluang Registrasi"]}
              labelFormatter={(label) => `Range Income: ${label}`}
            />

            <Legend 
              verticalAlign="top" 
              align="right" 
              wrapperStyle={{ paddingBottom: 20, fontWeight: 700, fontSize: "13px" }} 
            />

            <Bar
              dataKey="probabilitas"
              name="Probabilitas Registrasi (%)"
              radius={[0, 4, 4, 0]} // Membulat di ujung kanan bar
              barSize={35}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== INSIGHT FOOTER ===== */}
      <div style={{ 
        marginTop: 20, 
        padding: "16px", 
        background: "#eff6ff", 
        borderRadius: "8px",
        border: "1px solid #bfdbfe",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
        <span style={{ fontSize: "20px" }}>💡</span>
        <div style={{ fontSize: "14px", color: "#1e40af", fontWeight: 600 }}>
          Semakin tinggi persentase, semakin besar kecenderungan calon mahasiswa di kategori income tersebut untuk melakukan registrasi ulang.
        </div>
      </div>
    </div>
  );
}