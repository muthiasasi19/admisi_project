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

const API_URL = "http://127.0.0.1:8000/analytics/camaru-beasiswa/status-per-fakultas";

export default function StatusPerFakultas({ showTable = false }) {
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [tahunAktif, setTahunAktif] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(API_URL);
        const raw = res.data;
        if (!raw.length) {
          setLoading(false);
          return;
        }

        const years = [...new Set(raw.map((item) => Number(item.tahun)))].sort((a, b) => b - a);
        const defaultYear = years[0];

        setAllData(raw);
        setTahunList(years);
        setTahunAktif(defaultYear);
        applyFilter(raw, defaultYear);
        setLoading(false);
      } catch (err) {
        console.error("Error fetch status per fakultas:", err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const applyFilter = (rawData, tahun) => {
    const filtered = rawData
      .filter((item) => Number(item.tahun) === Number(tahun))
      .map((item) => ({
        fakultas: item.fakultas,
        Lolos: item.lolos ?? 0,
        "Tidak Lolos": item.tidak_lolos ?? 0
      }));
    setData(filtered);
  };

  const handleChangeTahun = (e) => {
    const year = Number(e.target.value);
    setTahunAktif(year);
    applyFilter(allData, year);
  };

  if (loading) return <div style={{ padding: 24, color: "#64748b" }}>Memuat statistik fakultas...</div>;

  // 🔥 SOLUSI ANTI-TUMPUK: Hitung tinggi dinamis berdasarkan jumlah fakultas
  // Setiap baris diberikan ruang sekitar 50px
  const dynamicHeight = Math.max(400, data.length * 50);

  return (
    <div style={{ width: "100%" }}>
      {/* ===== HEADER & FILTER SECTION ===== */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "2px solid #e2e8f0"
      }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Status Kelulusan per Fakultas
          </h2>
          <p style={{ fontSize: 14, color: "#475569", margin: "4px 0 0 0" }}>
            Analisis sebaran pendaftar Lolos vs Tidak Lolos Beasiswa setiap Fakultas
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
            Pilih Tahun
          </label>
          <select
            value={tahunAktif ?? ""}
            onChange={handleChangeTahun}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              background: "#fff",
              fontSize: 14,
              fontWeight: 700,
              color: "#1e293b",
              cursor: "pointer",
              outline: "none"
            }}
          >
            {tahunList.map((tahun) => (
              <option key={tahun} value={tahun}>Tahun {tahun}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== CHART SECTION ===== */}
      <div style={{ 
        background: "#ffffff", 
        borderRadius: 16, 
        padding: "24px", 
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        maxHeight: "700px", // Batasi tinggi card agar tidak terlalu panjang
        overflowY: "auto"   // Tambahkan scroll jika fakultas sangat banyak
      }}>
        <div style={{ height: dynamicHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              layout="vertical" // 🔥 Ubah ke Horizontal
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#cbd5e1" />
              
              {/* Sumbu X menjadi nilai angka */}
              <XAxis 
                type="number"
                axisLine={{ stroke: '#475569', strokeWidth: 2 }}
                tickLine={{ stroke: '#475569' }} 
                tick={{ fill: '#0f172a', fontSize: 12, fontWeight: 700 }}
              />
              
              {/* Sumbu Y menjadi nama fakultas */}
              <YAxis 
                dataKey="fakultas"
                type="category"
                axisLine={{ stroke: '#475569', strokeWidth: 2 }}
                tickLine={{ stroke: '#475569' }} 
                tick={{ fill: '#0f172a', fontSize: 11, fontWeight: 600 }}
                width={180} // Lebar sumbu Y diperbesar agar nama tidak terpotong
                interval={0} // Paksa tampilkan semua nama fakultas
              />
              
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: '1px solid #cbd5e1', 
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  fontSize: '12px'
                }}
              />
              
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ paddingBottom: 25, fontSize: 12, fontWeight: 700 }}
              />

              <Bar dataKey="Lolos" stackId="a" fill="#00a65a" barSize={25} />
              <Bar dataKey="Tidak Lolos" stackId="a" fill="#dc2626" radius={[0, 4, 4, 0]} barSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== TABLE SECTION ===== */}
      {showTable && (
        <div style={{ marginTop: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 4, height: 16, background: "#6366f1", borderRadius: 4 }}></div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: 0 }}>
              Detail Matriks Fakultas {tahunAktif}
            </h3>
          </div>

          <div style={{ overflowX: "auto", borderRadius: 12, border: "2px solid #e2e8f0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: "#1e293b" }}>
                  <th style={{ ...thStyle, color: "#fff" }}>Fakultas</th>
                  <th style={{ ...thStyle, color: "#fff" }}>Lolos</th>
                  <th style={{ ...thStyle, color: "#fff" }}>Tidak Lolos</th>
                  <th style={{ ...thStyle, color: "#fff" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => {
                  const total = row.Lolos + row["Tidak Lolos"];
                  return (
                    <tr key={row.fakultas} style={{ 
                      borderBottom: "1px solid #e2e8f0", 
                      backgroundColor: idx % 2 === 0 ? "#fff" : "#f8fafc"
                    }}>
                      <td style={{ ...tdStyle, fontWeight: 700, color: "#0f172a" }}>{row.fakultas}</td>
                      <td style={tdStyle}>
                        <span style={{ color: "#16a34a", fontWeight: 800 }}>{row.Lolos.toLocaleString()}</span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ color: "#dc2626", fontWeight: 800 }}>{row["Tidak Lolos"].toLocaleString()}</span>
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{total.toLocaleString()}</td>
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
  textAlign: "left",
  fontWeight: 700,
  fontSize: '11px',
  textTransform: "uppercase",
  letterSpacing: "0.05em"
};

const tdStyle = {
  padding: "16px 20px",
  color: "#334155"
};