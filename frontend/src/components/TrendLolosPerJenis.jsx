import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import axios from "axios";

const COLOR_LOLOS = "#2ca02c";
const COLOR_TIDAK_LOLOS = "#d62728";

export default function TrendLolosPerJenis({ showTable = false }) {
  const [data, setData] = useState([]);
  const [jenisList, setJenisList] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/analytics/camaru-beasiswa/trend-lolos-per-jenis")
      .then((res) => {
        const raw = res.data;
        const grouped = {};
        const jenisSet = new Set();

        raw.forEach((item) => {
          const tahun = item.tahun;
          const jenis = item.jenis_beasiswa
            .replace(/\s+/g, "_")
            .replace(/[^\w]/g, "");

          jenisSet.add(jenis);

          if (!grouped[tahun]) grouped[tahun] = { tahun };

          grouped[tahun][`${jenis}_lolos`] = item.total_lolos;
          grouped[tahun][`${jenis}_tidak`] = item.total_tidak_lolos;
        });

        setData(
          Object.values(grouped).sort((a, b) => a.tahun - b.tahun)
        );
        setJenisList(Array.from(jenisSet));
      })
      .catch((err) => {
        console.error("Error fetch trend lolos per jenis:", err);
      });
  }, []);

  return (
    <div style={{ width: "100%", padding: 24 }}>
      <h2>Trend Lolos vs Tidak Lolos per Jenis Beasiswa</h2>

      {/* ================= CHART ================= */}
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tahun" />
          <YAxis />
          <Tooltip />

          {jenisList.map((j) => (
            <>
              <Bar
                key={`${j}-lolos`}
                dataKey={`${j}_lolos`}
                stackId={j}
                fill={COLOR_LOLOS}
              />
              <Bar
                key={`${j}-tidak`}
                dataKey={`${j}_tidak`}
                stackId={j}
                fill={COLOR_TIDAK_LOLOS}
              />
            </>
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* ================= TABLE (VERTIKAL JENIS) ================= */}
      {showTable && (
        <div style={{ marginTop: 32 }}>
          <h3>Detail Status Lolos per Jenis Beasiswa</h3>

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
                      <span style={{ color: COLOR_LOLOS }}>
                        {row[`${jenis}_lolos`] ?? 0}
                      </span>
                      {" / "}
                      <span style={{ color: COLOR_TIDAK_LOLOS }}>
                        {row[`${jenis}_tidak`] ?? 0}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 8, fontSize: 12 }}>
            <span style={{ color: COLOR_LOLOS }}>■</span> Lolos &nbsp;
            <span style={{ color: COLOR_TIDAK_LOLOS }}>■</span> Tidak Lolos
          </div>
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
