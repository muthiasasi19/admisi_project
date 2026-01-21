import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function KonversiTopProdi() {
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [tahunList, setTahunList] = useState([]);
    const [tahunAktif, setTahunAktif] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/analytics/camaru-beasiswa/top-pindah-prodi')
            .then(res => {
                const raw = res.data;
                const years = [...new Set(raw.map(item => item.tahun))].sort((a, b) => b - a);
                setAllData(raw);
                setTahunList(years);
                if(years.length > 0) {
                    setTahunAktif(years[0]);
                    const filtered = raw.filter(item => item.tahun === years[0]);
                    setFilteredData(filtered.slice(0, 8));
                }
                setLoading(false);
            })
            .catch(err => { 
                console.error(err); 
                setLoading(false); 
            });
    }, []);

    const handleYearChange = (e) => {
        const year = e.target.value;
        setTahunAktif(year);
        const filtered = allData.filter(item => item.tahun === year);
        setFilteredData(filtered.slice(0, 8));
    };

    if (loading) return <div style={{ padding: 24, color: "#64748b", fontSize: "16px" }}>Memuat Top Prodi...</div>;

    return (
        <div style={{ 
            background: "#fff", 
            padding: 24, 
            borderRadius: 16, 
            border: "1px solid #e2e8f0", 
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: 40 
        }}>
            {/* Header */}
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: 24 
            }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Top Prodi Tujuan
                </h3>
                <select 
                    value={tahunAktif} 
                    onChange={handleYearChange} 
                    style={{ 
                        padding: "8px 12px", 
                        borderRadius: 8, 
                        border: "1px solid #cbd5e1", 
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: "pointer",
                        outline: "none"
                    }}
                >
                    {tahunList.map(y => <option key={y} value={y}>Tahun {y}</option>)}
                </select>
            </div>

            <ResponsiveContainer width="100%" height={450}>
                <BarChart 
                    data={filteredData} 
                    layout="vertical" 
                    margin={{ left: 40, right: 40, top: 10, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis 
                        dataKey="prodi_tujuan" 
                        type="category" 
                        width={280} 
                        tick={{
                            fontSize: 14,
                            fontWeight: 700, 
                            fill: "#334155"
                        }} 
                        axisLine={false} 
                        tickLine={false}
                        tickFormatter={(value) => value.length > 35 ? `${value.substring(0, 32)}...` : value}
                    />
                    <Tooltip 
                        cursor={{fill: '#f8fafc'}} 
                        contentStyle={{
                            borderRadius: 8, 
                            border: '1px solid #e2e8f0', 
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            fontSize: '14px',
                            fontWeight: 600
                        }} 
                    />
                    <Bar 
                        dataKey="jumlah" 
                        fill="#6366f1" 
                        radius={[0, 4, 4, 0]} 
                        barSize={28}
                        // Label angka sudah dihapus agar tampilan lebih bersih
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}