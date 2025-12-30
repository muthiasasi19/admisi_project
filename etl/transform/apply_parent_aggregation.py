# apply_parent_aggregation.py

import pandas as pd

from transform.parent.drop_wali import drop_wali
from transform.parent.deduplicate_parent import deduplicate_parent
from transform.parent.aggregate_income import aggregate_income
from transform.parent.select_main_profession import select_main_profession


def apply_parent_aggregation(df_parent: pd.DataFrame) -> pd.DataFrame:
    """
    Menghasilkan 1 baris per Camaru:
    - total_income
    - profesi utama
    - provinsi_final
    - THAJARANID
    """

    # =========================
    # 1. Buang wali
    # =========================
    df = drop_wali(df_parent)

    # =========================
    # 2. Dedup ayah / ibu
    # =========================
    df = deduplicate_parent(df)

    # =========================
    # 3. Simpan atribut FAMILY-LEVEL (JANGAN HILANG)
    # =========================
    family_ref = (
        df[["Camaru_Id", "provinsi_final", "THAJARANID"]]
        .drop_duplicates(subset=["Camaru_Id"])
        .copy()
    )

    # =========================
    # 4. Hitung total income
    # =========================
    income_sum = aggregate_income(df)

    # =========================
    # 5. Pilih profesi utama
    # =========================
    main_prof = select_main_profession(df)

    # =========================
    # 6. Gabungkan SEMUA
    # =========================
    result = (
        main_prof
        .merge(income_sum, on="Camaru_Id", how="left")
        .merge(family_ref, on="Camaru_Id", how="left")
        .copy()
    )

    return result
