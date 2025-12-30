# etl/transform/province/apply_province.py
import pandas as pd

from transform.province.ref_lookup import build_location_lookup
from transform.province.from_school import detect_province_from_school
from transform.province.from_birthplace import detect_province_from_birthplace
from transform.province.resolve_province import resolve_province


def apply_province_resolution(
    df_parent: pd.DataFrame,
    df_camaru: pd.DataFrame,
    df_ref_location: pd.DataFrame
) -> pd.DataFrame:
    """
    Menghasilkan kolom `provinsi_final` pada df_parent
    sesuai kontrak imputasi provinsi bertingkat:

    S1: Nama_Provinsi (parent)
    S2: Provinsi (camaru)
    S3: Asal_Sekolah (unik)
    S4: tempat_lahir (unik)
    """

    # =========================
    # 1. BUILD LOOKUP REFERENSI
    # =========================
    lookup = build_location_lookup(df_ref_location)

    # =========================
    # 2. NORMALISASI NAMA KOLOM CAMARU (CASE-INSENSITIVE)
    # =========================
    camaru_col_map = {c.lower(): c for c in df_camaru.columns}

    def col(name: str):
        return camaru_col_map.get(name.lower())

    required = {
        "CAMARU_ID": col("camaru_id"),
        "Provinsi_camaru": col("provinsi"),
        "Asal_Sekolah": col("asal_sekolah"),
        "tempat_lahir": col("tempat_lahir"),
    }

    missing = [k for k, v in required.items() if v is None]
    if missing:
        raise KeyError(f"Kolom wajib tidak ditemukan di tabel Camaru: {missing}")

    camaru_cols = (
        df_camaru[list(required.values())]
        .rename(columns={v: k for k, v in required.items()})
        .copy()
    )

    # =========================
    # 3. MERGE PARENT × CAMARU
    # =========================
    df = df_parent.merge(
        camaru_cols,
        left_on="Camaru_Id",
        right_on="CAMARU_ID",
        how="left"
    )

    # =========================
    # 4. DETEKSI PROVINSI S3 & S4
    # =========================
    # // AKU MELAKUKAN PERUBAHAN DISINI
    df["prov_from_school"] = df["Asal_Sekolah"].apply(
        lambda x: detect_province_from_school(x, lookup)
        if isinstance(x, str) else None
    )
    # // SAMPAI SINI

    df["prov_from_birthplace"] = df["tempat_lahir"].apply(
        lambda x: detect_province_from_birthplace(x, lookup)
        if isinstance(x, str) else None
    )

    # =========================
    # 5. RESOLVE PROVINSI FINAL
    # =========================
    df["provinsi_final"] = resolve_province(
        prov_parent=df["Nama_Provinsi"],
        prov_camaru=df["Provinsi_camaru"],
        prov_from_school=df["prov_from_school"],
        prov_from_birthplace=df["prov_from_birthplace"]
    )

    # =========================
    # 6. DROP KOLOM BANTU
    # =========================
    df = df.drop(
        columns=[
            "CAMARU_ID",
            "Provinsi_camaru",
            "Asal_Sekolah",
            "tempat_lahir",
            "prov_from_school",
            "prov_from_birthplace",
        ],
        errors="ignore"
    )

    return df
