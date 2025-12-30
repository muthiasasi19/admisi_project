// components/DistribusiProfesiOrtu.jsx

export default function DistribusiProfesiOrtu({ showTable = false }) {
  const [data, setData] = useState([]);
  const [profesiList, setProfesiList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(
        "http://127.0.0.1:8000/analytics/parent-distribution/profesi-camaru"
      );

      const raw = res.data.filter((d) => Number(d.tahun) !== 2016);

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
          profesiArr.forEach((p) => (row[p] ??= 0));
          return row;
        })
        .sort((a, b) => a.tahun - b.tahun);

      setProfesiList(profesiArr);
      setData(finalData);
    }

    fetchData();
  }, []);

  return (
    <div style={{ width: "100%", padding: 24 }}>
      <h2>Distribusi Profesi Orang Tua CAMARU</h2>

      {/* ===== GRAFIK ===== */}
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tahun" />
          <YAxis />
          <Tooltip />
          <Legend layout="vertical" align="right" />
          {profesiList.map((p, i) => (
            <Bar
              key={p}
              dataKey={p}
              stackId="a"
              fill={COLORS[i % COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* ===== TABEL ===== */}
      {showTable && (
        <div style={{ marginTop: 32 }}>
          <h3>Detail Distribusi Profesi</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>Profesi</th>
                {data.map((d) => (
                  <th key={d.tahun} style={th}>{d.tahun}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profesiList.map((p) => (
                <tr key={p}>
                  <td style={td}><b>{p}</b></td>
                  {data.map((d) => (
                    <td key={d.tahun} style={td}>{d[p]}</td>
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
