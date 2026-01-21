import React from 'react';
import KonversiPersentasePertahun from '../components/KonversiPersentasePertahun';
import KonversiTopProdi from '../components/KonversiTopProdi';
import KonversiDetail from '../components/KonversiDetail';

const Konversi = () => {
    return (
        /* pb-20 memberikan ruang kosong di paling bawah halaman agar tidak menempel */
        <div className="p-8 pb-20 bg-gray-50 min-h-screen flex flex-col space-y-10">
            
            {/* Header Section */}
            <div className="w-full text-center">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Analisis Konversi Beasiswa
                </h1>
                <div className="w-24 h-1.5 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* 1. Grafik Perbandingan Tahunan */}
            <div className="w-full"> 
                <KonversiPersentasePertahun />
            </div>

            {/* 2. Grafik Top Prodi */}
            <div className="w-full">
                <KonversiTopProdi />
            </div>

            {/* 3. Detail Table */}
            <div className="w-full">
                <KonversiDetail />
            </div>
            
        </div>
    );
};

export default Konversi;