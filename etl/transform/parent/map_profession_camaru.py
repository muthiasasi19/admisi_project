# etl/transform/parent/map_profession_camaru.py

import pandas as pd


def map_profession_camaru(df: pd.DataFrame) -> pd.DataFrame:
    """
    Mapping profesi CAMARU_PARENT (FAMILY LEVEL).
    - In-place (TIMPA kolom Profesi)
    - Tidak menambah kolom baru
    - Dipanggil SETELAH apply_parent_aggregation
    """

    df = df.copy()

    if "Profesi" not in df.columns:
        raise KeyError("Kolom 'Profesi' wajib ada sebelum mapping profesi")

    # =========================
    # 1. Normalisasi teks
    # =========================
    df["Profesi"] = (
        df["Profesi"]
        .astype(str)
        .str.lower()
        .str.strip()
    )

    # =========================
    # 2. Mapping profesi camaru
    # =========================
    mapping_camaru = {
        "akademisi": "Swasta",
        "sarjana baru lulus": "Swasta",
        "petani": "Swasta",
        "pegawai": "ASN",  # asumsi pegawai = ASN
        "wiraswasta": "Swasta",
        "profesional (akuntan, dokter, dll)": "Swasta"
    }

    df["Profesi"] = df["Profesi"].replace(mapping_camaru)

    # =========================
    # 3. Safety fallback
    # =========================
    df["Profesi"] = df["Profesi"].fillna("Swasta")

    return df
