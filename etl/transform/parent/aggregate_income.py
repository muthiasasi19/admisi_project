import pandas as pd


def aggregate_income(df: pd.DataFrame) -> pd.DataFrame:
    """
    Menghitung total income keluarga per Camaru.
    - NaN diabaikan
    - Jika semua NaN → hasil NaN
    """

    income_sum = (
        df
        .groupby("Camaru_Id", as_index=False)["Income"]
        .sum(min_count=1)
        .rename(columns={"Income": "total_income"})
    )

    return income_sum
