# routers/camaru_beasiswa_konversi_persentase.py
from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine
#from app.core.security import verify_api_key

router = APIRouter(
    prefix="/analytics/camaru-beasiswa",
    tags=["Camaru Beasiswa"]
)

@router.get("/konversi-persentase")
def konversi_persentase_per_tahun():
    """
    Konversi Camaru Beasiswa per Tahun (Persentase)

    Definisi:
    - Tidak lolos beasiswa
    - Tapi diterima jalur lain (match nama + tgl lahir)
    - Valid pembayaran (TERMIN / LUNAS)
    """

    query = text("""
        /* ===============================
           1. BASE CAMARU + BEASISWA
        =============================== */
        WITH base AS (
            SELECT
                c.CAMARU_ID,
                c.THAJARANID AS tahun,
                c.FULLNAME,
                c.tgl_lahir
            FROM Camaru c
            JOIN Camaru_Beasiswa cb
                ON c.CAMARU_ID = cb.Camaru_Id
        ),

        /* ===============================
           2. STATUS SELEKSI
        =============================== */
        status_seleksi AS (
            SELECT
                b.*,
                CASE
                    WHEN ac.CAMARU_ID IS NOT NULL THEN 'LOLOS'
                    ELSE 'TIDAK_LOLOS'
                END AS status_seleksi
            FROM base b
            LEFT JOIN ACCEPTED_CANDIDATES ac
                ON b.CAMARU_ID = ac.CAMARU_ID
        ),

        /* ===============================
           3. PEMBAYARAN VALID
        =============================== */
        pembayaran_valid AS (
            SELECT DISTINCT camaru_id
            FROM resume_pembayaran_all
            WHERE status_bayar IN ('TERMIN','LUNAS')
        ),

        /* ===============================
           4. TIDAK LOLOS + BAYAR
        =============================== */
        tidak_lolos_valid AS (
            SELECT s.*
            FROM status_seleksi s
            JOIN pembayaran_valid pv
                ON s.CAMARU_ID = pv.camaru_id
            WHERE s.status_seleksi = 'TIDAK_LOLOS'
        ),

        /* ===============================
           5. KONVERSI (DITERIMA JALUR LAIN)
        =============================== */
        konversi AS (
            SELECT DISTINCT
                nl.CAMARU_ID,
                nl.tahun
            FROM tidak_lolos_valid nl
            JOIN Camaru c2
                ON nl.FULLNAME = c2.FULLNAME
               AND nl.tgl_lahir = c2.tgl_lahir
            JOIN ACCEPTED_CANDIDATES ac2
                ON c2.CAMARU_ID = ac2.CAMARU_ID
        )

        /* ===============================
           6. AGREGASI FINAL
        =============================== */
        SELECT
            nl.tahun,
            COUNT(DISTINCT nl.CAMARU_ID) AS total_tidak_lolos,
            COUNT(DISTINCT k.CAMARU_ID) AS total_konversi,
            ROUND(
                COUNT(DISTINCT k.CAMARU_ID) * 100.0 /
                NULLIF(COUNT(DISTINCT nl.CAMARU_ID), 0),
                2
            ) AS persentase_konversi
        FROM tidak_lolos_valid nl
        LEFT JOIN konversi k
            ON nl.CAMARU_ID = k.CAMARU_ID
        GROUP BY nl.tahun
        ORDER BY nl.tahun
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).fetchall()

    return [
        {
            "tahun": row.tahun,
            "total_tidak_lolos": row.total_tidak_lolos,
            "total_konversi": row.total_konversi,
            "persentase_konversi": float(row.persentase_konversi)
        }
        for row in rows
    ]
