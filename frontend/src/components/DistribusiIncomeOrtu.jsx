// components/DistribusiIncomeOrtu.jsx
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

// Palet warna kontras tinggi untuk kategori income
const CONTRAST_COLORS = {
  "0": "#2c3e50",        // Midnight Blue
  "0–5 jt": "#00a65a",   // Solid Green
  "5–10 jt": "#2980b9",  // Strong Blue
  "10–15 jt": "#f39c12", // Orange
  "15–20 jt": "#d35400", // Pumpkin
  ">20 jt": "#c0392b"    // Strong Red
};

export default function DistribusiIncomeOrtu({ showTable = false }) {
  const [data, setData] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/analytics/parent-distribution/income-camaru"
        );

        // Filter data tahun 2016
        const raw = res.data.filter((d) => Number(d.tahun) !== 2016);

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

  if (loading) return <div style={{ padding: 24, color: "#64748b" }}>Memuat distribusi data...</div>;

  return (
    <div style={{ width: "100%" }}>
      {/* ===== HEADER SECTION ===== */}
      <div style={{
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "2px solid #e2e8f0"
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 }}>
          Distribusi Pendapatan Orang Tua
        </h2>
        <p style={{ fontSize: 14, color: "#475569", margin: "4px 0 0 0" }}>
          Analisis kategori penghasilan orang tua mahasiswa baru per tahun ajaran
        </p>
      </div>

      {/* ===== CHART SECTION ===== */}
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
            margin={{ top: 10, right: 220, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
            
            <XAxis 
              dataKey="tahun" 
              axisLine={{ stroke: '#475569', strokeWidth: 2 }} // Garis tegas
              tickLine={{ stroke: '#475569' }}
              tick={{ fill: '#0f172a', fontSize: 13, fontWeight: 700 }}
              dy={10}
            />
            
            <YAxis 
              axisLine={{ stroke: '#475569', strokeWidth: 2 }} // Garis tegas
              tickLine={{ stroke: '#475569' }}
              tick={{ fill: '#0f172a', fontSize: 13, fontWeight: 600 }}
            />
            
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid #cbd5e1', 
                fontWeight: 600,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' 
              }}
            />
            
            <Legend 
              layout="vertical" 
              align="right" 
              verticalAlign="middle" 
              iconType="rect"
              wrapperStyle={{ 
                paddingLeft: "50px", 
                fontSize: "13px", // Ukuran tulisan legend diperbesar
                fontWeight: 600,
                color: "#1e293b",
                lineHeight: "28px"
              }}
            />

            {kategoriList.map((k) => (
              <Bar 
                key={k} 
                dataKey={k} 
                stackId="a" 
                fill={CONTRAST_COLORS[k] || "#ccc"} 
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== TABLE SECTION ===== */}
      {showTable && (
        <div style={{ marginTop: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 6, height: 20, background: "#0f172a", borderRadius: 2 }}></div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>
              Detail Matriks Pendapatan
            </h3>
          </div>

          <div style={{ overflowX: "auto", borderRadius: 8, border: "2px solid #e2e8f0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: "#1e293b" }}>
                  <th style={{ ...th, color: "#ffffff", textAlign: "left" }}>Kategori Income</th>
                  {data.map((d) => (
                    <th key={d.tahun} style={{ ...th, color: "#ffffff" }}>{d.tahun}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kategoriList.map((k, idx) => (
                  <tr key={k} style={{ 
                    backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                    borderBottom: "1px solid #e2e8f0"
                  }}>
                    <td style={{ ...td, textAlign: "left", fontWeight: 700, color: "#0f172a" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 12, height: 12, background: CONTRAST_COLORS[k] }}></div>
                        {k}
                      </div>
                    </td>
                    {data.map((d) => (
                      <td key={d.tahun} style={td}>
                        {d[k]?.toLocaleString() || 0}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const th = {
  padding: "16px 20px",
  fontWeight: 700,
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.05em"
};

const td = {
  padding: "14px 20px",
  color: "#334155",
  textAlign: "center"
};