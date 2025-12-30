// src/components/TrendPendaftarPerJenis.jsx

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

const COLORS = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf"
];

export default function TrendPendaftarPerJenis({ showTable = false }) {
  const [data, setData] = useState([]);
  const [jenisList, setJenisList] = useState([]);

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
      } catch (err) {
        console.error("Error fetch trend per jenis:", err);
      }
    }

    fetchData();
  }, []);

  return (
    <div style={{ width: "100%", padding: 24 }}>
      <h2>Trend Pendaftar Beasiswa per Tahun per Jenis</h2>

      {/* ================= CHART ================= */}
      <ResponsiveContainer width="100%" height={420}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 220, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tahun" />
          <YAxis />
          <Tooltip />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ fontSize: 12 }}
          />

          {jenisList.map((jenis, index) => (
            <Bar
              key={jenis}
              dataKey={jenis}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* ================= TABLE (VERTIKAL JENIS) ================= */}
      {showTable && (
        <div style={{ marginTop: 32 }}>
          <h3>Detail Data Pendaftar Beasiswa</h3>

          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>Jenis Beasiswa</th>
                {data.map((row) => (
                  <th key={row.tahun} style={th}>
                    {row.tahun}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {jenisList.map((jenis) => (
                <tr key={jenis}>
                  <td style={{ ...td, fontWeight: 600 }}>
                    {jenis.replace(/_/g, " ")}
                  </td>

                  {data.map((row) => (
                    <td key={row.tahun} style={td}>
                      {row[jenis] ?? 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ================= STYLE ================= */

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 14
};

const th = {
  border: "1px solid #e5e7eb",
  padding: 8,
  background: "#f1f5f9",
  textAlign: "center"
};

const td = {
  border: "1px solid #e5e7eb",
  padding: 8,
  textAlign: "center"
};
