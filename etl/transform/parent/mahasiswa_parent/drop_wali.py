# etl/transform/parent/mahasiswa_parent/drop_wali.py
import pandas as pd


def drop_wali(df: pd.DataFrame) -> pd.DataFrame:
    """
    Buang wali.
    Parent_Type_Id:
    - 1 = Ayah
    - 2 = Ibu
    - 3 = Wali (DROP)
    """

    df = df.copy()

    if "Parent_Type_Id" not in df.columns:
        raise KeyError("Kolom Parent_Type_Id tidak ditemukan")

    return df[df["Parent_Type_Id"] != 3].copy()
