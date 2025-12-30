// src/components/StatusLolosPerProdi.jsx

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
  "http://127.0.0.1:8000/analytics/camaru-beasiswa/status-per-prodi";

export default function StatusLolosPerProdi() {
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

        // list tahun unik
        const years = [
          ...new Set(raw.map((item) => Number(item.tahun)))
        ].sort((a, b) => b - a);

        const defaultYear = years[0];

        setAllData(raw);
        setTahunList(years);
        setTahunAktif(defaultYear);

        applyFilter(raw, defaultYear);
      } catch (err) {
        console.error("Error fetch status per prodi:", err);
      }
    }

    fetchData();
  }, []);

  const applyFilter = (rawData, tahun) => {
    const filtered = rawData.filter(
      (item) => Number(item.tahun) === Number(tahun)
    );

    const grouped = {};

    filtered.forEach((item) => {
      if (!grouped[item.prodi]) {
        grouped[item.prodi] = {
          prodi: item.prodi,
          lolos: 0,
          tidak_lolos: 0
        };
      }

      if (item.status === "LOLOS") {
        grouped[item.prodi].lolos = item.total;
      } else {
        grouped[item.prodi].tidak_lolos = item.total;
      }
    });

    setData(Object.values(grouped));
  };

  const handleChangeTahun = (e) => {
    const year = Number(e.target.value);
    setTahunAktif(year);
    applyFilter(allData, year);
  };

  return (
    <div style={{ width: "100%", height: 560, padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12
        }}
      >
        <h2>
          Lolos vs Tidak Lolos Beasiswa per Prodi (Pilihan 1)
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
          margin={{ top: 20, right: 200, left: 120, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis type="number" />
          <YAxis type="category" dataKey="prodi" width={150} />

          <Tooltip />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />

          <Bar dataKey="lolos" stackId="a" fill="#16a34a" name="Lolos" />
          <Bar
            dataKey="tidak_lolos"
            stackId="a"
            fill="#dc2626"
            name="Tidak Lolos"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
