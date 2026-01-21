# routers/camaru_beasiswa_konversi_persentase.py
from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine
#from app.core.security import verify_api_key

router = APIRouter(
    prefix="/analytics/camaru-beasiswa",
    tags=["Camaru Beasiswa"]
)

@router.get("/konversi-tahunan")
def konversi_tahunan_summary():
    """
    Menampilkan ringkasan konversi per tahun:
    - Total Tidak Lolos (dari tabel Camaru_Tidak_Lolos_Beasiswa)
    - Total Konversi (yang mendaftar lagi, bayar, dan jadi mahasiswa)
    - Persentase Konversi
    """

    query = text("""
        WITH cte_basis_tidak_lolos AS (
            -- 1. Hitung total mahasiswa yang tidak lolos beasiswa per tahun
            SELECT 
                c.THAJARANID AS tahun,
                COUNT(DISTINCT tlb.Camaru_Id) AS total_tidak_lolos
            FROM Camaru_Tidak_Lolos_Beasiswa tlb
            JOIN Camaru c ON tlb.Camaru_Id = c.CAMARU_ID
            GROUP BY c.THAJARANID
        ),
        
        cte_identitas_tl AS (
            -- Ambil identitas untuk dicocokkan
            SELECT 
                tlb.Camaru_Id AS id_lama,
                c1.FULLNAME,
                c1.tgl_lahir,
                c1.THAJARANID AS tahun
            FROM Camaru_Tidak_Lolos_Beasiswa tlb
            JOIN Camaru c1 ON tlb.Camaru_Id = c1.CAMARU_ID
        ),

        cte_total_konversi AS (
            -- 2. Hitung yang berhasil konversi (Lolos jalur lain + Bayar + Mahasiswa)
            SELECT 
                tl.tahun,
                COUNT(DISTINCT tl.id_lama) AS total_konversi
            FROM cte_identitas_tl tl
            INNER JOIN ACCEPTED_CANDIDATES ac ON ac.CAMARU_ID <> tl.id_lama
            INNER JOIN Camaru c2 ON ac.CAMARU_ID = c2.CAMARU_ID
            INNER JOIN resume_pembayaran_all rp ON c2.CAMARU_ID = rp.camaru_id
            INNER JOIN Mahasiswa m ON c2.CAMARU_ID = m.Camaru_Id
            WHERE 
                c2.FULLNAME = tl.FULLNAME 
                AND c2.tgl_lahir = tl.tgl_lahir
                AND c2.JNS_DAFTAR <> 'BEASW'
                AND rp.status_bayar IN ('LP', 'LUNAS')
            GROUP BY tl.tahun
        )

        -- 3. Gabungkan Basis Data dan Hasil Konversi
        SELECT 
            b.tahun,
            b.total_tidak_lolos,
            ISNULL(k.total_konversi, 0) AS total_konversi,
            CASE 
                WHEN b.total_tidak_lolos > 0 
                THEN CAST((ISNULL(k.total_konversi, 0) * 100.0 / b.total_tidak_lolos) AS DECIMAL(10,2))
                ELSE 0 
            END AS persentase_konversi
        FROM cte_basis_tidak_lolos b
        LEFT JOIN cte_total_konversi k ON b.tahun = k.tahun
        ORDER BY b.tahun DESC
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).fetchall()

    return [
        {
            "tahun": row.tahun,
            "total_tidak_lolos": row.total_tidak_lolos,
            "total_konversi": row.total_konversi,
            "persentase": f"{row.persentase_konversi}%"
        }
        for row in rows
    ]