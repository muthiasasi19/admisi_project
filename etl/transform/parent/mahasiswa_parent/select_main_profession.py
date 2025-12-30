# etl/transform/parent/mahasiswa_parent/select_main_profession.py
import pandas as pd


def select_main_profession(df: pd.DataFrame) -> pd.DataFrame:
    """
    Pilih profesi dengan income terbesar per Nim.
    - Income NaN paling rendah
    """

    df = df.copy()

    if "Nim" not in df.columns:
        raise KeyError("Kolom 'Nim' tidak ditemukan")

    df["_income_sort"] = df["Income"].where(
        df["Income"].notna(),
        -1
    )

    selected = (
        df
        .sort_values(
            ["Nim", "_income_sort"],
            ascending=[True, False]
        )
        .drop_duplicates(subset=["Nim"], keep="first")
        [["Nim", "Profesi"]]
        .copy()
    )

    return selected
