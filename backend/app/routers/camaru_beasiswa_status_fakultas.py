# routers/camaru_beasiswa_status_fakultas.py
from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine

router = APIRouter(
    prefix="/analytics/camaru-beasiswa",
    tags=["Camaru Beasiswa"]
)

@router.get("/status-per-fakultas")
def status_per_fakultas():
    """
    Distribusi Lolos vs Tidak Lolos Beasiswa per Fakultas

    Logika FINAL (VALID SESUAI DATA):
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
                COALESCE(c.Fakultas_Pilihan_1, 'Tidak diketahui') AS fakultas
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
                b.fakultas,
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
            fakultas,
            COUNT(DISTINCT CASE
                WHEN status = 'LOLOS'
                THEN CAMARU_ID
            END) AS lolos,
            COUNT(DISTINCT CASE
                WHEN status = 'TIDAK_LOLOS'
                THEN CAMARU_ID
            END) AS tidak_lolos
        FROM status_seleksi
        GROUP BY tahun, fakultas
        ORDER BY tahun, fakultas
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).fetchall()

    return [
        {
            "tahun": row.tahun,
            "fakultas": row.fakultas,
            "lolos": row.lolos,
            "tidak_lolos": row.tidak_lolos
        }
        for row in rows
    ]
