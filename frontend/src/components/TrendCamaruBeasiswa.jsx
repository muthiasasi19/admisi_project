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
  Label // Import Label ditambahkan
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
        <p style={{ color: "#64748b", fontSize: 16 }}>Memuat tren data...</p>
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
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>
          Trend Pendaftar Beasiswa
        </h2>
        <p style={{ fontSize: 16, color: "#475569", margin: "6px 0 0 0" }}>
          Visualisasi pertumbuhan pendaftar dan kelulusan per tahun ajaran
        </p>
      </div>

      {/* ===== CHART SECTION ===== */}
      <div style={{ background: "#ffffff", borderRadius: 12 }}>
        <ResponsiveContainer width="100%" height={450}>
          {/* Margin bottom dan left ditingkatkan untuk memberi ruang label sumbu */}
          <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            
            <XAxis 
              dataKey="thajaranid" 
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
              tickLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#475569', fontSize: 14, fontWeight: 600 }}
              padding={{ left: 30, right: 30 }}
              dy={10}
            >
              {/* Label Sumbu X */}
              <Label 
                value="Tahun" 
                offset={-25} 
                position="insideBottom" 
                style={{ fill: '#475569', fontSize: 16}} 
              />
            </XAxis>
            
            <YAxis 
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
              tickLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#475569', fontSize: 14, fontWeight: 600 }}
            >
              {/* Label Sumbu Y */}
              <Label 
                value="Jumlah Mahasiswa" 
                angle={-90} 
                position="insideLeft" 
                offset={-10}
                style={{ textAnchor: 'middle', fill: '#475569', fontSize: 16 }} 
              />
            </YAxis>
            
            <Tooltip 
              contentStyle={{ 
                borderRadius: '10px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                fontSize: '15px',
                fontWeight: 600
              }}
              itemStyle={{ padding: '4px 0' }}
            />
            
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ paddingBottom: 30, fontSize: 14, fontWeight: 700 }}
            />

            <Line
              type="monotone"
              dataKey="total_beasiswa"
              name="Total Pendaftar"
              stroke="#6366f1"
              strokeWidth={4}
              dot={{ r: 5, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
            
            <Line
              type="monotone"
              dataKey="lolos"
              name="Lolos"
              stroke="#10b981"
              strokeWidth={4}
              dot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
            
            <Line
              type="monotone"
              dataKey="tidak_lolos"
              name="Tidak Lolos"
              stroke="#fb7185"
              strokeWidth={4}
              dot={{ r: 5, fill: "#fb7185", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* ===== INSIGHT MINI ===== */}
      <div style={{ 
        marginTop: 24, 
        padding: "16px 20px", 
        background: "#f8fafc", 
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        display: "flex",
        gap: "24px"
      }}>
        <div style={{ fontSize: "14px", color: "#64748b" }}>
            💡 <span style={{ fontWeight: 600, color: "#475569" }}>Tip:</span> Arahkan kursor ke titik grafik untuk melihat detail angka per tahun.
        </div>
      </div>
    </div>
  );
}