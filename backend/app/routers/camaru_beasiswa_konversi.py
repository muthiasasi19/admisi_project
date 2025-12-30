# routers/camaru_beasiswa_konversi.py
from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine
#from app.core.security import verify_api_key

router = APIRouter(
    prefix="/analytics/camaru-beasiswa",
    tags=["Camaru Beasiswa"]
)


@router.get("/konversi-pindah-prodi")
def konversi_pindah_prodi():
    """
    Konversi Camaru Beasiswa (FINAL & BENAR):

    - Tidak lolos beasiswa
    - Diterima lewat jalur lain
    - ORANG SAMA (fullname + tgl_lahir)
    - CAMARU_ID BERBEDA
    - Prodi / Fakultas berubah
    - Valid pembayaran (TERMIN / LUNAS)
    """

    query = text("""
        /* ===============================
           1. CAMARU AWAL (DAFTAR BEASISWA)
        =============================== */
        WITH base_beasiswa AS (
            SELECT
                c.CAMARU_ID AS camaru_awal_id,
                c.THAJARANID AS tahun,
                c.FULLNAME,
                c.tgl_lahir,
                COALESCE(c.Fakultas_Pilihan_1, 'Tidak diketahui') AS fakultas_awal,
                COALESCE(c.Prodi_Pilihan_1, 'Tidak diketahui') AS prodi_awal,
                COALESCE(cb.Jenis_Beasiswa, 'Tidak diketahui') AS jenis_beasiswa
            FROM Camaru c
            JOIN Camaru_Beasiswa cb
                ON c.CAMARU_ID = cb.Camaru_Id
        ),

        /* ===============================
           2. TIDAK LOLOS BEASISWA
        =============================== */
        tidak_lolos AS (
            SELECT cb.*
            FROM base_beasiswa cb
            LEFT JOIN ACCEPTED_CANDIDATES ac
                ON cb.camaru_awal_id = ac.CAMARU_ID
            WHERE ac.CAMARU_ID IS NULL
        ),

        /* ===============================
           3. PEMBAYARAN VALID
        =============================== */
        pembayaran_valid AS (
            SELECT DISTINCT camaru_id
            FROM resume_pembayaran_all
            WHERE status_bayar IN ('TERMIN', 'LUNAS')
        ),

        /* ===============================
           4. TIDAK LOLOS + SUDAH BAYAR
        =============================== */
        tidak_lolos_valid AS (
            SELECT nl.*
            FROM tidak_lolos nl
            JOIN pembayaran_valid pv
                ON nl.camaru_awal_id = pv.camaru_id
        ),

        /* ===============================
           5. DITERIMA JALUR LAIN
        =============================== */
        diterima_jalur_lain AS (
            SELECT
                c2.CAMARU_ID AS camaru_baru_id,
                c2.FULLNAME,
                c2.tgl_lahir,
                COALESCE(c2.Fakultas_Pilihan_1, 'Tidak diketahui') AS fakultas_akhir,
                COALESCE(c2.Prodi_Pilihan_1, 'Tidak diketahui') AS prodi_akhir
            FROM Camaru c2
            JOIN ACCEPTED_CANDIDATES ac2
                ON c2.CAMARU_ID = ac2.CAMARU_ID
        )

        /* ===============================
           6. KONVERSI PINDAH PRODI
        =============================== */
        SELECT
            nl.tahun,
            nl.jenis_beasiswa,
            nl.fakultas_awal,
            nl.prodi_awal,
            dl.fakultas_akhir,
            dl.prodi_akhir,
            COUNT(DISTINCT nl.camaru_awal_id) AS total_konversi
        FROM tidak_lolos_valid nl
        JOIN diterima_jalur_lain dl
            ON nl.FULLNAME = dl.FULLNAME
           AND nl.tgl_lahir = dl.tgl_lahir
           AND nl.camaru_awal_id <> dl.camaru_baru_id
        WHERE
            nl.prodi_awal <> dl.prodi_akhir
            OR nl.fakultas_awal <> dl.fakultas_akhir
        GROUP BY
            nl.tahun,
            nl.jenis_beasiswa,
            nl.fakultas_awal,
            nl.prodi_awal,
            dl.fakultas_akhir,
            dl.prodi_akhir
        ORDER BY total_konversi DESC
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).fetchall()

    return [
        {
            "tahun": row.tahun,
            "jenis_beasiswa": row.jenis_beasiswa,
            "fakultas_awal": row.fakultas_awal,
            "prodi_awal": row.prodi_awal,
            "fakultas_akhir": row.fakultas_akhir,
            "prodi_akhir": row.prodi_akhir,
            "total_konversi": row.total_konversi
        }
        for row in rows
    ]
