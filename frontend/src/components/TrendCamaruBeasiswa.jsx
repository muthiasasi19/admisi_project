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
  Legend
} from "recharts";

export default function TrendCamaruBeasiswa() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/analytics/camaru-beasiswa/trend")
      .then(res => res.json())
      .then(json => {
        console.log("Trend Camaru:", json); // 🔍 debug
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading data...</p>;

  return (
    <div style={{ width: "100%", height: 400, padding: 20 }}>
      <h2>Trend Pendaftar Beasiswa per Tahun</h2>

      <ResponsiveContainer width="90%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="thajaranid" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="total_beasiswa"
            name="Total Pendaftar"
            stroke="#1f77b4"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="lolos"
            name="Lolos"
            stroke="#16a34a"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="tidak_lolos"
            name="Tidak Lolos"
            stroke="#dc2626"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
