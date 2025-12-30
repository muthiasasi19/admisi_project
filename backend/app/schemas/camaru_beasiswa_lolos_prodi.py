# app/schemas/camaru_beasiswa_lolos_prodi.py

from pydantic import BaseModel

class CamaruBeasiswaLolosProdiResponse(BaseModel):
    tahun: int
    prodi: str
    total_lolos: int
