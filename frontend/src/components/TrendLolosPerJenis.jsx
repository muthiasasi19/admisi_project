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

const COLOR_PALETTE = [
  { lolos: "#003f5c", tidak: "#de425b" },
  { lolos: "#00a65a", tidak: "#f39c12" },
  { lolos: "#8e44ad", tidak: "#2c3e50" },
  { lolos: "#d35400", tidak: "#16a085" },
  { lolos: "#2980b9", tidak: "#c0392b" },
  { lolos: "#27ae60", tidak: "#f1c40f" },
  { lolos: "#e67e22", tidak: "#7f8c8d" },
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
      <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "2px solid #e2e8f0" }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 }}>
          Trend Kelulusan per Jenis Beasiswa
        </h2>
        <p style={{ fontSize: 14, color: "#475569", margin: "4px 0 0 0" }}>
          Analisis komparatif pendaftar dengan layout legenda terpisah
        </p>
      </div>

      <div style={{ 
        background: "#ffffff", 
        borderRadius: 12, 
        padding: "24px", 
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        display: "flex", 
        gap: "20px",
        alignItems: "flex-start"
      }}>
        
        <div style={{ flex: 1, height: 500 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
              // Menambahkan gap antar kategori tahun agar tidak terlalu renggang
              barCategoryGap="15%" 
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
              <XAxis 
                dataKey="tahun" 
                axisLine={{ stroke: '#475569', strokeWidth: 2 }}
                tickLine={{ stroke: '#475569' }}
                tick={{ fill: '#0f172a', fontSize: 13, fontWeight: 700 }}
              />
              <YAxis 
                axisLine={{ stroke: '#475569', strokeWidth: 2 }}
                tickLine={{ stroke: '#475569' }}
                tick={{ fill: '#0f172a', fontSize: 13, fontWeight: 600 }}
              />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              
              <Legend content={() => null} />

              {jenisList.map((j, index) => {
                const colors = COLOR_PALETTE[index % COLOR_PALETTE.length];
                return [
                  <Bar 
                    key={`${j}-lolos`} 
                    dataKey={`${j}_lolos`} 
                    fill={colors.lolos} 
                    radius={[2, 2, 0, 0]} 
                    // Ukuran batang diperbesar (sebelumnya default sangat tipis)
                    barSize={18} 
                  />,
                  <Bar 
                    key={`${j}-tidak`} 
                    dataKey={`${j}_tidak`} 
                    fill={colors.tidak} 
                    radius={[2, 2, 0, 0]} 
                    // Ukuran batang diperbesar
                    barSize={18} 
                  />
                ];
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ 
          width: "320px", 
          maxHeight: "500px", 
          overflowY: "auto", 
          padding: "10px",
          borderLeft: "2px solid #f1f5f9",
          background: "#fcfdfe",
          borderRadius: "0 8px 8px 0"
        }}>
          <h4 style={{ margin: "0 0 15px 0", fontSize: "14px", color: "#64748b", textTransform: "uppercase" }}>Legenda Kategori</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {jenisList.map((j, index) => {
              const colors = COLOR_PALETTE[index % COLOR_PALETTE.length];
              const readableName = j.replace(/_/g, " ");
              return (
                <div key={j} style={{ fontSize: "12px", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
                  <div style={{ fontWeight: 700, color: "#1e293b", marginBottom: "4px" }}>{readableName}</div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <div style={{ width: 10, height: 10, background: colors.lolos, borderRadius: "2px" }}></div>
                      <span>Lolos</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <div style={{ width: 10, height: 10, background: colors.tidak, borderRadius: "2px" }}></div>
                      <span>Gagal</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showTable && (
        <div style={{ marginTop: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 6, height: 20, background: "#0f172a", borderRadius: 2 }}></div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>Matriks Detail Kelulusan</h3>
          </div>
          <div style={{ overflowX: "auto", borderRadius: 8, border: "2px solid #e2e8f0" }}>
             {/* Konten tabel kamu */}
          </div>
        </div>
      )}
    </div>
  );
}