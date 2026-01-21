# routers/parent_probability.py
from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine

router = APIRouter(
    prefix="/analytics/parent-probability",
    tags=["Parent Probability"]
)

@router.get("/registrasi-by-income-per-tahun")
def probabilitas_registrasi_income_per_tahun():
    #""
   #Probabilitas historis registrasi berdasarkan income orang tua per tahun ajaran
   #"""

    query = text("""
        WITH base AS (
            SELECT
                f.Camaru_Id,
                f.THAJARANID AS tahun,
                CASE
                    WHEN f.total_income = 0 THEN '0'
                    WHEN f.total_income <= 5000000 THEN '0–5 jt'
                    WHEN f.total_income <= 10000000 THEN '5–10 jt'
                    WHEN f.total_income <= 15000000 THEN '10–15 jt'
                    WHEN f.total_income <= 20000000 THEN '15–20 jt'
                    ELSE '>20 jt'
                END AS kategori_income
            FROM analytics.fact_camaru_family f
        )
        SELECT
            b.tahun,
            b.kategori_income,
            COUNT(*) AS total_camaru,
            SUM(CASE WHEN m.Nim IS NOT NULL THEN 1 ELSE 0 END) AS total_registrasi,
            CAST(SUM(CASE WHEN m.Nim IS NOT NULL THEN 1 ELSE 0 END) AS FLOAT)
                / COUNT(*) AS probabilitas
        FROM base b
        LEFT JOIN analytics.fact_mahasiswa_family m
            ON b.Camaru_Id = m.Camaru_Id
        GROUP BY
            b.tahun,
            b.kategori_income
        ORDER BY
            b.tahun,
            b.kategori_income;
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).fetchall()

    return [
        {
            "tahun": row.tahun,
            "kategori_income": row.kategori_income,
            "total_camaru": row.total_camaru,
            "total_registrasi": row.total_registrasi,
            "probabilitas": round(row.probabilitas * 100, 2)
        }
        for row in rows
    ]

