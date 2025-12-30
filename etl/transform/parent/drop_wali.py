import pandas as pd


def drop_wali(df: pd.DataFrame) -> pd.DataFrame:
    """
    Menghapus baris dengan Parent_Type_Id = 3 (wali).
    """
    return df[df["Parent_Type_Id"] != 3].copy()
