import pandas as pd


def detect_province_from_school(
    school_series: pd.Series,
    lookup: dict
) -> pd.Series:
    """
    Deteksi provinsi dari kolom Asal_Sekolah.
    HANYA return jika hasil unik (1 provinsi).
    """

    def detect(text):
        if pd.isna(text):
            return None

        text = str(text).upper()

        found = set()
        for lokasi, prov in lookup.items():
            if lokasi in text:
                found.add(prov)

        if len(found) == 1:
            return list(found)[0]

        return None  # ambigu / tidak terdeteksi

    return school_series.apply(detect)

def detect_province_from_birthplace(birthplace: str, lookup: dict):
    """
    Deteksi provinsi dari kolom Tempat_Lahir.
    Return provinsi jika hasil UNIK.
    Return None jika ambigu / tidak terdeteksi.
    """

    if not isinstance(birthplace, str):
        return None

    birthplace = birthplace.upper()

    found = set()
    for lokasi, prov in lookup.items():
        if lokasi in birthplace:
            found.add(prov)

    if len(found) == 1:
        return list(found)[0]

    return None
