import React, { useEffect, useState } from 'react';
import axios from 'axios';

const darkGreen = "#064e3b"; // Konsistensi tema warna

export default function KonversiDetail() {
    const [allData, setAllData] = useState([]); 
    const [filteredData, setFilteredData] = useState([]); 
    const [tahunList, setTahunList] = useState([]);
    const [tahunAktif, setTahunAktif] = useState("");
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 25;

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/analytics/camaru-beasiswa/konversi-detail')
            .then(res => {
                const raw = res.data;
                const years = [...new Set(raw.map(item => String(item.tahun)))].sort((a, b) => b - a);
                
                setAllData(raw);
                setTahunList(years);
                
                if (years.length > 0) {
                    const defaultYear = years[0];
                    setTahunAktif(defaultYear);
                    const filtered = raw.filter(item => String(item.tahun) === defaultYear);
                    setFilteredData(filtered);
                }
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    }, []);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const handleYearChange = (e) => {
        const selectedYear = e.target.value;
        setTahunAktif(selectedYear);
        const filtered = allData.filter(item => String(item.tahun) === String(selectedYear));
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    if (loading) return <div style={{ padding: 24, color: "#64748b", fontSize: "16px" }}>Memuat Detail...</div>;

    return (
        <div style={{ background: "#fff", padding: 0, borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            
            {/* Header Judul - Ditingkatkan ke 22px */}
            <div style={{ 
                padding: "24px 28px", 
                backgroundColor: darkGreen, 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
                position: "relative"
            }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#ffffff", margin: 0 }}>
                    Daftar Mahasiswa Konversi Tahun {tahunAktif}
                </h3>
                
                <div style={{ position: "absolute", right: 28 }}>
                    <select 
                        value={tahunAktif} 
                        onChange={handleYearChange} 
                        style={{ 
                            padding: "8px 16px", 
                            borderRadius: 10, 
                            border: "1px solid rgba(255,255,255,0.4)", 
                            background: "rgba(255,255,255,0.2)", 
                            color: "#fff", 
                            fontSize: 15, 
                            fontWeight: 700,
                            outline: "none",
                            cursor: "pointer"
                        }}
                    >
                        {tahunList.map(y => <option key={y} value={y} style={{color: "#000"}}>Tahun {y}</option>)}
                    </select>
                </div>
            </div>

            <div style={{ padding: 32 }}>
                <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #f1f5f9" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f8fafc", borderBottom: "3px solid #e2e8f0" }}>
                                <th style={{ ...thStyle, textAlign: "left" }}>Nama Mahasiswa</th>
                                <th style={{ ...thStyle, textAlign: "center" }}>Prodi Asal</th>
                                <th style={{ ...thStyle, textAlign: "center" }}>Prodi Tujuan</th>
                                <th style={{ ...thStyle, textAlign: "center" }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRows.length > 0 ? currentRows.map((row, idx) => (
                                <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: idx % 2 === 0 ? "#fff" : "#fcfdfe" }}>
                                    {/* Font Nama lebih besar dan tebal */}
                                    <td style={{ ...tdStyle, fontWeight: 700, fontSize: "16px" }}>{row.nama}</td>
                                    <td style={{ ...tdStyle, textAlign: "center" }}>{row.prodi_asal}</td>
                                    <td style={{ ...tdStyle, textAlign: "center" }}>{row.prodi_tujuan}</td>
                                    <td style={{ ...tdStyle, textAlign: "center" }}>
                                        <span style={{ 
                                            padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 800, 
                                            background: row.status_prodi === 'Pindah Prodi' ? '#fff7ed' : '#f0fdf4',
                                            color: row.status_prodi === 'Pindah Prodi' ? '#ea580c' : '#16a34a',
                                            textTransform: "uppercase",
                                            display: "inline-block"
                                        }}>
                                            {row.status_prodi}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" style={{...tdStyle, textAlign: 'center', color: '#94a3b8', fontSize: "16px"}}>Tidak ada data</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* -- PAGINATION SECTION -- */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
                    <span style={{ fontSize: 15, color: "#64748b", fontWeight: 500 }}>
                        Menampilkan <b>{indexOfFirstRow + 1} - {Math.min(indexOfLastRow, filteredData.length)}</b> dari <b>{filteredData.length}</b> data
                    </span>
                    <div style={{ display: "flex", gap: 12 }}>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={btnPaginationStyle(currentPage === 1)}
                        >
                            Sebelumnya
                        </button>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            style={btnPaginationStyle(currentPage === totalPages || totalPages === 0)}
                        >
                            Selanjutnya
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const thStyle = { 
    padding: "20px 24px", 
    fontSize: "15px", // Naik dari 13px
    color: "#1e293b", 
    fontWeight: 900, 
    textTransform: "uppercase", 
    letterSpacing: "0.05em" 
};

const tdStyle = { 
    padding: "20px 24px", 
    fontSize: "15px", // Naik dari 14px
    color: "#334155" 
};

const btnPaginationStyle = (disabled) => ({
    padding: "10px 20px", // Button lebih besar
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    fontSize: 15, // Naik dari 13px
    fontWeight: 700,
    background: disabled ? "#f1f5f9" : "#fff",
    color: disabled ? "#94a3b8" : "#334155",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease"
});