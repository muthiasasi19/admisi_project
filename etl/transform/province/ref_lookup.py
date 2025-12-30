import pandas as pd


def build_location_lookup(df_ref: pd.DataFrame) -> dict:
    """
    Membangun lookup:
    { 'KOTA/KABUPATEN' : 'PROVINSI' }

    df_ref wajib punya kolom:
    - Provinsi
    - Kabupaten
    - Kota
    """

    lookup = {}

    for _, row in df_ref.iterrows():
        prov = str(row["Provinsi"]).strip().upper()

        if pd.notna(row.get("Kota")) and row["Kota"].strip() != "":
            lookup[row["Kota"].strip().upper()] = prov

        if pd.notna(row.get("Kabupaten")) and row["Kabupaten"].strip() != "":
            lookup[row["Kabupaten"].strip().upper()] = prov

    return lookup
