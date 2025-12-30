# trend_lolos_per_jenis.py
from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine

router = APIRouter(
    prefix="/analytics/camaru-beasiswa",
    tags=["Camaru Beasiswa"]
)

@router.get("/trend-lolos-per-jenis")
def trend_lolos_per_jenis():
    """
    Trend Lolos vs Tidak Lolos Beasiswa per Tahun per Jenis Beasiswa

    Output:
    - total_lolos
    - total_tidak_lolos

    FE:
    → grouped bar chart (lolos vs tidak lolos)
    """

    query = text("""
        WITH base AS (
            SELECT
                c.CAMARU_ID,
                c.THAJARANID AS tahun,
                COALESCE(cb.Jenis_Beasiswa, 'Tidak diketahui') AS jenis_beasiswa
            FROM Camaru c
            JOIN Camaru_Beasiswa cb
                ON c.CAMARU_ID = cb.Camaru_Id
        )

        SELECT
            b.tahun,
            b.jenis_beasiswa,

            COUNT(DISTINCT CASE
                WHEN ac.CAMARU_ID IS NOT NULL
                THEN b.CAMARU_ID
            END) AS total_lolos,

            COUNT(DISTINCT CASE
                WHEN ac.CAMARU_ID IS NULL
                THEN b.CAMARU_ID
            END) AS total_tidak_lolos

        FROM base b
        LEFT JOIN ACCEPTED_CANDIDATES ac
            ON b.CAMARU_ID = ac.CAMARU_ID

        GROUP BY
            b.tahun,
            b.jenis_beasiswa

        ORDER BY
            b.tahun,
            b.jenis_beasiswa
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).fetchall()

    return [
        {
            "tahun": row.tahun,
            "jenis_beasiswa": row.jenis_beasiswa,
            "total_lolos": row.total_lolos,
            "total_tidak_lolos": row.total_tidak_lolos
        }
        for row in rows
    ]
