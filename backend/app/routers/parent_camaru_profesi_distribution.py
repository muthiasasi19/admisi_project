# routers/parent_camaru_profesi_distribution.py
from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine

router = APIRouter(
    prefix="/analytics/parent-distribution",
    tags=["Parent Distribution"]
)

@router.get("/profesi-camaru")
def distribusi_profesi_camaru():
    """
    Distribusi profesi orang tua CAMARU per tahun ajaran.
    (Setara Google Colab)
    """

    query = text("""
        SELECT
            THAJARANID AS tahun,
            COALESCE(Profesi, 'Tidak Diketahui') AS profesi,
            COUNT(*) AS jumlah
        FROM analytics.fact_camaru_family
        GROUP BY
            THAJARANID,
            COALESCE(Profesi, 'Tidak Diketahui')
        ORDER BY
            THAJARANID;
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).fetchall()

    return [
        {
            "tahun": row.tahun,
            "profesi": row.profesi,
            "jumlah": row.jumlah
        }
        for row in rows
    ]
