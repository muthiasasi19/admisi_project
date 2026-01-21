import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Label
} from "recharts";
import axios from "axios";

// Palet warna dengan kontras tinggi
const COLOR_PALETTE = [
  { lolos: "#0088FE", tidak: "#c0392b" },
  { lolos: "#00C49F", tidak: "#c0392b" },
  { lolos: "#FFBB28", tidak: "#c0392b" },
  { lolos: "#FF8042", tidak: "#c0392b" },
  { lolos: "#8884d8", tidak: "#c0392b" },
  { lolos: "#82ca9d", tidak: "#c0392b" },
  { lolos: "#FF6699", tidak: "#c0392b" },
  { lolos: "#003f5c", tidak: "#c0392b" },
  { lolos: "#bc5090", tidak: "#c0392b" },
  { lolos: "#ffa600", tidak: "#c0392b" },
  { lolos: "#488f31", tidak: "#c0392b" },
  { lolos: "#de425b", tidak: "#c0392b" },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const fullKey = payload[0].dataKey;
    const prefix = fullKey.split('_').slice(0, -1).join(' ');
    const dataObj = payload[0].payload;
    
    const cleanPrefix = fullKey.split('_').slice(0, -1).join('_');
    const lolosVal = dataObj[`${cleanPrefix}_lolos`] || 0;
    const tidakVal = dataObj[`${cleanPrefix}_tidak`] || 0;

    return (
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '12px', 
        border: '1px solid #cbd5e1', 
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' 
      }}>
        <p style={{ fontWeight: 800, margin: '0 0 8px 0', fontSize: '15px', color: '#0f172a' }}>
          {prefix.replace(/_/g, " ")}
        </p>
        <p style={{ margin: 0, fontSize: '14px', color: '#16a34a' }}>
          Lolos: <strong>{lolosVal}</strong>
        </p>
        <p style={{ margin: 0, fontSize: '14px', color: '#dc2626' }}>
          Tidak Lolos: <strong>{tidakVal}</strong>
        </p>
      </div>
    );
  }
  return null;
};

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
          const jenis = item.jenis_beasiswa.replace(/\s+/g, "_").replace(/[^\w]/g, "");
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
        console.error("Error fetch:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 24, color: "#64748b", fontSize: '16px' }}>Loading data tren...</div>;

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
      
      <div style={{ 
        paddingTop: 24, 
        marginBottom: 8, 
        paddingBottom: 16, 
        borderBottom: "2px solid #e2e8f0" 
      }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>
          Trend Lolos berdasarkan Jenis Beasiswa
        </h2>
        <p style={{ fontSize: 16, color: "#475569", margin: "6px 0 0 0" }}>
          Visualisasi Jumlah Lolos dan Gagal per Jenis Beasiswa dalam setiap Tahun
        </p>
      </div>

      <div style={{ 
        background: "#ffffff", 
        borderRadius: 12, 
        padding: "24px", 
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", 
        display: "flex", 
        gap: "24px", 
        alignItems: "flex-start" 
      }}>
        <div style={{ flex: 1, height: 550 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 20, right: 10, left: 30, bottom: 50 }}
              barCategoryGap="15%" 
              barGap={0}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
              
              <XAxis 
                dataKey="tahun" 
                axisLine={{ stroke: '#475569', strokeWidth: 2 }}
                tickLine={{ stroke: '#475569' }}
                tick={{ fill: '#0f172a', fontSize: 14, fontWeight: 700 }}
              >
                <Label 
                  value="Tahun" 
                  position="insideBottom" 
                  offset={-35} 
                  style={{ textAnchor: 'middle', fill: '#475569', fontSize: 18 }} 
                />
              </XAxis>

              <YAxis 
                domain={[0, 1550]}
                axisLine={{ stroke: '#475569', strokeWidth: 2 }}
                tickLine={{ stroke: '#475569' }}
                tick={{ fill: '#0f172a', fontSize: 14, fontWeight: 600 }}
              >
                <Label 
                  value="Jumlah Mahasiswa" 
                  angle={-90} 
                  position="insideLeft" 
                  offset={-20} 
                  style={{ textAnchor: 'middle', fill: '#475569', fontSize: 18 }} 
                />
              </YAxis>

              <Tooltip 
                content={<CustomTooltip />}
                shared={false} 
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
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
                    barSize={20} 
                    activeBar={{ stroke: '#000', strokeWidth: 1, fillOpacity: 0.9 }}
                  />,
                  <Bar 
                    key={`${j}-tidak`} 
                    dataKey={`${j}_tidak`} 
                    fill={colors.tidak} 
                    radius={[2, 2, 0, 0]} 
                    barSize={20} 
                    activeBar={{ stroke: '#000', strokeWidth: 1, fillOpacity: 0.9 }}
                  />
                ];
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ 
          width: "350px", 
          maxHeight: "550px", 
          overflowY: "auto", 
          padding: "20px", 
          borderLeft: "2px solid #f1f5f9", 
          background: "#fcfdfe", 
          borderRadius: "0 8px 8px 0" 
        }}>
          <h4 style={{ margin: "0 0 20px 0", fontSize: "15px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>
            Jenis Beasiswa
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {jenisList.map((j, index) => {
              const colors = COLOR_PALETTE[index % COLOR_PALETTE.length];
              return (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "14px" }}>
                  <div style={{ 
                    width: 14, 
                    height: 14, 
                    background: colors.lolos, 
                    borderRadius: "3px",
                    flexShrink: 0,
                    boxShadow: "0 0 2px rgba(0,0,0,0.2)"
                  }}></div>
                  <span style={{ color: "#334155", fontWeight: 600, lineHeight: "1.4" }}>
                    {j.replace(/_/g, " ")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}