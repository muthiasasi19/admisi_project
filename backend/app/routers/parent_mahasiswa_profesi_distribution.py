# routers/parent_mahasiswa_distribution.py
from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine

router = APIRouter(
    prefix="/analytics/parent-distribution",
    tags=["Parent Distribution"]
)

@router.get("/profesi-mahasiswa")
def distribusi_profesi_mahasiswa():
    """
    Distribusi profesi orang tua mahasiswa per tahun ajaran.
    (Setara Google Colab)
    """

    query = text("""
        SELECT
            Angkatan AS tahun,
            COALESCE(Profesi, 'Tidak Diketahui') AS profesi,
            COUNT(*) AS jumlah
        FROM analytics.fact_mahasiswa_family
        GROUP BY
            Angkatan,
            COALESCE(Profesi, 'Tidak Diketahui')
        ORDER BY
            Angkatan;
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
