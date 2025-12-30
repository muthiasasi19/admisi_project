#etl/transform/province/resolve_province.py
import pandas as pd
import numpy as np


def resolve_province(
    prov_parent: pd.Series,
    prov_camaru: pd.Series,
    prov_from_school: pd.Series,
    prov_from_birthplace: pd.Series
) -> pd.Series:
    """
    Menentukan provinsi final berdasarkan prioritas deterministik:

    Prioritas:
    1. Provinsi dari tabel parent (S1)
    2. Provinsi dari tabel Camaru (S2)
    3. Deteksi Asal Sekolah (unik saja) (S3)
    4. Deteksi Tempat Lahir (unik saja) (S4)
    5. Jika semua gagal -> NULL

    Semua input adalah pd.Series dengan index yang sama.
    """

    # Pastikan semua dalam format string atau NaN
    def normalize(series):
        return (
            series
            .astype(str)
            .str.strip()
            .replace({"": np.nan, "nan": np.nan, "None": np.nan})
        )

    s1 = normalize(prov_parent)
    s2 = normalize(prov_camaru)
    s3 = normalize(prov_from_school)
    s4 = normalize(prov_from_birthplace)

    # Step 1: mulai dari NULL
    result = pd.Series(np.nan, index=s1.index)

    # Step 2: isi dari S1
    mask = s1.notna()
    result.loc[mask] = s1.loc[mask]

    # Step 3: isi dari S2 (jika belum terisi)
    mask = result.isna() & s2.notna()
    result.loc[mask] = s2.loc[mask]

    # Step 4: isi dari S3 (jika belum terisi)
    mask = result.isna() & s3.notna()
    result.loc[mask] = s3.loc[mask]

    # Step 5: isi dari S4 (jika belum terisi)
    mask = result.isna() & s4.notna()
    result.loc[mask] = s4.loc[mask]

    return result
