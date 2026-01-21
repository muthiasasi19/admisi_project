// components/DistribusiProfesiOrtu.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Label // Ditambahkan untuk label sumbu
} from "recharts";

// Warna Kontras Tinggi
const CONTRAST_COLORS = [
  "#003f5c", "#de425b", "#00a65a", "#f39c12", 
  "#8e44ad", "#d40bd4", "#d35400", "#16a085", 
  "#c0392b", "#2980b9", "#27ae60", "#f1c40f"
];

export default function DistribusiProfesiMahasiswaParent({ showTable = false }) {
  const [data, setData] = useState([]);
  const [profesiList, setProfesiList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/analytics/parent-distribution/profesi-mahasiswa"
        );
        const raw = res.data.filter((d) => {
          const thn = Number(d.tahun);
          return thn >= 2019 && thn <= 2025;
        });

        const grouped = {};
        const profesiSet = new Set();

        raw.forEach(({ tahun, profesi, jumlah }) => {
          profesiSet.add(profesi);
          if (!grouped[tahun]) grouped[tahun] = { tahun };
          grouped[tahun][profesi] = jumlah;
        });

        const profesiArr = Array.from(profesiSet);

        const finalData = Object.values(grouped)
          .map((row) => {
            profesiArr.forEach((p) => {
              if (row[p] === undefined) row[p] = 0;
            });
            return row;
          })
          .sort((a, b) => a.tahun - b.tahun);

        setProfesiList(profesiArr);
        setData(finalData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetch data profesi:", err);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 24, color: "#64748b" }}>Memuat distribusi profesi...</div>;

  return (
    <div style={{ width: "100%" }}>
      {/* ===== HEADER SECTION ===== */}
      <div style={{
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "2px solid #e2e8f0"
      }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0 }}>
          Distribusi Profesi Orang Tua Mahasiswa
        </h2>
        <p style={{ fontSize: 15, color: "#475569", margin: "4px 0 0 0" }}>
            Jenis Profesi telah dipetakan menjadi menjadi beberapa kategori ( Contoh: petani & wiraswasta → Swasta, pegawai negeri → ASN, TNI/Militer → Militer) untuk konsistensi analisis.
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
            margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
            
            <XAxis 
              dataKey="tahun" 
              interval={0}
              axisLine={{ stroke: '#475569', strokeWidth: 2 }} 
              tickLine={{ stroke: '#475569' }}
              tick={{ fill: '#0f172a', fontSize: 14, fontWeight: 700 }}
              dy={10}
            >
              <Label 
                value="Tahun" 
                offset={-45} 
                position="insideBottom" 
                style={{ fontSize: 18, fill: '#64748b' }} 
              />
            </XAxis>
            
            <YAxis 
              axisLine={{ stroke: '#475569', strokeWidth: 2 }} 
              tickLine={{ stroke: '#475569' }}
              tick={{ fill: '#0f172a', fontSize: 14, fontWeight: 600 }}
            >
              <Label 
                value="Jumlah" 
                angle={-90} 
                position="insideLeft" 
                offset={-30} 
                style={{ fontSize: 18, fill: '#64748b' }} 
              />
            </YAxis>
            
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
                paddingLeft: "30px", 
                fontSize: "14px", 
                fontWeight: 600,
                color: "#1e293b",
                lineHeight: "28px"
              }}
            />

            {profesiList.map((p, i) => (
              <Bar 
                key={p} 
                dataKey={p} 
                barSize={40}
                stackId="a" 
                fill={CONTRAST_COLORS[i % CONTRAST_COLORS.length]} 
                radius={[0, 0, 0, 0]}
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
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>
              Detail Matriks Profesi
            </h3>
          </div>

          <div style={{ overflowX: "auto", borderRadius: 8, border: "2px solid #e2e8f0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
              <thead>
                <tr style={{ backgroundColor: "#1e293b" }}>
                  <th style={{ ...th, color: "#ffffff", textAlign: "left" }}>Daftar Profesi</th>
                  {data.map((d) => (
                    <th key={d.tahun} style={{ ...th, color: "#ffffff" }}>{d.tahun}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {profesiList.map((p, idx) => (
                  <tr key={p} style={{ 
                    backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                    borderBottom: "1px solid #e2e8f0"
                  }}>
                    <td style={{ ...td, textAlign: "left", fontWeight: 700, color: "#0f172a" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ 
                          width: 14, height: 14, 
                          background: CONTRAST_COLORS[idx % CONTRAST_COLORS.length] 
                        }}></div>
                        {p}
                      </div>
                    </td>
                    {data.map((d) => (
                      <td key={d.tahun} style={td}>
                        {d[p]?.toLocaleString() || 0}
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

const th = { padding: "18px 20px", fontWeight: 700, fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em" };
const td = { padding: "18px 20px", color: "#334155", textAlign: "center" };