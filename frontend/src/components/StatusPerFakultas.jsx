// src/components/StatusPerFakultas.jsx

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

const API_URL =
  "http://127.0.0.1:8000/analytics/camaru-beasiswa/status-per-fakultas";

export default function StatusPerFakultas({ showTable = false }) {
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [tahunAktif, setTahunAktif] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(API_URL);
        const raw = res.data;

        if (!raw.length) return;

        const years = [
          ...new Set(raw.map((item) => Number(item.tahun)))
        ].sort((a, b) => b - a);

        const defaultYear = years[0];

        setAllData(raw);
        setTahunList(years);
        setTahunAktif(defaultYear);

        applyFilter(raw, defaultYear);
      } catch (err) {
        console.error("Error fetch status per fakultas:", err);
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

  return (
    <div style={{ width: "100%", padding: 24 }}>
      {/* ===== HEADER + FILTER ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12
        }}
      >
        <h2>
          Lolos vs Tidak Lolos per Fakultas
          {tahunAktif && ` - ${tahunAktif}`}
        </h2>

        <select
          value={tahunAktif ?? ""}
          onChange={handleChangeTahun}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #ccc"
          }}
        >
          {tahunList.map((tahun) => (
            <option key={tahun} value={tahun}>
              {tahun}
            </option>
          ))}
        </select>
      </div>

      {/* ===== GRAFIK ===== */}
      <ResponsiveContainer width="100%" height={420}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 180, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fakultas" />
          <YAxis />
          <Tooltip />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ fontSize: 12 }}
          />

          <Bar dataKey="Lolos" stackId="a" fill="#16a34a" />
          <Bar dataKey="Tidak Lolos" stackId="a" fill="#dc2626" />
        </BarChart>
      </ResponsiveContainer>

      {/* ===== TABEL (HANYA DI PAGE DETAIL) ===== */}
      {showTable && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ marginBottom: 12 }}>
            Detail Data Status Fakultas
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 14
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f1f5f9" }}>
                <th style={thStyle}>Fakultas</th>
                <th style={thStyle}>Lolos</th>
                <th style={thStyle}>Tidak Lolos</th>
                <th style={thStyle}>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const total = row.Lolos + row["Tidak Lolos"];
                return (
                  <tr key={row.fakultas}>
                    <td style={tdStyle}>{row.fakultas}</td>
                    <td style={tdStyle}>{row.Lolos}</td>
                    <td style={tdStyle}>{row["Tidak Lolos"]}</td>
                    <td style={tdStyle}>{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ===== STYLE HELPER ===== */
const thStyle = {
  border: "1px solid #e5e7eb",
  padding: "8px 12px",
  textAlign: "left"
};

const tdStyle = {
  border: "1px solid #e5e7eb",
  padding: "8px 12px"
};
