// frontend/src/components/Trend_pendaftar_per_jenis.jsx
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

const CONTRAST_COLORS = [
  "#003f5c", "#de425b", "#00a65a", "#f39c12", "#8e44ad", 
  "#2c3e50", "#d35400", "#16a085", "#c0392b", "#2980b9", 
  "#27ae60", "#f1c40f"
];

export default function TrendPendaftarPerJenis({ showTable = false, isDashboard = false }) {
  const [data, setData] = useState([]);
  const [jenisList, setJenisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("all");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("http://127.0.0.1:8000/analytics/camaru-beasiswa/trend-per-jenis");
        const raw = res.data;
        const grouped = {};
        const jenisSet = new Set();

        raw.forEach((item) => {
          const tahun = item.tahun;
          const key = item.jenis_beasiswa.replace(/\s+/g, "_").replace(/[^\w]/g, "");
          jenisSet.add(key);
          if (!grouped[tahun]) grouped[tahun] = { tahun };
          grouped[tahun][key] = item.total_pendaftar;
        });

        const jenisArray = Array.from(jenisSet);
        const finalData = Object.values(grouped)
          .map((row) => {
            jenisArray.forEach((j) => { if (row[j] === undefined) row[j] = 0; });
            return row;
          })
          .sort((a, b) => a.tahun - b.tahun);

        setJenisList(jenisArray);
        setData(finalData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetch:", err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const calculateTotal = () => {
    if (selectedYear === "all") {
      return data.reduce((acc, row) => {
        return acc + jenisList.reduce((sum, jenis) => sum + (row[jenis] || 0), 0);
      }, 0);
    } else {
      const yearData = data.find(d => String(d.tahun) === String(selectedYear));
      if (!yearData) return 0;
      return jenisList.reduce((sum, jenis) => sum + (yearData[jenis] || 0), 0);
    }
  };

  if (loading) return <div style={{ padding: 24, color: "#64748b", fontSize: "16px" }}>Memuat data trend...</div>;

  const enhancedCardStyle = {
    background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
    padding: "20px 24px",
    borderRadius: "12px",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: "320px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  };

  return (
    <div style={{ width: "100%" }}>
      {/* HEADER SECTION */}
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
            Trend Pendaftar per Tahun berdasarkan Jenis Beasiswa
          </h2>
          <p style={{ fontSize: 16, color: "#475569", margin: "6px 0 0 0" }}>
            Visualisasi jumlah pendaftar beasiswa secara keseluruhan
          </p>
        </div>

        {!isDashboard && (
          <div style={enhancedCardStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.9 }}>
                  Total Pendaftar
                </span>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  style={{ 
                    background: "rgba(255,255,255,0.2)", 
                    color: "white", 
                    border: "none", 
                    fontSize: "12px", 
                    borderRadius: "4px",
                    cursor: "pointer",
                    outline: "none",
                    padding: "2px 4px"
                  }}
                >
                  <option value="all" style={{color: "black"}}>Semua Tahun</option>
                  {data.map(d => (
                    <option key={d.tahun} value={d.tahun} style={{color: "black"}}>{d.tahun}</option>
                  ))}
                </select>
              </div>
              <span style={{ fontSize: "32px", fontWeight: 900 }}>
                {calculateTotal().toLocaleString("id-ID")}
              </span>
            </div>
            <div style={{ background: "rgba(255, 255, 255, 0.2)", padding: "12px", borderRadius: "50%" }}>
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* GRAFIK SECTION */}
      <div style={{ 
        background: "#ffffff", 
        borderRadius: 12, 
        padding: isDashboard ? "0px" : "32px", 
        border: isDashboard ? "none" : "1px solid #e2e8f0", 
        boxShadow: isDashboard ? "none" : "0 4px 6px -1px rgba(0,0,0,0.1)" 
      }}>
        <ResponsiveContainer width="100%" height={isDashboard ? 450 : 550}>
          <BarChart data={data} margin={{ top: 10, right: 50, left: 20, bottom: 50 }} barCategoryGap="12%" barGap={0}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
            <XAxis 
              dataKey="tahun" 
              axisLine={{ stroke: '#475569', strokeWidth: 2 }} 
              tickLine={{ stroke: '#475569' }} 
              tick={{ fill: '#0f172a', fontSize: 14, fontWeight: 700 }} 
              dy={10}
            >
              <Label 
                value="Tahun" 
                position="insideBottom" 
                offset={-35} 
                style={{ textAnchor: 'middle', fill: '#475569', fontSize: 18 }} 
              />
            </XAxis>
            <YAxis 
              axisLine={{ stroke: '#475569', strokeWidth: 2 }} 
              tickLine={{ stroke: '#475569' }} 
              tick={{ fill: '#0f172a', fontSize: 14, fontWeight: 600 }}
            >
              <Label 
                value="Jumlah Mahasiswa" 
                angle={-90} 
                position="insideLeft" 
                offset={-10} 
                style={{ textAnchor: 'middle', fill: '#475569', fontSize: 18 }} 
              />
            </YAxis>
            <Tooltip 
              shared={false} 
              cursor={{ fill: 'rgba(0,0,0,0.03)' }} 
              contentStyle={{ borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: "14px" }} 
            />
            <Legend 
              layout="vertical" 
              align="right" 
              verticalAlign="middle" 
              iconType="rect" 
              wrapperStyle={{ paddingLeft: "50px", fontSize: "14px", fontWeight: 700, color: "#1e293b", lineHeight: "30px" }} 
            />
            {jenisList.map((jenis, index) => (
              <Bar 
                key={jenis} 
                dataKey={jenis} 
                name={jenis.replace(/_/g, " ")} 
                fill={CONTRAST_COLORS[index % CONTRAST_COLORS.length]} 
                radius={[4, 4, 0, 0]} 
                activeBar={{ stroke: '#000', strokeWidth: 2, fillOpacity: 0.9 }} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}