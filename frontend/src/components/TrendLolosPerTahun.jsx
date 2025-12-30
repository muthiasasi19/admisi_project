// frontend/src/components/TrendLolosPerTahun.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TrendLolosPerTahun() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(
      "http://127.0.0.1:8000/analytics/camaru-beasiswa/trend-lolos-per-jenis"
    )
    .then(res => {
      const grouped = {};

      res.data.forEach(item => {
        if (!grouped[item.tahun]) grouped[item.tahun] = 0;
        grouped[item.tahun] += item.total_lolos;
      });

      const formatted = Object.keys(grouped).map(tahun => ({
        tahun,
        total_lolos: grouped[tahun]
      }));

      console.log("Trend Lolos:", formatted);
      setData(formatted);
    })
    .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ width: "100%", height: 400, padding: 20 }}>
      <h2>Trend Lolos Beasiswa per Tahun</h2>

      <ResponsiveContainer width="90%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="tahun" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="total_lolos"
            stroke="#16a34a"
            name="Total Lolos"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
