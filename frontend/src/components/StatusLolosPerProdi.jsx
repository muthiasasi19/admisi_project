// src/components/StatusLolosPerProdi.jsx
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/analytics/camaru-beasiswa/status-per-prodi";

export default function StatusLolosPerProdi() {
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

        const years = [
          ...new Set(raw.map((item) => Number(item.tahun)))
        ].sort((a, b) => b - a);

        const defaultYear = years[0];

        setAllData(raw);
        setTahunList(years);
        setTahunAktif(defaultYear);

        applyFilter(raw, defaultYear);
        setLoading(false);
      } catch (err) {
        console.error("Error fetch status per prodi:", err);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const applyFilter = (rawData, tahun) => {
    const filtered = rawData.filter(
      (item) => Number(item.tahun) === Number(tahun)
    );

    const grouped = {};

    filtered.forEach((item) => {
      if (!grouped[item.prodi]) {
        grouped[item.prodi] = {
          prodi: item.prodi,
          lolos: 0,
          tidak_lolos: 0
        };
      }

      if (item.status === "LOLOS") {
        grouped[item.prodi].lolos = item.total;
      } else {
        grouped[item.prodi].tidak_lolos = item.total;
      }
    });

    setData(Object.values(grouped));
  };

  const handleChangeTahun = (e) => {
    const year = Number(e.target.value);
    setTahunAktif(year);
    applyFilter(allData, year);
  };

  if (loading) return <div style={{ padding: 24, color: "#64748b" }}>Memuat statistik prodi...</div>;

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
            Status Kelulusan per Prodi
          </h2>
          <p style={{ fontSize: 14, color: "#475569", margin: "4px 0 0 0" }}>
            Perbandingan pendaftar lolos vs tidak lolos di setiap Program Studi
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
            Periode
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
            margin={{ top: 10, right: 280, left: 10, bottom: 20 }}
          >
            {/* Grid vertikal tegas */}
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#cbd5e1" />

            <XAxis 
              type="number" 
              axisLine={{ stroke: '#475569', strokeWidth: 2 }} 
              tickLine={{ stroke: '#475569' }}
              tick={{ fill: '#0f172a', fontSize: 13, fontWeight: 700 }}
              dy={10}
            />

            <YAxis 
              type="category" 
              dataKey="prodi" 
              axisLine={{ stroke: '#475569', strokeWidth: 2 }} 
              tickLine={{ stroke: '#475569' }}
              tick={{ fill: '#0f172a', fontSize: 12, fontWeight: 700 }}
              width={180} // Lebar ditambah agar nama prodi tidak terpotong
            />

            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid #cbd5e1', 
                fontWeight: 700,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' 
              }}
            />

            <Legend 
              layout="vertical" 
              align="right" 
              verticalAlign="middle" 
              iconType="circle"
              wrapperStyle={{ 
                paddingLeft: "50px", 
                fontSize: "13px", 
                fontWeight: 600,
                color: "#1e293b",
                lineHeight: "26px"
              }}
            />

            {/* Warna Kontras Tinggi: Emerald Hijau & Solid Merah */}
            <Bar dataKey="lolos" stackId="a" fill="#00a65a" name="Lolos" barSize={30} />
            <Bar 
              dataKey="tidak_lolos" 
              stackId="a" 
              fill="#dc2626" 
              name="Tidak Lolos" 
              radius={[0, 4, 4, 0]} // Membulat di ujung kanan
              barSize={30} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== INFO BOX ===== */}
      <div style={{ 
        marginTop: 20, 
        padding: "16px", 
        background: "#f8fafc", 
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        fontSize: "13px",
        color: "#64748b",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <span>📊</span>
        <span>
          Grafik ini menggunakan <b>Stacked Bar</b> untuk menunjukkan total pendaftar per prodi sekaligus proporsi kelulusannya di Tahun {tahunAktif}.
        </span>
      </div>
    </div>
  );
}