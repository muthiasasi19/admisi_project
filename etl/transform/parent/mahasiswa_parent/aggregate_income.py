# etl/transform/parent/mahasiswa_parent/aggregate_income.py

import pandas as pd


def aggregate_income(df: pd.DataFrame) -> pd.DataFrame:
    """
    Aggregate total income keluarga per NIM.
    - Income dipaksa numeric
    - NULL / invalid → NaN
    """

    df = df.copy()

    df["Income"] = pd.to_numeric(
        df["Income"],
        errors="coerce"
    )

    income_sum = (
        df
        .groupby("Nim", as_index=False)["Income"]
        .sum(min_count=1)
        .rename(columns={"Income": "total_income"})
    )

    return income_sum
