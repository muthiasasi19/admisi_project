# routers/parent_probability.py
from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine

router = APIRouter(
    prefix="/analytics/profesi-probability",
    tags=["Profesi Probability"]
)

@router.get("/registrasi-by-profesi-per-tahun")
def probabilitas_registrasi_profesi_per_tahun():
    """
    Probabilitas historis registrasi berdasarkan PROFESI orang tua per tahun ajaran
    """

    query = text("""
        WITH base AS (
            SELECT
                f.Camaru_Id,
                f.THAJARANID AS tahun,
                COALESCE(f.Profesi, 'Tidak diketahui') AS profesi
            FROM analytics.fact_camaru_family f
        )
        SELECT
            b.tahun,
            b.profesi,
            COUNT(*) AS total_camaru,
            SUM(CASE WHEN m.Nim IS NOT NULL THEN 1 ELSE 0 END) AS total_registrasi,
            CAST(SUM(CASE WHEN m.Nim IS NOT NULL THEN 1 ELSE 0 END) AS FLOAT)
                / COUNT(*) AS probabilitas
        FROM base b
        LEFT JOIN analytics.fact_mahasiswa_family m
            ON b.Camaru_Id = m.Camaru_Id
        GROUP BY
            b.tahun,
            b.profesi
        ORDER BY
            b.tahun,
            b.profesi;
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).fetchall()

    return [
        {
            "tahun": row.tahun,
            "profesi": row.profesi,
            "total_camaru": row.total_camaru,
            "total_registrasi": row.total_registrasi,
            "probabilitas": round(row.probabilitas * 100, 2)
        }
        for row in rows
    ]
