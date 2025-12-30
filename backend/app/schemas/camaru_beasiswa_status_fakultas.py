# app/schemas/camaru_beasiswa_status_fakultas.py

from pydantic import BaseModel

class CamaruBeasiswaStatusFakultasResponse(BaseModel):
    tahun: int
    fakultas: str
    lolos: int
    tidak_lolos: int
