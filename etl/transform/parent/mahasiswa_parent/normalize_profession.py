# etl/transform/parent/mahasiswa_parent/normalize_profession.py
import pandas as pd


def normalize_profession(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normalisasi teks profesi mahasiswa_parent.
    - lowercase
    - strip
    - TIDAK mapping kategori
    """

    df = df.copy()

    if "Profesi" not in df.columns:
        raise KeyError("Kolom 'Profesi' tidak ditemukan")

    df["Profesi"] = (
        df["Profesi"]
        .astype(str)
        .str.lower()
        .str.strip()
    )

    return df
