//componets/ParentProbabilityByProfesi.jsx

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
  "http://127.0.0.1:8000/analytics/profesi-probability/registrasi-by-profesi-per-tahun";

export default function ParentProbabilityByProfesi() {
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

        // ambil daftar tahun unik
        const years = [
          ...new Set(raw.map((item) => Number(item.tahun)))
        ].sort((a, b) => b - a);

        const defaultYear = years[0];

        setAllData(raw);
        setTahunList(years);
        setTahunAktif(defaultYear);

        applyFilter(raw, defaultYear);
      } catch (err) {
        console.error("Error fetch probability profesi:", err);
      }
    }

    fetchData();
  }, []);

  const applyFilter = (rawData, tahun) => {
    const filtered = rawData
      .filter((item) => Number(item.tahun) === Number(tahun))
      .map((item) => ({
        profesi: item.profesi,
        probabilitas: item.probabilitas,
        total_camaru: item.total_camaru,
        total_registrasi: item.total_registrasi
      }));

    setData(filtered);
  };

  const handleChangeTahun = (e) => {
    const year = Number(e.target.value);
    setTahunAktif(year);
    applyFilter(allData, year);
  };

  return (
    <div style={{ width: "100%", height: 560, padding: 0}}>
      {/* HEADER + FILTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12
        }}
      >
        <h2>
          Probabilitas Registrasi Berdasarkan Profesi Orang Tua
          {tahunAktif && ` - ${tahunAktif}`}
        </h2>

        {/* FILTER TAHUN */}
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

      <ResponsiveContainer width="100%" height={420}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 40, left: 180, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          {/* Probabilitas (%) */}
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />

          {/* Profesi */}
          <YAxis
            type="category"
            dataKey="profesi"
            width={180}
          />

          <Tooltip
            formatter={(value, name) => {
              if (name === "probabilitas") {
                return [`${value}%`, "Probabilitas Registrasi"];
              }
              return value;
            }}
            labelFormatter={(label) =>
              `Profesi Orang Tua: ${label}`
            }
          />

          <Legend />

          <Bar
            dataKey="probabilitas"
            name="Probabilitas Registrasi (%)"
            fill="#7c3aed"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
