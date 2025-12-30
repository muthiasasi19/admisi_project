// frontend/src/components/Trend_camaru_beasiswa.jsx
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart // Digunakan jika ingin efek shading yang lebih pro
} from "recharts";

export default function TrendCamaruBeasiswa() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/analytics/camaru-beasiswa/trend")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
        <p style={{ color: "#64748b", fontSize: 14 }}>Memuat tren data...</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      {/* ===== HEADER SECTION ===== */}
      <div style={{
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "1px solid #f1f5f9"
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: 0 }}>
          Tren Pendaftar Beasiswa
        </h2>
        <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0 0" }}>
          Visualisasi pertumbuhan pendaftar dan kelulusan per tahun ajaran
        </p>
      </div>

      {/* ===== CHART SECTION ===== */}
      <div style={{ background: "#ffffff", borderRadius: 12 }}>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            {/* Grid minimalis */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            
            {/* Sumbu X dengan garis tegas */}
            <XAxis 
              dataKey="thajaranid" 
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
              tickLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
              padding={{ left: 30, right: 30 }}
            />
            
            {/* Sumbu Y dengan garis tegas */}
            <YAxis 
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
              tickLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
            />
            
            <Tooltip 
              contentStyle={{ 
                borderRadius: '10px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                fontSize: '13px'
              }}
              itemStyle={{ padding: '2px 0' }}
            />
            
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ paddingBottom: 20, fontSize: 12, fontWeight: 600 }}
            />

            {/* Garis Total Pendaftar (Indigo) */}
            <Line
              type="monotone"
              dataKey="total_beasiswa"
              name="Total Pendaftar"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            
            {/* Garis Lolos (Emerald) */}
            <Line
              type="monotone"
              dataKey="lolos"
              name="Lolos"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            
            {/* Garis Tidak Lolos (Rose) */}
            <Line
              type="monotone"
              dataKey="tidak_lolos"
              name="Tidak Lolos"
              stroke="#fb7185"
              strokeWidth={3}
              dot={{ r: 4, fill: "#fb7185", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* ===== INSIGHT MINI (Opsional) ===== */}
      <div style={{ 
        marginTop: 20, 
        padding: "12px 16px", 
        background: "#f8fafc", 
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        display: "flex",
        gap: "24px"
      }}>
        <div style={{ fontSize: "12px", color: "#64748b" }}>
           💡 <span style={{ fontWeight: 600, color: "#475569" }}>Tip:</span> Arahkan kursor ke titik grafik untuk melihat detail angka per tahun.
        </div>
      </div>
    </div>
  );
}