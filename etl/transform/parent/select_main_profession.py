# Select_main_profession.py

import pandas as pd
import numpy as np


def select_main_profession(df: pd.DataFrame) -> pd.DataFrame:
    """
    Menghasilkan 1 baris per Camaru_Id:
    - Profesi parent dengan income terbesar
    - Income NaN diprioritaskan paling rendah
    """

    df = df.copy()

    df["income_sort"] = df["Income"].where(
        df["Income"].notna(),
        -1
    )

    selected = (
        df
        .sort_values(
            ["Camaru_Id", "income_sort"],
            ascending=[True, False]
        )
        .drop_duplicates(subset=["Camaru_Id"], keep="first")
        [["Camaru_Id", "NAMA_PROFESI"]]
        .rename(columns={"NAMA_PROFESI": "Profesi"})  # ✅ FIX ERROR DI SINI
        .copy()
    )

    return selected
