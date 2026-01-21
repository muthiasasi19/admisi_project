from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine

router = APIRouter(
    prefix="/analytics/camaru-beasiswa",
    tags=["Camaru Beasiswa"]
)

@router.get("/top-pindah-prodi")
def top_pindah_prodi():
    """
    Menampilkan daftar prodi tujuan yang paling banyak dipilih 
    per tahun ajaran oleh mahasiswa yang memutuskan untuk pindah prodi.
    """
    query = text("""
        WITH cte_tidak_lolos AS (
            -- Ambil data awal dan sertakan THAJARANID sebagai filter tahun
            SELECT 
                tlb.Camaru_Id AS id_lama,
                c1.FULLNAME,
                c1.tgl_lahir,
                c1.THAJARANID AS tahun,
                c1.Prodi_Pilihan_1 AS prodi_pilihan_1_awal
            FROM Camaru_Tidak_Lolos_Beasiswa tlb
            JOIN Camaru c1 ON tlb.Camaru_Id = c1.CAMARU_ID
        ),
        
        cte_pendaftaran_baru AS (
            -- Cari kecocokan identitas di pendaftaran baru (Non-Beasiswa)
            SELECT 
                tl.id_lama,
                tl.tahun,
                c2.CAMARU_ID AS id_baru,
                c2.Prodi_Pilihan_1 AS prodi_tujuan
            FROM cte_tidak_lolos tl
            INNER JOIN ACCEPTED_CANDIDATES ac ON ac.CAMARU_ID <> tl.id_lama
            INNER JOIN Camaru c2 ON ac.CAMARU_ID = c2.CAMARU_ID
            WHERE 
                c2.FULLNAME = tl.FULLNAME 
                AND c2.tgl_lahir = tl.tgl_lahir
                AND c2.JNS_DAFTAR <> 'BEASW'
                AND c2.Prodi_Pilihan_1 <> tl.prodi_pilihan_1_awal -- Logika Pindah Prodi
        )

        -- Gabungkan dengan data pembayaran dan status mahasiswa final
        SELECT 
            pb.tahun,
            pb.prodi_tujuan,
            COUNT(*) AS jumlah_mahasiswa
        FROM cte_pendaftaran_baru pb
        INNER JOIN resume_pembayaran_all rp ON pb.id_baru = rp.camaru_id
        INNER JOIN Mahasiswa m ON pb.id_baru = m.Camaru_Id
        WHERE rp.status_bayar IN ('LP', 'LUNAS')
        GROUP BY pb.tahun, pb.prodi_tujuan
        ORDER BY pb.tahun DESC, jumlah_mahasiswa DESC
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).fetchall()

    # Pastikan data tahun dikonversi ke string/integer agar FE mudah memproses
    return [
        {
            "tahun": str(row.tahun),
            "prodi_tujuan": row.prodi_tujuan,
            "jumlah": row.jumlah_mahasiswa
        }
        for row in rows
    ]