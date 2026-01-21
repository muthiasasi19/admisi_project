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
  Label
} from "recharts";
import axios from "axios";

const CONTRAST_COLORS = {
  "0": "#2c3e50",
  "0–5 jt": "#00a65a",
  "5–10 jt": "#2980b9",
  "10–15 jt": "#f39c12",
  "15–20 jt": "#d35400",
  ">20 jt": "#c0392b"
};

export default function DistribusiIncomeMahasiswaParent({ showTable = false, hideHeader = false }) {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState([]);
  const [tahun, setTahun] = useState("");
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("http://127.0.0.1:8000/analytics/parent-distribution/income-mahasiswa");
        const sum = await axios.get("http://127.0.0.1:8000/analytics/parent-distribution/income-mahasiswa-summary");
        setSummary(sum.data);

        const raw = res.data.filter((d) => {
          const thn = Number(d.tahun);
          return thn >= 2019 && thn <= 2025;
        });

        const grouped = {};
        const kategoriSet = new Set();
        raw.forEach(({ tahun, kategori, jumlah }) => {
          kategoriSet.add(kategori);
          if (!grouped[tahun]) grouped[tahun] = { tahun };
          grouped[tahun][kategori] = jumlah;
        });

        const kategoriArr = Array.from(kategoriSet);
        const finalData = Object.values(grouped)
          .map((row) => {
            kategoriArr.forEach((k) => (row[k] ??= 0));
            return row;
          })
          .sort((a, b) => a.tahun - b.tahun);

        setKategoriList(kategoriArr);
        setData(finalData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetch data income:", err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 24, color: "#64748b" }}>Memuat distribusi Income...</div>;

  const filteredSummary = summary
    .filter(s => Number(s.tahun) >= 2019 && Number(s.tahun) <= 2025)
    .sort((a, b) => a.tahun - b.tahun);

  let displayed = { total_parent: 0, filled_income: 0, filled_profesi: 0 };
  if (tahun) {
    const row = filteredSummary.find((s) => String(s.tahun) === String(tahun));
    if (row) displayed = row;
  } else {
    displayed.total_parent = filteredSummary.reduce((a, b) => a + b.total_parent, 0);
  }

  return (
    <div style={{ width: "100%" }}>
      {!hideHeader && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: "2px solid #e2e8f0"
        }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Distribusi Pendapatan Orang Tua Mahasiswa
            </h2>
            <p style={{ fontSize: 16, color: "#475569", margin: "6px 0 0 0" }}>
              Visualisasi jumlah pendapatan orang tua mahasiswa aktif (Data Pendapatan ini telah dilakukan imputasi berdasarkan UMP)
            </p>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={enhancedCardStyle}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.9 }}>
                    Total Orang Tua Mahasiswa
                  </span>
                  
                  <select 
                    value={tahun} 
                    onChange={(e) => setTahun(e.target.value)} 
                    style={inlineSelectStyle}
                  >
                    <option value="" style={{color: "black"}}>Semua Tahun</option>
                    {filteredSummary.map((s) => (
                      <option key={s.tahun} value={s.tahun} style={{color: "black"}}>{s.tahun}</option>
                    ))}
                  </select>
                </div>
                <span style={{ fontSize: "32px", fontWeight: 900 }}>
                  {displayed.total_parent.toLocaleString("id-ID")}
                </span>
              </div>
              <div style={iconCircleWrapperStyle}>
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {hideHeader && (
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#0f172a" }}>
          Distribusi Pendapatan Ortu Mahasiswa
        </h3>
      )}

      {/* GRAFIK */}
      <div style={{ 
        background: "#ffffff", 
        borderRadius: 12, 
        padding: hideHeader ? "0px" : "24px", 
        border: hideHeader ? "none" : "1px solid #e2e8f0", 
        boxShadow: hideHeader ? "none" : "0 4px 6px -1px rgba(0,0,0,0.05)" 
      }}>
        <ResponsiveContainer width="100%" height={hideHeader ? 450 : 500}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
            
            <XAxis 
              dataKey="tahun" 
              tick={{ fill: '#0f172a', fontSize: 14, fontWeight: 700 }} 
              dy={10} 
            >
              <Label 
                value="Tahun" 
                offset={-45} 
                position="insideBottom" 
                style={{ fontSize: 18, fill: '#64748b' }} 
              />
            </XAxis>

            <YAxis tick={{ fill: '#0f172a', fontSize: 14, fontWeight: 600 }}>
              <Label 
                value="Jumlah" 
                angle={-90} 
                position="insideLeft" 
                offset={-30} 
                style={{ fontSize: 18, fill: '#64748b' }} 
              />
            </YAxis>

            <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
            
            <Legend 
              layout="vertical" 
              align="right" 
              verticalAlign="middle" 
              wrapperStyle={{ paddingLeft: "30px", fontWeight: 600, fontSize: "14px" }} 
            />

            {kategoriList.map((k) => (
              <Bar key={k} dataKey={k} stackId="a" fill={CONTRAST_COLORS[k] || "#94a3b8"} barSize={40} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// STYLING berdasar Trend_pendaftar_per_jenis.jsx
const enhancedCardStyle = { 
  background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)", 
  padding: "20px 24px", 
  borderRadius: "12px", 
  display: "flex", 
  alignItems: "center", 
  justifyContent: "space-between", 
  minWidth: "320px", 
  color: "#ffffff", 
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
};

const inlineSelectStyle = {
  background: "rgba(255,255,255,0.2)", 
  color: "white", 
  border: "none", 
  fontSize: "12px", 
  borderRadius: "4px",
  cursor: "pointer",
  outline: "none",
  padding: "2px 4px"
};

const iconCircleWrapperStyle = { 
  background: "rgba(255, 255, 255, 0.2)", 
  padding: "12px", 
  borderRadius: "50%", 
  display: "flex" 
};