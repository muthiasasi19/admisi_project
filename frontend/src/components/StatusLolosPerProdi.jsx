// StatusLolosPerProdi.jsx
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

const API_URL = "http://127.0.0.1:8000/analytics/camaru-beasiswa/status-per-prodi";
const darkGreen = "#064e3b";

export default function StatusLolosPerProdi({ showTable = false }) {
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

        if (!raw || raw.length === 0) {
          setLoading(false);
          return;
        }

        const years = [...new Set(raw.map(item => Number(item.tahun)))].sort((a, b) => b - a);
        const defaultYear = years[0];

        setAllData(raw);
        setTahunList(years);
        setTahunAktif(defaultYear);
        setData(raw.filter(item => Number(item.tahun) === defaultYear));
        setLoading(false);
      } catch (err) {
        console.error("Error fetch status per prodi:", err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChangeTahun = (e) => {
    const year = Number(e.target.value);
    setTahunAktif(year);
    setData(allData.filter(item => Number(item.tahun) === year));
  };

  if (loading) {
    return <div style={{ padding: 24, color: "#64748b", fontSize: "16px" }}>Memuat statistik prodi...</div>;
  }

  const dynamicHeight = Math.max(600, data.length * 55);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
      
      {/* ===== HEADER & FILTER ===== */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingBottom: 20,
        borderBottom: "2px solid #e2e8f0"
      }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Status Kelulusan per Prodi
          </h2>
          <p style={{ fontSize: 16, color: "#475569", margin: "6px 0 0 0" }}>
            Analisis sebaran pendaftar Lolos vs Tidak Lolos Beasiswa setiap Program Studi
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Tahun
          </label>
          <select
            value={tahunAktif ?? ""}
            onChange={handleChangeTahun}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              border: "2px solid #cbd5e1",
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

      {/* ===== CHART CARD ===== */}
      <div style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: "32px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
        maxHeight: "950px",
        overflowY: "auto"
      }}>
        <div style={{ height: dynamicHeight, minWidth: "700px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              /* Margin left dikurangi agar chart lebih rapat ke kiri */
              margin={{ top: 10, right: 40, left: 40, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#cbd5e1" />
              <XAxis
                type="number"
                axisLine={{ stroke: "#475569", strokeWidth: 2 }}
                tickLine={{ stroke: "#475569" }}
                tick={{ fill: "#0f172a", fontSize: 14, fontWeight: 700 }}
              >
                <Label 
                  value="Jumlah Mahasiswa" 
                  position="insideBottom" 
                  offset={-40} 
                  style={{ textAnchor: 'middle', fill: '#475569', fontSize: 18}} 
                />
              </XAxis>
              <YAxis
                type="category"
                dataKey="prodi"
                axisLine={{ stroke: "#475569", strokeWidth: 2 }}
                tickLine={{ stroke: "#475569" }}
                tick={{ fill: "#0f172a", fontSize: 13, fontWeight: 700 }}
                /* Width dikurangi dari 250 ke 180 untuk merapatkan jarak teks prodi ke sumbu */
                width={180}
                interval={0}
              >
                <Label 
                  value="Program Studi" 
                  angle={-90} 
                  position="insideLeft" 
                  /* Offset dikurangi agar label sumbu Y tidak terlalu jauh ke kiri */
                  offset={-30} 
                  style={{ textAnchor: 'middle', fill: '#475569', fontSize: 18 }} 
                />
              </YAxis>
              <Tooltip
                cursor={{ fill: "#f1f5f9" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  fontSize: "14px",
                  fontWeight: 600,
                  padding: "12px"
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={14}
                wrapperStyle={{ paddingBottom: "35px", fontSize: "15px", fontWeight: 800 }}
              />
              <Bar dataKey="lolos" stackId="a" fill="#00a65a" name="Lolos" barSize={30} />
              <Bar dataKey="tidak_lolos" stackId="a" fill="#dc2626" name="Tidak Lolos" barSize={30} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== TABLE CARD ===== */}
      {showTable && (
        <div style={{
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
          marginBottom: 40
        }}>
          <div style={{ padding: "20px 24px", background: darkGreen, textAlign: "center" }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#ffffff" }}>
              Detail Data Per Program Studi ({tahunAktif})
            </h3>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "3px solid #e2e8f0", background: "#f1f5f9" }}>
                  <th style={headerCellStyle}>Program Studi</th>
                  <th style={headerCellStyle}>Lolos</th>
                  <th style={headerCellStyle}>Tidak Lolos</th>
                  <th style={headerCellStyle}>Total Pendaftar</th>
                  <th style={headerCellStyle}>Persentase Diterima</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => {
                  const total = item.lolos + item.tidak_lolos;
                  const rate = total > 0 ? ((item.lolos / total) * 100).toFixed(1) : 0;

                  return (
                    <tr
                      key={item.prodi}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc"
                      }}
                    >
                      <td style={{ ...bodyCellStyle, fontWeight: 800, color: "#0f172a", fontSize: "15px" }}>{item.prodi}</td>
                      <td style={{ ...bodyCellStyle, color: "#16a34a", fontWeight: 900, fontSize: "16px" }}>{item.lolos.toLocaleString()}</td>
                      <td style={{ ...bodyCellStyle, color: "#dc2626", fontWeight: 900, fontSize: "16px" }}>{item.tidak_lolos.toLocaleString()}</td>
                      <td style={{ ...bodyCellStyle, fontWeight: 700, fontSize: "16px" }}>{total.toLocaleString()}</td>
                      <td style={bodyCellStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 800, fontSize: "15px", color: "#4f46e5" }}>
                          <div style={{ flex: 1, height: 10, background: "#e2e8f0", borderRadius: 5, minWidth: 80 }}>
                            <div style={{ height: "100%", background: "#6366f1", borderRadius: 5, width: `${rate}%` }} />
                          </div>
                          {rate}%
                        </div>
                      </td>
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

const headerCellStyle = {
  padding: "18px 24px",
  fontSize: "15px",
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  color: "#1e293b"
};

const bodyCellStyle = {
  padding: "18px 24px",
  fontSize: "15px",
  color: "#334155"
};