import pandas as pd


def deduplicate_parent(df: pd.DataFrame) -> pd.DataFrame:
    """
    Menghapus duplikat berdasarkan:
    (Camaru_Id, Parent_Type_Id)

    Mengambil baris pertama (sesuai Colab).
    """

    return (
        df
        .drop_duplicates(
            subset=["Camaru_Id", "Parent_Type_Id"],
            keep="first"
        )
        .copy()
    )
