// components/ParentProbabilityByProfesi.jsx

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Label
} from "recharts";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/analytics/profesi-probability/registrasi-by-profesi-per-tahun";

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
        const raw = res.data.filter((item) => Number(item.tahun) !== 2016);
        
        if (!raw.length) {
          setLoading(false);
          return;
        }

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
            Probabilitas Registrasi - Profesi
          </h2>
          <p style={{ fontSize: 15, color: "#475569", margin: "4px 0 0 0" }}>
            <span style={{ fontSize: "20px" }}>💡</span> Probabilitas registrasi dihitung pada camaru yang mengisi data profesi orang tua.
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

      <div style={{ 
        background: "#ffffff", 
        borderRadius: 12, 
        padding: "24px", 
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <ResponsiveContainer width="100%" height={400}> 
        <BarChart
          data={data}
          layout="vertical"
          // PERBAIKAN 1: Margin left ditingkatkan agar label sumbu Y punya ruang
          margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
          barCategoryGap="10%" 
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
            dataKey="profesi"
            axisLine={{ stroke: '#475569', strokeWidth: 2 }}
            tick={{ fill: '#0f172a', fontSize: 14, fontWeight: 700 }}
            // PERBAIKAN 2: Width ditingkatkan agar label "Jumlah" tidak terpotong ke kiri
            width={120}
          >
            <Label 
              value="Kategori" 
              angle={-90} 
              position="insideLeft" 
              // PERBAIKAN 3: Offset disesuaikan agar teks berada di posisi yang tepat
              offset={-10} 
              style={{ fontSize: 18, fill: '#64748b' }} 
            />
          </YAxis>

          <Tooltip
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700 }}
            formatter={(value) => [`${value}%`, "Peluang Registrasi"]}
          />

          <Bar
            dataKey="probabilitas"
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