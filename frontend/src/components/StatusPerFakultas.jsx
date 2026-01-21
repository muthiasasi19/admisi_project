// StatusPerFakultas.jsx
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

const API_URL = "http://127.0.0.1:8000/analytics/camaru-beasiswa/status-per-fakultas";
const darkGreen = "#064e3b";

export default function StatusPerFakultas({ showTable = false }) {
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
        console.error("Error fetch status per fakultas:", err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const applyFilter = (rawData, tahun) => {
    const filtered = rawData
      .filter((item) => Number(item.tahun) === Number(tahun))
      .map((item) => ({
        fakultas: item.fakultas,
        Lolos: item.lolos ?? 0,
        "Tidak Lolos": item.tidak_lolos ?? 0
      }));
    setData(filtered);
  };

  const handleChangeTahun = (e) => {
    const year = Number(e.target.value);
    setTahunAktif(year);
    applyFilter(allData, year);
  };

  if (loading) return <div style={{ padding: 24, color: "#64748b" }}>Memuat statistik fakultas...</div>;

  const dynamicHeight = Math.max(500, data.length * 60);

  return (
    <div style={{ width: "100%" }}>
      {/* ===== HEADER & FILTER SECTION ===== */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "2px solid #e2e8f0"
      }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Status Kelulusan per Fakultas
          </h2>
          <p style={{ fontSize: 16, color: "#475569", margin: "4px 0 0 0" }}>
            Analisis sebaran pendaftar Lolos vs Tidak Lolos Beasiswa setiap Fakultas
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
            Tahun
          </label>
          <select
            value={tahunAktif ?? ""}
            onChange={handleChangeTahun}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              background: "#fff",
              fontSize: 15,
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

      {/* ===== CHART SECTION ===== */}
      <div style={{ 
        background: "#ffffff", 
        borderRadius: 16, 
        padding: "32px", 
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        maxHeight: "900px", 
        overflowY: "auto"
      }}>
        <div style={{ height: dynamicHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              layout="vertical" 
              margin={{ top: 10, right: 40, left: 30, bottom: 60 }} 
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#cbd5e1" />
              <XAxis 
                type="number"
                axisLine={{ stroke: '#475569', strokeWidth: 2 }}
                tick={{ fill: '#0f172a', fontSize: 14, fontWeight: 700 }}
              >
                <Label value="Jumlah Mahasiswa" offset={-40} position="insideBottom" style={{ fill: '#475569', fontSize: 18 }} />
              </XAxis>
              
              <YAxis 
                dataKey="fakultas"
                type="category"
                axisLine={{ stroke: '#475569', strokeWidth: 2 }}
                tick={{ fill: '#0f172a', fontSize: 13, fontWeight: 700 }}
                width={160} // Lebar sumbu dikurangi agar label lebih rapat
                interval={0}
              >
                <Label 
                  value="Fakultas" 
                  angle={-90} 
                  position="insideLeft" 
                  style={{ fontSize: 18, fill: '#475569', textAnchor: 'middle' }} 
                  offset={-20} // Offset dikurangi agar teks "Fakultas" lebih dekat ke sumbu
                />
              </YAxis>

              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', padding: '12px', fontWeight: 600 }}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                iconSize={14}
                wrapperStyle={{ paddingBottom: 35, fontSize: 15, fontWeight: 800 }}
              />
              <Bar dataKey="Lolos" stackId="a" fill="#00a65a" barSize={35} />
              <Bar dataKey="Tidak Lolos" stackId="a" fill="#dc2626" radius={[0, 6, 6, 0]} barSize={35} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== TABLE SECTION ===== */}
      {showTable && (
        <div style={{ 
          marginTop: 40,
          background: "#ffffff",
          borderRadius: 12,
          border: `1px solid #e2e8f0`,
          overflow: "hidden",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"
        }}>
          <div style={{ padding: "20px 24px", backgroundColor: darkGreen, textAlign: "center" }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#ffffff", margin: 0 }}>
              Detail Matriks Fakultas {tahunAktif}
            </h3>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9", borderBottom: `3px solid #cbd5e1` }}>
                  <th style={{ ...thStyle, textAlign: "left" }}>Fakultas</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Lolos</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Tidak Lolos</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => {
                  const total = row.Lolos + row["Tidak Lolos"];
                  return (
                    <tr key={row.fakultas} style={{ 
                      borderBottom: "1px solid #e2e8f0", 
                      backgroundColor: idx % 2 === 0 ? "#fff" : "#f8fafc"
                    }}>
                      <td style={{ ...tdStyle, fontWeight: 800, fontSize: 15, color: "#0f172a" }}>{row.fakultas}</td>
                      <td style={{ ...tdStyle, textAlign: "center", fontSize: 16 }}>
                        <span style={{ color: "#16a34a", fontWeight: 900 }}>{row.Lolos.toLocaleString()}</span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center", fontSize: 16 }}>
                        <span style={{ color: "#dc2626", fontWeight: 900 }}>{row["Tidak Lolos"].toLocaleString()}</span>
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 800, textAlign: "center", fontSize: 16, color: "#334155" }}>{total.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: "20px 24px",
  fontWeight: 900,
  fontSize: '15px',
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "#1e293b"
};

const tdStyle = {
  padding: "20px 24px",
  color: "#334155"
};