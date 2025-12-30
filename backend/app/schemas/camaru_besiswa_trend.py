# app/schemas/camaru_beasiswa_trend.py

from pydantic import BaseModel

class CamaruBeasiswaTrendPerJenisResponse(BaseModel):
    tahun: int
    jenis_beasiswa: str
    total_pendaftar: int
