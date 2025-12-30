import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import axios from "axios";

// Palette warna KONTRAS TINGGI (High Contrast)
// Lolos: Warna Solid, Tidak: Warna yang lebih gelap/kontras agar tetap beda
const COLOR_PALETTE = [
  { lolos: "#003f5c", tidak: "#de425b" }, // Navy vs Red
  { lolos: "#00a65a", tidak: "#f39c12" }, // Green vs Orange
  { lolos: "#8e44ad", tidak: "#2c3e50" }, // Purple vs Midnight
  { lolos: "#d35400", tidak: "#16a085" }, // Pumpkin vs Teal
  { lolos: "#2980b9", tidak: "#c0392b" }, // Blue vs Strong Red
  { lolos: "#27ae60", tidak: "#f1c40f" }, // Bright Green vs Yellow
  { lolos: "#e67e22", tidak: "#7f8c8d" }, // Orange vs Gray
];

export default function TrendLolosPerJenis({ showTable = false }) {
  const [data, setData] = useState([]);
  const [jenisList, setJenisList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/analytics/camaru-beasiswa/trend-lolos-per-jenis")
      .then((res) => {
        const raw = res.data;
        const grouped = {};
        const jenisSet = new Set();

        raw.forEach((item) => {
          const tahun = item.tahun;
          const jenis = item.jenis_beasiswa
            .replace(/\s+/g, "_")
            .replace(/[^\w]/g, "");

          jenisSet.add(jenis);

          if (!grouped[tahun]) grouped[tahun] = { tahun };

          grouped[tahun][`${jenis}_lolos`] = item.total_lolos;
          grouped[tahun][`${jenis}_tidak`] = item.total_tidak_lolos;
        });

        setData(Object.values(grouped).sort((a, b) => a.tahun - b.tahun));
        setJenisList(Array.from(jenisSet));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetch trend lolos per jenis:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 24, color: "#64748b" }}>Loading data tren...</div>;

  return (
    <div style={{ width: "100%" }}>
      {/* ===== HEADER SECTION ===== */}
      <div style={{
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "2px solid #e2e8f0"
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 }}>
          Trend Kelulusan per Jenis Beasiswa
        </h2>
        <p style={{ fontSize: 14, color: "#475569", margin: "4px 0 0 0" }}>
          Analisis komparatif pendaftar dengan warna kontras tinggi
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
            margin={{ top: 20, right: 280, left: 10, bottom: 20 }} 
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
            <XAxis 
              dataKey="tahun" 
              axisLine={{ stroke: '#475569', strokeWidth: 2 }}
              tickLine={{ stroke: '#475569' }}
              tick={{ fill: '#0f172a', fontSize: 13, fontWeight: 700 }}
              dy={10}
            />
            <YAxis 
              axisLine={{ stroke: '#475569', strokeWidth: 2 }}
              tickLine={{ stroke: '#475569' }}
              tick={{ fill: '#0f172a', fontSize: 13, fontWeight: 600 }}
            />
            
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid #cbd5e1', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                padding: '12px'
              }}
            />
            
            <Legend 
              layout="vertical" 
              align="right" 
              verticalAlign="middle" 
              iconType="rect"
              wrapperStyle={{ 
                paddingLeft: "50px", 
                fontSize: "13px",
                lineHeight: "26px",
                fontWeight: 600,
                color: "#1e293b"
              }}
            />

            {jenisList.map((j, index) => {
              const colors = COLOR_PALETTE[index % COLOR_PALETTE.length];
              const readableName = j.replace(/_/g, " ");

              return [
                <Bar
                  key={`${j}-lolos`}
                  dataKey={`${j}_lolos`}
                  name={`${readableName} (Lolos)`}
                  stackId={j}
                  fill={colors.lolos}
                  barSize={32}
                />,
                <Bar
                  key={`${j}-tidak`}
                  dataKey={`${j}_tidak`}
                  name={`${readableName} (Gagal)`}
                  stackId={j}
                  fill={colors.tidak}
                  radius={[2, 2, 0, 0]} 
                  barSize={32}
                />
              ];
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== TABLE SECTION ===== */}
      {showTable && (
        <div style={{ marginTop: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 6, height: 20, background: "#0f172a", borderRadius: 2 }}></div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>
              Matriks Detail Kelulusan
            </h3>
          </div>

          <div style={{ overflowX: "auto", borderRadius: 8, border: "2px solid #e2e8f0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ backgroundColor: "#1e293b" }}>
                  <th style={{ ...thStyle, color: "#ffffff", textAlign: "left" }}>Kategori Beasiswa</th>
                  {data.map((row) => (
                    <th key={row.tahun} style={{ ...thStyle, color: "#ffffff" }}>{row.tahun}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jenisList.map((jenis, index) => {
                  const colors = COLOR_PALETTE[index % COLOR_PALETTE.length];
                  return (
                    <tr key={jenis} style={{ 
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                      borderBottom: "1px solid #e2e8f0" 
                    }}>
                      <td style={{ ...tdStyle, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 12, height: 12, background: colors.lolos, border: "1px solid #000" }}></div>
                        {jenis.replace(/_/g, " ")}
                      </td>
                      {data.map((row) => (
                        <td key={row.tahun} style={{ ...tdStyle, textAlign: "center" }}>
                          <div style={{ 
                            display: "inline-flex", 
                            background: "#e2e8f0", 
                            borderRadius: "4px", 
                            padding: "4px 10px" 
                          }}>
                            <span style={{ color: colors.lolos, fontWeight: 800 }}>{row[`${jenis}_lolos`] ?? 0}</span>
                            <span style={{ margin: "0 6px", color: "#475569", fontWeight: 900 }}>/</span>
                            <span style={{ color: colors.tidak, fontWeight: 800 }}>{row[`${jenis}_tidak`] ?? 0}</span>
                          </div>
                        </td>
                      ))}
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
  fontWeight: 700,
  fontSize: '11px',
  textTransform: "uppercase",
  letterSpacing: "0.05em"
};

const tdStyle = {
  padding: "16px 20px",
  color: "#1e293b"
};