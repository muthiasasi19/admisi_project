# routers/ parent_probability.py
from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine

router = APIRouter(
    prefix="/analytics/parent-distribution",
    tags=["Parent Distribution"]
)

@router.get("/income-mahasiswa")
def distribusi_income_mahasiswa():
    """
    Distribusi income orang tua mahasiswa per tahun ajaran.
    (Setara Google Colab)
    """

    query = text("""
        SELECT
            Angkatan AS tahun,
            CASE
                WHEN total_income = 0 THEN '0'
                WHEN total_income <= 5000000 THEN '0–5 jt'
                WHEN total_income <= 10000000 THEN '5–10 jt'
                WHEN total_income <= 15000000 THEN '10–15 jt'
                WHEN total_income <= 20000000 THEN '15–20 jt'
                ELSE '>20 jt'
            END AS kategori,
            COUNT(*) AS jumlah
        FROM analytics.fact_mahasiswa_family
        GROUP BY
            Angkatan,
            CASE
                WHEN total_income = 0 THEN '0'
                WHEN total_income <= 5000000 THEN '0–5 jt'
                WHEN total_income <= 10000000 THEN '5–10 jt'
                WHEN total_income <= 15000000 THEN '10–15 jt'
                WHEN total_income <= 20000000 THEN '15–20 jt'
                ELSE '>20 jt'
            END
        ORDER BY Angkatan;
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


@router.get("/income-mahasiswa-summary")
def summary_income_mahasiswa():
    """
    Summary:
    - total parent mahasiswa
    - isi income ≠ null
    - isi profesi ≠ null
    - per angkatan
    """
    query = text("""
        SELECT
            Angkatan AS tahun,
            COUNT(*) AS total_parent,
            COUNT(total_income) AS filled_income,
            COUNT(Profesi) AS filled_profesi
        FROM analytics.fact_mahasiswa_family
        GROUP BY Angkatan
        ORDER BY Angkatan;
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).fetchall()

    return [
        {
            "tahun": row.tahun,
            "total_parent": row.total_parent,
            "filled_income": row.filled_income,
            "filled_profesi": row.filled_profesi
        }
        for row in rows
    ]