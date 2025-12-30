# etl/transform/parent/mahasiswa_parent/apply_parent_aggregation.py
import pandas as pd

from transform.parent.mahasiswa_parent.drop_wali import drop_wali
from transform.parent.mahasiswa_parent.deduplicate_parent import deduplicate_parent
from transform.parent.mahasiswa_parent.aggregate_income import aggregate_income
from transform.parent.mahasiswa_parent.select_main_profession import select_main_profession


def apply_parent_aggregation(df_parent: pd.DataFrame) -> pd.DataFrame:
    """
    Output FINAL mahasiswa_parent:
    - 1 baris per Nim
    - Camaru_Id (FK, TIDAK BOLEH HILANG)
    - total_income (family)
    - Profesi utama (income terbesar)
    - Angkatan
    """

    # 1. Drop wali
    df = drop_wali(df_parent)

    # 2. Dedup ayah / ibu
    df = deduplicate_parent(df)

    # 3. Simpan atribut mahasiswa-level (🔥 TAMBAHKAN Camaru_Id)
    ref = (
        df[["Nim", "Camaru_Id", "Angkatan"]]
        .drop_duplicates(subset=["Nim"])
        .copy()
    )

    # 4. Aggregate income (family)
    income_sum = aggregate_income(df)

    # 5. Select main profession (pakai income FINAL)
    main_prof = select_main_profession(df)

    # 6. Merge semua (pakai Nim sebagai grain)
    result = (
        ref
        .merge(main_prof, on="Nim", how="left")
        .merge(income_sum, on="Nim", how="left")
        .copy()
    )

    return result


