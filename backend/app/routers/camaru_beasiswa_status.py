# app/routers/camaru_beasiswa_status.py
from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine
#from app.core.security import verify_api_key

router = APIRouter(
    prefix="/analytics/camaru-beasiswa",
    tags=["Camaru Beasiswa"]
    #dependencies=[Depends(verify_api_key)]
)


@router.get("/status")
def status_camaru_beasiswa():
    """
    Status Camaru Beasiswa (FINAL & RINGAN)

    Logika:
    1. Camaru JOIN Camaru_Beasiswa → jenis beasiswa
    2. Tentukan status lolos / tidak lolos dari ACCEPTED_CANDIDATES
    3. FILTER pembayaran TERMIN / LUNAS
    4. Hitung per Camaru_ID

    Catatan:
    - Konversi TIDAK dihitung di endpoint ini
    - Konversi ada di endpoint /konversi
    """

    query = text("""
        /* ===============================
           1. BASE CAMARU + BEASISWA
        =============================== */
        WITH base AS (
            SELECT
                c.CAMARU_ID,
                COALESCE(cb.Jenis_Beasiswa, 'Tidak diketahui') AS jenis_beasiswa
            FROM Camaru c
            JOIN Camaru_Beasiswa cb
                ON c.CAMARU_ID = cb.Camaru_Id
        ),

        /* ===============================
           2. STATUS SELEKSI (MURNI)
        =============================== */
        status_seleksi AS (
            SELECT
                b.CAMARU_ID,
                b.jenis_beasiswa,
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
            WHERE status_bayar IN ('TERMIN', 'LUNAS')
        )

        /* ===============================
           4. AGREGASI FINAL
        =============================== */
        SELECT
            s.jenis_beasiswa,

            COUNT(DISTINCT CASE
                WHEN s.status_seleksi = 'LOLOS'
                     AND pv.camaru_id IS NOT NULL
                THEN s.CAMARU_ID
            END) AS lolos,

            COUNT(DISTINCT CASE
                WHEN s.status_seleksi = 'TIDAK_LOLOS'
                     AND pv.camaru_id IS NOT NULL
                THEN s.CAMARU_ID
            END) AS tidak_lolos

        FROM status_seleksi s
        LEFT JOIN pembayaran_valid pv
            ON s.CAMARU_ID = pv.camaru_id

        GROUP BY s.jenis_beasiswa
        ORDER BY s.jenis_beasiswa
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).fetchall()

    return [
        {
            "jenis_beasiswa": row.jenis_beasiswa,
            "lolos": row.lolos,
            "tidak_lolos": row.tidak_lolos
        }
        for row in rows
    ]
