#main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import trend_beasiswa
from app.routers import camaru_beasiswa_trend_per_jenis
from app.routers import trend_lolos_per_jenis
from app.routers import camaru_beasiswa_status_fakultas
from app.routers import camaru_beasiswa_lolos_prodi
from app.routers import camaru_beasiswa_status
from app.routers import camaru_beasiswa_konversi
from app.routers import camaru_beasiswa_konversi_persentase
from app.routers import camaru_beasiswa_konversi_top_prodi
from app.routers import parent_probability
from app.routers import profesi_probability
from app.routers import parent_distribution
from app.routers import parent_mahasiswa_distribution


app = FastAPI(
    title="Analytics Camaru Beasiswa",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"]
)


# include routers
app.include_router(trend_beasiswa.router)
app.include_router(camaru_beasiswa_trend_per_jenis.router)
app.include_router(trend_lolos_per_jenis.router)
app.include_router(camaru_beasiswa_status_fakultas.router)
app.include_router(camaru_beasiswa_lolos_prodi.router)
app.include_router(camaru_beasiswa_status.router)
app.include_router(camaru_beasiswa_konversi.router)
app.include_router(camaru_beasiswa_konversi_persentase.router)
app.include_router(camaru_beasiswa_konversi_top_prodi.router)
app.include_router(parent_probability.router)
app.include_router(profesi_probability.router)
app.include_router(parent_distribution.router)
app.include_router(parent_mahasiswa_distribution.router)

