# routers/camaru_beasiswa_trend_per_jenis.py
from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine

router = APIRouter(
    prefix="/analytics/camaru-beasiswa",
    tags=["Camaru Beasiswa"]
)

@router.get("/trend-per-jenis")
def trend_pendaftar_per_tahun_per_jenis():
    """
    Trend Pendaftar Beasiswa per Tahun per Jenis Beasiswa

    Logika:
    - Camaru JOIN Camaru_Beasiswa
    - Hitung per Camaru_ID
    - Handle null → 'Tidak diketahui'
    """

    query = text("""
        SELECT
            c.THAJARANID AS tahun,
            COALESCE(cb.Jenis_Beasiswa, 'Tidak diketahui') AS jenis_beasiswa,
            COUNT(DISTINCT c.CAMARU_ID) AS total_pendaftar
        FROM Camaru c
        JOIN Camaru_Beasiswa cb
            ON c.CAMARU_ID = cb.Camaru_Id
        GROUP BY
            c.THAJARANID,
            COALESCE(cb.Jenis_Beasiswa, 'Tidak diketahui')
        ORDER BY
            c.THAJARANID,
            jenis_beasiswa
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).fetchall()

    return [
        {
            "tahun": row.tahun,
            "jenis_beasiswa": row.jenis_beasiswa,
            "total_pendaftar": row.total_pendaftar
        }
        for row in rows
    ]
