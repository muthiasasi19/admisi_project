// src/components/StatusPerFakultas.jsx

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

const API_URL = "http://127.0.0.1:8000/analytics/camaru-beasiswa/status-per-fakultas";

export default function StatusPerFakultas({ showTable = false }) {
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [tahunAktif, setTahunAktif] = useState(null);

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
      } catch (err) {
        console.error("Error fetch status per fakultas:", err);
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

  return (
    <div style={{ width: "100%" }}>
      {/* ===== HEADER & FILTER SECTION ===== */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "1px solid #f1f5f9"
      }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: 0 }}>
            Perbandingan Kelulusan
          </h2>
          <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0 0" }}>
            Distribusi status pendaftar berdasarkan fakultas
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
            Pilih Tahun
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
              color: "#334155",
              cursor: "pointer",
              outline: "none",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}
          >
            {tahunList.map((tahun) => (
              <option key={tahun} value={tahun}>Tahun {tahun}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== CHART SECTION ===== */}
      <div style={{ background: "#ffffff", borderRadius: 12 }}>
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            
            <XAxis 
              dataKey="fakultas" 
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }} // Garis sumbu X dipertebal
              tickLine={{ stroke: '#cbd5e1' }} 
              tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            
            <YAxis 
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }} // Garis sumbu Y dipertebal
              tickLine={{ stroke: '#cbd5e1' }} 
              tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
            />
            
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                fontSize: '12px'
              }}
            />
            
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ paddingBottom: 25, fontSize: 12, fontWeight: 600 }}
            />

            <Bar dataKey="Lolos" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} barSize={40} />
            <Bar dataKey="Tidak Lolos" stackId="a" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== TABLE SECTION ===== */}
      {showTable && (
        <div style={{ marginTop: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 4, height: 16, background: "#6366f1", borderRadius: 4 }}></div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", margin: 0 }}>
              Detail Data {tahunAktif}
            </h3>
          </div>

          <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", textAlign: "left" }}>
                  <th style={thStyle}>Fakultas</th>
                  <th style={thStyle}>Lolos</th>
                  <th style={thStyle}>Tidak Lolos</th>
                  <th style={thStyle}>Total Pendaftar</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => {
                  const total = row.Lolos + row["Tidak Lolos"];
                  return (
                    <tr key={row.fakultas} style={{ 
                      borderTop: "1px solid #e2e8f0", 
                      backgroundColor: idx % 2 === 0 ? "#fff" : "#f8fafc",
                      transition: "background-color 0.2s"
                    }}>
                      <td style={{ ...tdStyle, fontWeight: 600, color: "#1e293b" }}>{row.fakultas}</td>
                      <td style={tdStyle}>
                        <span style={{ 
                          padding: "4px 8px", 
                          background: "#f0fdf4", 
                          color: "#16a34a", 
                          borderRadius: "6px",
                          fontWeight: 700 
                        }}>{row.Lolos.toLocaleString()}</span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ 
                          padding: "4px 8px", 
                          background: "#fef2f2", 
                          color: "#dc2626", 
                          borderRadius: "6px",
                          fontWeight: 700 
                        }}>{row["Tidak Lolos"].toLocaleString()}</span>
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 500 }}>{total.toLocaleString()}</td>
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
  padding: "16px 20px",
  color: "#475569",
  fontWeight: 700,
  fontSize: '11px',
  textTransform: "uppercase",
  letterSpacing: "0.05em"
};

const tdStyle = {
  padding: "16px 20px",
  color: "#334155"
};