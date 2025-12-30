# routers/camaru_beasiswa_konversi_top_prodi.py
from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine
#from app.core.security import verify_api_key

router = APIRouter(
    prefix="/analytics/camaru-beasiswa",
    tags=["Camaru Beasiswa"]
)

@router.get("/konversi-top-prodi")
def top_prodi_tujuan_konversi():
    """
    Top Prodi Tujuan Konversi Camaru Beasiswa

    Definisi:
    - Tidak lolos beasiswa
    - Valid pembayaran (TERMIN / LUNAS)
    - Diterima lewat jalur lain
    - Hitung PRODI TUJUAN AKHIR (Pilihan 1)
    """

    query = text("""
        ======================================================
        create tabel konversi beasiswa
        ====================================================== 
        WITH base_accepted AS (
            SELECT
                ac.CAMARU_ID,
                ac.THAJARANID,
                c.FULLNAME,
                c.tgl_lahir,
                c.Fakultas_Pilihan_1,
                c.Prodi_Pilihan_1
            FROM ACCEPTED_CANDIDATES ac
            INNER JOIN Camaru c
                ON ac.CAMARU_ID = c.CAMARU_ID
            WHERE ac.THAJARANID BETWEEN 2020 AND 2025
        )
        SELECT
            tl.camaru_id_bea,
            ba.CAMARU_ID AS camaru_id_nonbea,
            tl.FULLNAME,
            tl.tgl_lahir,
            tl.THAJARANID,

            /* Data saat daftar beasiswa */
            tl.Jenis_Beasiswa,
            tl.fakultas_bea,
            tl.prodi_bea,

            /* Data saat diterima jalur lain */
            ba.Fakultas_Pilihan_1 AS fakultas_nonbea,
            ba.Prodi_Pilihan_1 AS prodi_nonbea,

            CASE
                WHEN tl.prodi_bea = ba.Prodi_Pilihan_1
                    THEN 'Tidak Pindah Prodi'
                ELSE 'Pindah Prodi'
            END AS status_pindah_prodi
        INTO tbl_konversi_beasiswa
        FROM tbl_tidak_lolos_beasiswa tl
        INNER JOIN base_accepted ba
            ON tl.FULLNAME = ba.FULLNAME
        AND tl.tgl_lahir = ba.tgl_lahir;
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).fetchall()

    return [
        {
            "tahun": row.tahun,
            "prodi_tujuan": row.prodi_tujuan,
            "total_konversi": row.total_konversi
        }
        for row in rows
    ]
