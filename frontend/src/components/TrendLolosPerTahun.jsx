// frontend/src/components/TrendLolosPerTahun.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TrendLolosPerTahun() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/analytics/camaru-beasiswa/trend-lolos-per-jenis")
      .then(res => {
        const grouped = {};
        res.data.forEach(item => {
          if (!grouped[item.tahun]) grouped[item.tahun] = 0;
          grouped[item.tahun] += item.total_lolos;
        });

        // Pastikan data terurut berdasarkan tahun agar garis tidak berantakan
        const formatted = Object.keys(grouped)
          .map(tahun => ({
            tahun,
            total_lolos: grouped[tahun]
          }))
          .sort((a, b) => a.tahun - b.tahun);

        setData(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 24, color: "#64748b" }}>Memuat tren kelulusan...</div>;

  return (
    <div style={{ width: "100%" }}>
      {/* ===== HEADER SECTION ===== */}
      <div style={{
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "2px solid #e2e8f0"
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 }}>
          Trend Lolos Tahunan
        </h2>
        <p style={{ fontSize: 14, color: "#475569", margin: "4px 0 0 0" }}>
          Statistik pertumbuhan total penerima beasiswa per periode
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
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            {/* Grid horizontal tegas */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
            
            <XAxis 
              dataKey="tahun" 
              axisLine={{ stroke: '#475569', strokeWidth: 2 }} // Garis sumbu tegas
              tickLine={{ stroke: '#475569' }}
              tick={{ fill: '#0f172a', fontSize: 13, fontWeight: 700 }}
              dy={10}
            />
            
            <YAxis 
              axisLine={{ stroke: '#475569', strokeWidth: 2 }} // Garis sumbu tegas
              tickLine={{ stroke: '#475569' }}
              tick={{ fill: '#0f172a', fontSize: 13, fontWeight: 600 }}
            />
            
            <Tooltip 
              contentStyle={{ 
                borderRadius: '10px', 
                border: '1px solid #cbd5e1', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                fontWeight: 700
              }}
            />
            
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ 
                paddingBottom: 20, 
                fontSize: "14px", 
                fontWeight: 700, 
                color: "#0f172a" 
              }}
            />

            {/* Garis Lolos (Hijau Kontras Tinggi) */}
            <Line
              type="monotone"
              dataKey="total_lolos"
              name="Total Lolos"
              stroke="#00a65a" // Hijau Solid Kontras
              strokeWidth={4} // Garis dipertebal agar menonjol
              dot={{ r: 6, fill: "#00a65a", strokeWidth: 2, stroke: "#fff" }} // Titik dengan ring putih
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ===== FOOTER INFO ===== */}
      <div style={{ 
        marginTop: 20, 
        padding: "12px 16px", 
        background: "#f8fafc", 
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        fontSize: "13px",
        color: "#64748b",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        <span>💡</span> 
        <span>Grafik ini menampilkan total akumulasi peserta yang lolos dari seluruh jenis beasiswa per tahun ajaran.</span>
      </div>
    </div>
  );
}