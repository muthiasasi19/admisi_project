import pandas as pd

def normalize_profession_column(df: pd.DataFrame) -> pd.DataFrame:
    """
    Menyatukan kolom profesi dari:
    - camaru_parent  → NAMA_PROFESI
    - mahasiswa_parent → Profesi
    Menjadi: profesi_parent
    """

    df = df.copy()

    if "NAMA_PROFESI" in df.columns:
        df["profesi_parent"] = df["NAMA_PROFESI"]
    elif "Profesi" in df.columns:
        df["profesi_parent"] = df["Profesi"]
    else:
        df["profesi_parent"] = None

    return df
