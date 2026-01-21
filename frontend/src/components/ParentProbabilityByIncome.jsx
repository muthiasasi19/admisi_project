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
  Cell,
  Label
} from "recharts";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/analytics/parent-probability/registrasi-by-income-per-tahun";

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

        const years = [...new Set(raw.map((item) => Number(item.tahun)))].sort((a, b) => b - a)
          .filter((year) => year >= 2019 && year <= 2025) 
          .sort((a, b) => b - a);

      if (years.length === 0) {
        setLoading(false);
        return;
      }
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
    const ORDER = ["0", "0–5 jt", "5–10 jt", "10–15 jt", "15–20 jt", ">20 jt"];

    const filtered = rawData
      .filter((item) => Number(item.tahun) === Number(tahun))
      .map((item) => ({
        kategori_income: item.kategori_income,
        probabilitas: item.probabilitas,
        total_camaru: item.total_camaru,
        total_registrasi: item.total_registrasi
      }))
      .sort((a, b) => ORDER.indexOf(b.kategori_income) - ORDER.indexOf(a.kategori_income));

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
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Probabilitas Registrasi - Income
          </h2>
          <p style={{ fontSize: 15, color: "#475569", margin: "4px 0 0 0" }}>
            <span style={{ fontSize: "20px" }}>💡</span> Probabilitas registrasi dihitung pada camaru yang mengisi data penghasilan orang tua.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
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
              fontSize: 15,
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
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={data}
            layout="vertical"
            // Margin left diperkecil agar label Y tidak terlalu jauh
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }} 
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#cbd5e1" />

            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              axisLine={{ stroke: '#475569', strokeWidth: 2 }}
              tick={{ fill: '#0f172a', fontSize: 14, fontWeight: 700 }}
            >
              <Label 
                value="Persentase" 
                offset={-45} 
                position="insideBottom" 
                style={{ fontSize: 18, fill: '#64748b' }} 
              />
            </XAxis>

            <YAxis
              type="category"
              dataKey="kategori_income"
              axisLine={{ stroke: '#475569', strokeWidth: 2 }}
              tick={{ fill: '#0f172a', fontSize: 14, fontWeight: 700 }}
              // Width dikurangi agar label "Jumlah" merapat ke sumbu
              width={80} 
            >
              <Label 
                value="Kategori" 
                angle={-90} 
                position="insideLeft" 
                // Offset disesuaikan agar lebih dekat ke angka sumbu
                offset={-10} 
                style={{ fontSize: 18, fill: '#64748b' }} 
              />
            </YAxis>

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
            
            <Bar
              dataKey="probabilitas"
              // Name dikosongkan agar tidak muncul di legenda otomatis
              name="" 
              radius={[0, 4, 4, 0]}
              barSize={40}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}