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

// Palet warna Kontras Tinggi (High Contrast Solid Colors)
const CONTRAST_COLORS = [
  "#003f5c", // Dark Blue
  "#de425b", // Red
  "#00a65a", // Green
  "#f39c12", // Orange
  "#8e44ad", // Purple
  "#2c3e50", // Midnight Blue
  "#d35400", // Pumpkin
  "#16a085", // Teal
  "#c0392b", // Strong Red
  "#2980b9", // Bright Blue
  "#27ae60", // Bright Green
  "#f1c40f"  // Yellow
];

export default function TrendPendaftarPerJenis({ showTable = false }) {
  const [data, setData] = useState([]);
  const [jenisList, setJenisList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/analytics/camaru-beasiswa/trend-per-jenis"
        );

        const raw = res.data;
        const grouped = {};
        const jenisSet = new Set();

        raw.forEach((item) => {
          const tahun = item.tahun;
          const key = item.jenis_beasiswa
            .replace(/\s+/g, "_")
            .replace(/[^\w]/g, "");

          jenisSet.add(key);

          if (!grouped[tahun]) grouped[tahun] = { tahun };
          grouped[tahun][key] = item.total_pendaftar;
        });

        const jenisArray = Array.from(jenisSet);

        const finalData = Object.values(grouped)
          .map((row) => {
            jenisArray.forEach((j) => {
              if (row[j] === undefined) row[j] = 0;
            });
            return row;
          })
          .sort((a, b) => a.tahun - b.tahun);

        setJenisList(jenisArray);
        setData(finalData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetch trend per jenis:", err);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 24, color: "#64748b" }}>Memuat data trend...</div>;

  return (
    <div style={{ width: "100%" }}>
      {/* ===== HEADER SECTION ===== */}
      <div style={{
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "2px solid #e2e8f0"
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 }}>
          Trend Pendaftar per Tahun & Jenis Beasiswa
        </h2>
        <p style={{ fontSize: 14, color: "#475569", margin: "4px 0 0 0" }}>
          Visualisasi jumlah pendaftaran berdasarkan kategori beasiswa
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
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={data}
            // Margin right besar (280) agar Legend yang panjang tidak menabrak grafik
            margin={{ top: 10, right: 280, left: 10, bottom: 20 }}
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
              iconType="rect" // Ikon kotak agar lebih tegas
              wrapperStyle={{ 
                paddingLeft: "50px", // Jarak dari grafik
                fontSize: "13px",    // Ukuran tulisan diperbesar
                fontWeight: 600,
                color: "#1e293b",
                lineHeight: "26px"   // Jarak antar item legend
              }}
            />

            {jenisList.map((jenis, index) => (
              <Bar
                key={jenis}
                dataKey={jenis}
                name={jenis.replace(/_/g, " ")} // Nama bersih di Legend
                fill={CONTRAST_COLORS[index % CONTRAST_COLORS.length]}
                radius={[2, 2, 0, 0]} // Sedikit membulat di ujung atas
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
              Detail Data Pendaftar
            </h3>
          </div>

          <div style={{ overflowX: "auto", borderRadius: 8, border: "2px solid #e2e8f0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: "#1e293b" }}>
                  <th style={{ ...th, color: "#ffffff", textAlign: "left" }}>Kategori Beasiswa</th>
                  {data.map((row) => (
                    <th key={row.tahun} style={{ ...th, color: "#ffffff" }}>
                      {row.tahun}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jenisList.map((jenis, idx) => (
                  <tr key={jenis} style={{ 
                    backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                    borderBottom: "1px solid #e2e8f0"
                  }}>
                    <td style={{ ...td, textAlign: "left", fontWeight: 700, color: "#0f172a" }}>
                      {jenis.replace(/_/g, " ")}
                    </td>
                    {data.map((row) => (
                      <td key={row.tahun} style={{ ...td, fontWeight: 500 }}>
                        {row[jenis]?.toLocaleString() ?? 0}
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

/* ================= STYLE HELPERS ================= */

const th = {
  padding: "14px 20px",
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