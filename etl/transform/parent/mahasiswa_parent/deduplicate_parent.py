# etl/transform/parent/mahasiswa_parent/deduplicate_parent.py

import pandas as pd


def deduplicate_parent(df: pd.DataFrame) -> pd.DataFrame:
    """
    Dedup ayah / ibu per Nim.
    - Prioritas Income terbesar
    - Income NaN diprioritaskan paling bawah
    """

    df = df.copy()

    if "Nim" not in df.columns:
        raise KeyError("Kolom 'Nim' tidak ditemukan")

    df["_income_sort"] = df["Income"].where(
        df["Income"].notna(),
        -1
    )

    df = (
        df
        .sort_values(
            ["Nim", "Parent_Type_Id", "_income_sort"],
            ascending=[True, True, False]
        )
        .drop_duplicates(
            subset=["Nim", "Parent_Type_Id"],
            keep="first"
        )
        .drop(columns="_income_sort")
        .copy()
    )

    return df
