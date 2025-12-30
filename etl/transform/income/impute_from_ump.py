#impute_from_ump
import pandas as pd


def impute_income_from_ump(
    df: pd.DataFrame,
    ump_df: pd.DataFrame,
    province_col: str = "provinsi_final",
    income_col: str = "Income",          # ⬅️ FIX: individual-level
    year_col: str = "THAJARANID"
) -> pd.DataFrame:
    """
    Imputasi income ORANG TUA berdasarkan:
    - Provinsi
    - Tahun ajaran
    """

    df = df.copy()
    ump_df = ump_df.copy()

    if "Provinsi" not in ump_df.columns:
        raise KeyError("Tabel UMP wajib punya kolom 'Provinsi'")

    if province_col not in df.columns:
        raise KeyError(f"Kolom {province_col} tidak ditemukan di df")

    if income_col not in df.columns:
        raise KeyError(f"Kolom {income_col} tidak ditemukan di df")

    df["_prov_norm"] = df[province_col].str.lower().str.strip()
    ump_df["_prov_norm"] = ump_df["Provinsi"].str.lower().str.strip()

    mask = df[income_col].isna() | (df[income_col] == 0)
    imputed_count = 0

    for idx in df[mask].index:
        prov = df.at[idx, "_prov_norm"]
        tahun = df.at[idx, year_col]

        if pd.isna(prov) or pd.isna(tahun):
            continue

        col_tahun = f"Tahun_{int(tahun)}"
        if col_tahun not in ump_df.columns:
            continue

        rows = ump_df[ump_df["_prov_norm"] == prov]
        if rows.empty:
            continue

        ump_value = rows[col_tahun].dropna()
        if ump_value.empty:
            continue

        df.at[idx, income_col] = float(ump_value.iloc[0])
        imputed_count += 1

    df.drop(columns=["_prov_norm"], inplace=True)

    print(f"UMP Imputation (INDIVIDUAL) applied to {imputed_count} rows")

    return df
