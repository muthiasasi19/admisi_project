# app/schemas/camaru_beasiswa.py

from pydantic import BaseModel

class CamaruBeasiswaStatusResponse(BaseModel):
    tahun: int
    lolos: int
    tidak_lolos: int
    konversi: int
