# routers/camaru_beasiswa_konversi.py
from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine

router = APIRouter(
    prefix="/analytics/camaru-beasiswa",
    tags=["Camaru Beasiswa"]
)

@router.get("/konversi-detail")
def konversi_camaru_beasiswa_detail():
    """
    Menampilkan detail data mahasiswa (Name, Prodi Asal, Prodi Tujuan)
    untuk kebutuhan tabel detail di Frontend.
    """

    query = text("""
        WITH cte_tidak_lolos AS (
            -- 1. Identifikasi mahasiswa yang ada di daftar tidak lolos beasiswa
            -- Ambil string Nama & Tgl Lahir dari Camaru (c1) sebagai referensi identitas
            SELECT 
                tlb.Camaru_Id AS id_lama,
                c1.FULLNAME,
                c1.tgl_lahir,
                c1.THAJARANID,
                c1.Prodi_Pilihan_1 AS prodi_pilihan_1_awal
            FROM Camaru_Tidak_Lolos_Beasiswa tlb
            JOIN Camaru c1 ON tlb.Camaru_Id = c1.CAMARU_ID
        ),
        
        cte_pendaftaran_baru AS (
            -- 2. Cari kecocokan di Accepted Candidates yang memiliki Nama & Tgl Lahir sama
            -- tetapi ID pendaftaran berbeda (id_baru)
            SELECT 
                tl.id_lama,
                tl.FULLNAME,
                tl.THAJARANID AS tahun,
                c2.CAMARU_ID AS id_baru,
                tl.prodi_pilihan_1_awal,
                c2.Prodi_Pilihan_1 AS prodi_pilihan_1_baru,
                -- Logika Pindah Prodi: Jika pilihan 1 di pendaftaran baru berbeda dengan pilihan 1 awal
                CASE 
                    WHEN tl.prodi_pilihan_1_awal <> c2.Prodi_Pilihan_1 THEN 'Pindah Prodi'
                    ELSE 'Tetap' 
                END AS status_prodi
            FROM cte_tidak_lolos tl
            INNER JOIN ACCEPTED_CANDIDATES ac ON ac.CAMARU_ID <> tl.id_lama
            INNER JOIN Camaru c2 ON ac.CAMARU_ID = c2.CAMARU_ID
            WHERE 
                c2.FULLNAME = tl.FULLNAME 
                AND c2.tgl_lahir = tl.tgl_lahir
                AND c2.JNS_DAFTAR <> 'BEASW' -- Filter agar hanya mencari pendaftaran reguler/non-beasiswa
        )

        -- 3. Final Join untuk memastikan pembayaran valid dan data sudah final di tabel Mahasiswa
        SELECT 
            pb.tahun,
            pb.FULLNAME,
            pb.prodi_pilihan_1_awal AS prodi_asal,
            pb.prodi_pilihan_1_baru AS prodi_tujuan,
            pb.status_prodi
        FROM cte_pendaftaran_baru pb
        INNER JOIN resume_pembayaran_all rp ON pb.id_baru = rp.camaru_id
        INNER JOIN Mahasiswa m ON pb.id_baru = m.Camaru_Id
        WHERE rp.status_bayar IN ('LP', 'LUNAS')
        ORDER BY pb.tahun DESC, pb.FULLNAME ASC
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).fetchall()

    return [
        {
            "tahun": row.tahun,
            "nama": row.FULLNAME,
            "prodi_asal": row.prodi_asal,
            "prodi_tujuan": row.prodi_tujuan,
            "status_prodi": row.status_prodi
        }
        for row in rows
    ]