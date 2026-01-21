// frontend/src/components/TrendLolosPerTahun.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Label
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

  if (loading) return <div style={{ padding: 24, color: "#64748b", fontSize: "16px" }}>Memuat tren kelulusan...</div>;

  return (
    <div style={{ width: "100%" }}>
      {/* ===== HEADER SECTION ===== */}
      <div style={{
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "2px solid #e2e8f0"
      }}>
        {/* Ukuran font judul ditingkatkan ke 24px */}
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>
          Trend Lolos Tahunan
        </h2>
        {/* Ukuran font sub-judul ditingkatkan ke 16px */}
        <p style={{ fontSize: 16, color: "#475569", margin: "6px 0 0 0" }}>
          Statistik pertumbuhan total penerima beasiswa per periode
        </p>
      </div>

      {/* ===== CHART SECTION ===== */}
      <div style={{ 
        background: "#ffffff", 
        borderRadius: 12, 
        padding: "32px", // Padding kontainer ditingkatkan
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
      }}>
        <ResponsiveContainer width="100%" height={450}> {/* Tinggi chart ditingkatkan */}
          {/* Margin disesuaikan untuk menampung label yang lebih besar */}
          <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
            
            <XAxis 
              dataKey="tahun" 
              axisLine={{ stroke: '#475569', strokeWidth: 2 }}
              tickLine={{ stroke: '#475569' }}
              // Font tick sumbu X ditingkatkan ke 14px
              tick={{ fill: '#0f172a', fontSize: 14, fontWeight: 700 }}
              dy={10}
            >
              <Label 
                value="Tahun" 
                offset={-25} 
                position="insideBottom" 
                // Font label sumbu X ditingkatkan ke 17px
                style={{ fill: '#475569', fontSize: 17 }} 
              />
            </XAxis>
            
            <YAxis 
              axisLine={{ stroke: '#475569', strokeWidth: 2 }}
              tickLine={{ stroke: '#475569' }}
              // Font tick sumbu Y ditingkatkan ke 14px
              tick={{ fill: '#0f172a', fontSize: 14, fontWeight: 600 }}
            >
              <Label 
                value="Jumlah Mahasiswa" 
                angle={-90} 
                position="insideLeft" 
                // Font label sumbu Y ditingkatkan ke 17px
                style={{ textAnchor: 'middle', fill: '#475569', fontSize: 17}} 
              />
            </YAxis>
            
            <Tooltip 
              contentStyle={{ 
                borderRadius: '10px', 
                border: '1px solid #cbd5e1', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                fontSize: '15px', // Font tooltip ditingkatkan
                fontWeight: 700
              }}
            />
            
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ 
                paddingBottom: 30, 
                fontSize: "16px", // Font legend ditingkatkan
                fontWeight: 700, 
                color: "#0f172a" 
              }}
            />

            <Line
              type="monotone"
              dataKey="total_lolos"
              name="Total Lolos"
              stroke="#00a65a"
              strokeWidth={5} // Garis dipertebal
              dot={{ r: 7, fill: "#00a65a", strokeWidth: 2, stroke: "#fff" }} // Titik diperbesar
              activeDot={{ r: 9, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ===== FOOTER INFO ===== */}
      <div style={{ 
        marginTop: 24, 
        padding: "16px 20px", 
        background: "#f8fafc", 
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        fontSize: "15px", // Font footer ditingkatkan
        color: "#64748b",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <span style={{ fontSize: "18px" }}>💡</span> 
        <span>Grafik ini menampilkan total akumulasi peserta yang lolos dari seluruh jenis beasiswa per tahun ajaran.</span>
      </div>
    </div>
  );
}