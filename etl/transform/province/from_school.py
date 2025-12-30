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


def detect_province_from_school(school_name: str, lookup: dict):
    """
    Deteksi provinsi dari nama sekolah.
    Return provinsi jika hasil UNIK.
    Return None jika ambigu / tidak terdeteksi.
    """

    if not isinstance(school_name, str):
        return None

    school_name = school_name.upper()

    found = set()
    for lokasi, prov in lookup.items():
        if lokasi in school_name:
            found.add(prov)

    if len(found) == 1:
        return list(found)[0]

    return None
