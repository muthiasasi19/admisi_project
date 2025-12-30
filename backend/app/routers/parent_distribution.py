# routers/ parent_probability.py
from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine

router = APIRouter(
    prefix="/analytics/parent-distribution",
    tags=["Parent Distribution"]
)

@router.get("/income-camaru")
def distribusi_income_camaru():
    """
    Distribusi income orang tua CAMARU per tahun ajaran.
    (Setara Google Colab)
    """

    query = text("""
        SELECT
            THAJARANID AS tahun,
            CASE
                WHEN total_income = 0 THEN '0'
                WHEN total_income <= 5000000 THEN '0–5 jt'
                WHEN total_income <= 10000000 THEN '5–10 jt'
                WHEN total_income <= 15000000 THEN '10–15 jt'
                WHEN total_income <= 20000000 THEN '15–20 jt'
                ELSE '>20 jt'
            END AS kategori,
            COUNT(*) AS jumlah
        FROM analytics.fact_camaru_family
        GROUP BY
            THAJARANID,
            CASE
                WHEN total_income = 0 THEN '0'
                WHEN total_income <= 5000000 THEN '0–5 jt'
                WHEN total_income <= 10000000 THEN '5–10 jt'
                WHEN total_income <= 15000000 THEN '10–15 jt'
                WHEN total_income <= 20000000 THEN '15–20 jt'
                ELSE '>20 jt'
            END
        ORDER BY THAJARANID;
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).fetchall()

    return [
        {
            "tahun": row.tahun,
            "kategori": row.kategori,
            "jumlah": row.jumlah
        }
        for row in rows
    ]
