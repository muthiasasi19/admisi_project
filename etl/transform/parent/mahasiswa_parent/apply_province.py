# etl/transform/parent/mahasiswa_parent/apply_province.py

import pandas as pd
import numpy as np

from transform.province.ref_lookup import build_location_lookup
from transform.province.resolve_province import resolve_province


def apply_province_mahasiswa_parent(
    df_parent: pd.DataFrame,
    df_ref_location: pd.DataFrame
) -> pd.DataFrame:
    """
    Resolve provinsi untuk mahasiswa_parent.
    Prioritas:
    1. Nama_Provinsi
    2. Lookup dari Nama_Kota
    """

    df = df_parent.copy()

    # =========================
    # 1. Build lookup kota → provinsi
    # =========================
    lookup = build_location_lookup(df_ref_location)

    # =========================
    # 2. Deteksi provinsi dari kota
    # =========================
    prov_from_city = (
        df["Nama_Kota"]
        .astype(str)
        .str.strip()
        .str.upper()
        .map(lookup)
    )

    # =========================
    # 3. Resolve provinsi final
    # =========================
    df["provinsi_final"] = resolve_province(
        prov_parent=df["Nama_Provinsi"],
        prov_camaru=pd.Series(np.nan, index=df.index),
        prov_from_school=pd.Series(np.nan, index=df.index),
        prov_from_birthplace=prov_from_city
    )

    return df
