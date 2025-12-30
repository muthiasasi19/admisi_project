# routers/camaru_beasiswa_lolos_prodi.py
from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine

router = APIRouter(
    prefix="/analytics/camaru-beasiswa",
    tags=["Camaru Beasiswa"]
)

@router.get("/status-per-prodi")
def status_per_prodi():
    """
    Distribusi Lolos vs Tidak Lolos Beasiswa per Prodi 

    Logika FINAL (SAMA dengan versi fakultas):
    - Abaikan Camaru_Beasiswa dengan Camaru_Id NULL
    - Gunakan Camaru sebagai basis camaru valid
    - LOLOS       = ada di ACCEPTED_CANDIDATES
    - TIDAK_LOLOS = tidak ada di ACCEPTED_CANDIDATES
    """

    query = text("""
        /* ===============================
           1. BASE: CAMARU BEASISWA VALID
        =============================== */
        WITH base AS (
            SELECT
                cb.Camaru_Id AS CAMARU_ID,
                c.THAJARANID AS tahun,
                COALESCE(c.Prodi_Pilihan_1, 'Tidak diketahui') AS prodi
            FROM Camaru_Beasiswa cb
            JOIN Camaru c
                ON cb.Camaru_Id = c.CAMARU_ID
            WHERE cb.Camaru_Id IS NOT NULL
        ),

        /* ===============================
           2. STATUS SELEKSI (ACCEPTED)
        =============================== */
        status_seleksi AS (
            SELECT
                b.CAMARU_ID,
                b.tahun,
                b.prodi,
                CASE
                    WHEN ac.CAMARU_ID IS NOT NULL THEN 'LOLOS'
                    ELSE 'TIDAK_LOLOS'
                END AS status
            FROM base b
            LEFT JOIN ACCEPTED_CANDIDATES ac
                ON b.CAMARU_ID = ac.CAMARU_ID
        )

        /* ===============================
           3. AGREGASI FINAL
        =============================== */
        SELECT
            tahun,
            prodi,
            COUNT(DISTINCT CASE
                WHEN status = 'LOLOS'
                THEN CAMARU_ID
            END) AS lolos,
            COUNT(DISTINCT CASE
                WHEN status = 'TIDAK_LOLOS'
                THEN CAMARU_ID
            END) AS tidak_lolos
        FROM status_seleksi
        GROUP BY tahun, prodi
        ORDER BY tahun, prodi
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).fetchall()

    return [
        {
            "tahun": row.tahun,
            "prodi": row.prodi,
            "lolos": row.lolos,
            "tidak_lolos": row.tidak_lolos
        }
        for row in rows
    ]
