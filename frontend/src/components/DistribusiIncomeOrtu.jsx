// components/DistribusiIncomeOrtu.jsx
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

const COLORS = {
  "0": "#64748b",
  "0–5 jt": "#22c55e",
  "5–10 jt": "#3b82f6",
  "10–15 jt": "#f59e0b",
  "15–20 jt": "#ef4444",
  ">20 jt": "#8b5cf6"
};

export default function DistribusiIncomeOrtu({ showTable = false }) {
  const [data, setData] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(
        "http://127.0.0.1:8000/analytics/parent-distribution/income-camaru"
      );

      // buang tahun 2016
      const raw = res.data.filter((d) => Number(d.tahun) !== 2016);

      const grouped = {};
      const kategoriSet = new Set();

      raw.forEach(({ tahun, kategori, jumlah }) => {
        kategoriSet.add(kategori);
        if (!grouped[tahun]) grouped[tahun] = { tahun };
        grouped[tahun][kategori] = jumlah;
      });

      const kategoriArr = Array.from(kategoriSet);

      const finalData = Object.values(grouped)
        .map((row) => {
          kategoriArr.forEach((k) => (row[k] ??= 0));
          return row;
        })
        .sort((a, b) => a.tahun - b.tahun);

      setKategoriList(kategoriArr);
      setData(finalData);
    }

    fetchData();
  }, []);

  return (
    <div style={{ width: "100%", padding: 24 }}>
      <h2>Distribusi Income Orang Tua CAMARU</h2>

      {/* ===== GRAFIK ===== */}
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tahun" />
          <YAxis />
          <Tooltip />
          <Legend layout="vertical" align="right" />
          {kategoriList.map((k) => (
            <Bar key={k} dataKey={k} stackId="a" fill={COLORS[k]} />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* ===== TABEL ===== */}
      {showTable && (
        <div style={{ marginTop: 32 }}>
          <h3>Detail Distribusi Income</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>Kategori Income</th>
                {data.map((d) => (
                  <th key={d.tahun} style={th}>{d.tahun}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kategoriList.map((k) => (
                <tr key={k}>
                  <td style={td}><b>{k}</b></td>
                  {data.map((d) => (
                    <td key={d.tahun} style={td}>{d[k]}</td>
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

const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const th = { border: "1px solid #e5e7eb", padding: 8, background: "#f1f5f9" };
const td = { border: "1px solid #e5e7eb", padding: 8 };
