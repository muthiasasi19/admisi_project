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
    return <div style={{ padding: 24, color: "#64748b" }}>Memuat statistik prodi...</div>;
  }

  // Tinggi dinamis agar label prodi tidak tumpuk
  const dynamicHeight = Math.max(500, data.length * 45);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
      
      {/* ===== HEADER & FILTER ===== */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingBottom: 16,
        borderBottom: "2px solid #e2e8f0"
      }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Status Kelulusan per Prodi
          </h2>
          <p style={{ fontSize: 14, color: "#475569", margin: "4px 0 0 0" }}>
            Analisis sebaran pendaftar Lolos vs Tidak Lolos Beasiswa setiap Program Studi
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
            Pilih Periode
          </label>
          <select
            value={tahunAktif ?? ""}
            onChange={handleChangeTahun}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "2px solid #cbd5e1",
              background: "#fff",
              fontSize: 14,
              fontWeight: 700,
              color: "#1e293b",
              cursor: "pointer"
            }}
          >
            {tahunList.map((tahun) => (
              <option key={tahun} value={tahun}>Tahun Ajaran {tahun}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== CHART CARD ===== */}
      <div style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: "24px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        maxHeight: "800px",
        overflowY: "auto"
      }}>
        <div style={{ height: dynamicHeight, minWidth: "600px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#cbd5e1" />
              <XAxis
                type="number"
                axisLine={{ stroke: "#475569", strokeWidth: 2 }}
                tickLine={{ stroke: "#475569" }}
                tick={{ fill: "#0f172a", fontSize: 13, fontWeight: 700 }}
              />
              <YAxis
                type="category"
                dataKey="prodi"
                axisLine={{ stroke: "#475569", strokeWidth: 2 }}
                tickLine={{ stroke: "#475569" }}
                tick={{ fill: "#0f172a", fontSize: 11, fontWeight: 600 }}
                width={200}
                interval={0}
              />
              <Tooltip
                cursor={{ fill: "#f1f5f9" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: "20px", fontSize: "13px", fontWeight: 600 }}
              />
              <Bar dataKey="lolos" stackId="a" fill="#00a65a" name="Lolos" barSize={25} />
              <Bar dataKey="tidak_lolos" stackId="a" fill="#dc2626" name="Tidak Lolos" barSize={25} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== TABLE CARD (SAMA LOGIKA DENGAN STATUS FAKULTAS) ===== */}
      {showTable && (
        <div style={{
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
        }}>
          <div style={{
            padding: "16px 24px",
            background: "#f8fafc",
            borderBottom: "1px solid #e2e8f0"
          }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
              Detail Data Per Program Studi ({tahunAktif})
            </h3>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                  <th style={cellStyle}>Program Studi</th>
                  <th style={cellStyle}>Lolos</th>
                  <th style={cellStyle}>Tidak Lolos</th>
                  <th style={cellStyle}>Total Pendaftar</th>
                  <th style={cellStyle}>Tingkat Kelulusan</th>
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
                        backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fcfdfe"
                      }}
                    >
                      <td style={{ ...cellStyle, fontWeight: 600 }}>{item.prodi}</td>
                      <td style={{ ...cellStyle, color: "#00a65a", fontWeight: 700 }}>{item.lolos}</td>
                      <td style={{ ...cellStyle, color: "#dc2626", fontWeight: 700 }}>{item.tidak_lolos}</td>
                      <td style={cellStyle}>{total}</td>
                      <td style={cellStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{
                            flex: 1,
                            height: 8,
                            background: "#e2e8f0",
                            borderRadius: 4,
                            maxWidth: 60
                          }}>
                            <div style={{
                              height: "100%",
                              background: "#6366f1",
                              borderRadius: 4,
                              width: `${rate}%`
                            }} />
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

const cellStyle = {
  padding: "14px 24px",
  fontSize: "14px",
  color: "#334155"
};
