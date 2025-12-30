# routers/trend_beasiswa
from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine

router = APIRouter(
    prefix="/analytics/camaru-beasiswa",
    tags=["Camaru Beasiswa"]
)



@router.get("/trend")
def trend_beasiswa():
    """
    Trend Camaru Beasiswa per Tahun Ajaran
    - Total pendaftar beasiswa
    - Jumlah lolos
    - Jumlah tidak lolos
    """

    query = text("""
        SELECT
            c.THAJARANID AS thajaranid,
            COUNT(DISTINCT cb.Camaru_Id) AS total_beasiswa,
            COUNT(DISTINCT ac.CAMARU_ID) AS lolos,
            COUNT(DISTINCT cb.Camaru_Id)
              - COUNT(DISTINCT ac.CAMARU_ID) AS tidak_lolos
        FROM Camaru_Beasiswa cb
        JOIN Camaru c
            ON cb.Camaru_Id = c.CAMARU_ID
        LEFT JOIN ACCEPTED_CANDIDATES ac
            ON cb.Camaru_Id = ac.CAMARU_ID
        GROUP BY c.THAJARANID
        ORDER BY c.THAJARANID
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).fetchall()

    return [
        {
            "thajaranid": row.thajaranid,
            "total_beasiswa": row.total_beasiswa,
            "lolos": row.lolos,
            "tidak_lolos": row.tidak_lolos
        }
        for row in rows
    ]
