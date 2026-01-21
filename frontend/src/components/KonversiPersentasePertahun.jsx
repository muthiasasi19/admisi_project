import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    CartesianGrid, 
    Legend, 
    Label
} from "recharts";

export default function KonversiPersentasePertahun() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/analytics/camaru-beasiswa/konversi-tahunan')
            .then(res => {
                const sorted = [...res.data].sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun));
                setData(sorted);
                setLoading(false);
            })
            .catch(err => { 
                console.error(err); 
                setLoading(false); 
            });
    }, []);

    if (loading) return <div style={{ padding: 24, color: "#64748b" }}>Memuat grafik perbandingan...</div>;

    return (
        <div style={{ background: "#fff", padding: 32, borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 32 }}>
            <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}>
                    Perbandingan Konversi Mahasiswa
                </h2>
                <p style={{ fontSize: 15, color: "#64748b" }}>
                    Visualisasi jumlah mahasiswa tidak lolos beasiswa vs konversi (mendaftar kembali)
                </p>
            </div>

            <ResponsiveContainer width="100%" height={450}>
                {/* Margin kanan (right) ditingkatkan ke 120 untuk memberi ruang bagi Legend di sisi kanan */}
                <BarChart data={data} margin={{ top: 10, right: 120, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    
                    <XAxis 
                        dataKey="tahun" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#475569', fontSize: 14, fontWeight: 700}} 
                        dy={10}
                    >
                        <Label 
                            value="Tahun" 
                            offset={-25} 
                            position="insideBottom" 
                            style={{ fill: '#475569', fontSize: 18 }} 
                        />
                    </XAxis>
                    
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#475569', fontSize: 14, fontWeight: 600}} 
                    >
                        <Label 
                            value="Jumlah Mahasiswa" 
                            angle={-90} 
                            position="insideLeft" 
                            offset={-10}
                            style={{ textAnchor: 'middle', fill: '#475569', fontSize: 18 }} 
                        />
                    </YAxis>
                    
                    <Tooltip 
                        cursor={{fill: '#f8fafc'}} 
                        contentStyle={{
                            borderRadius: 12, 
                            border: '1px solid #e2e8f0', 
                            boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
                            fontSize: 15,
                            fontWeight: 600
                        }}
                        formatter={(value, name, props) => {
                            if (name === "Total Konversi") return [`${value} (${props.payload.persentase})`, name];
                            return [value, name];
                        }}
                    />
                    
                    {/* PERUBAHAN: Legend dipindah ke kanan secara vertikal */}
                    <Legend 
                        iconType="circle" 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        wrapperStyle={{
                            paddingLeft: "20px", 
                            fontSize: 14, 
                            fontWeight: 700,
                            lineHeight: "30px" // Memberi jarak antar item legend
                        }} 
                    />
                    
                    <Bar 
                        dataKey="total_tidak_lolos" 
                        name="Total Tidak Lolos" 
                        fill="#dc2626" 
                        radius={[6, 6, 0, 0]} 
                        barSize={50} 
                    />
                    
                    <Bar 
                        dataKey="total_konversi" 
                        name="Total Konversi" 
                        fill="#6366f1" 
                        radius={[6, 6, 0, 0]} 
                        barSize={50}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}