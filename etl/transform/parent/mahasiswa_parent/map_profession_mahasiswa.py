# etl/transform/parent/mahasiswa_parent/map_profession_mahasiswa.py
import pandas as pd


def map_profession_mahasiswa(df: pd.DataFrame) -> pd.DataFrame:
    """
    Mapping profesi MAHASISWA_PARENT.
    - In-place (TIMPA kolom Profesi)
    - TANPA kolom baru
    - Versi FINAL (Google Colab)
    """

    df = df.copy()

    if "Profesi" not in df.columns:
        raise KeyError("Kolom 'Profesi' wajib ada")

    # =========================
    # 1. Normalisasi teks
    # =========================
    df["Profesi"] = (
        df["Profesi"]
        .astype(str)
        .str.lower()
        .str.strip()
    )

    mask_null = df["Profesi"].isin(["nan", "none", ""]) | df["Profesi"].isna()

    # =========================
    # 2. Mapping profesi
    # =========================
    mapping_parent = {
        "pegawai negeri": "ASN",
        "tni/polri": "Militer",
        "pegawai swasta": "Swasta",
        "usaha sendiri": "Swasta",
        "wiraswasta": "Swasta",
        "tidak bekerja": "tidak bekerja",
        "[tidak terdaftar]": "tidak terdaftar",
        "lain-lain": "Swasta",
        "tenaga pengajar/instruktur/fasilitator": "Swasta",
        "pensiun": "pensiun",
        "petani": "Swasta",
        "pedagang kecil": "Swasta",
        "buruh": "Swasta",
        "pedagang besar": "Swasta",
        "pimpinan/manajerial": "Swasta",
        "tim ahli/konsultan": "Swasta",
        "nelayan": "Swasta",
        "peneliti": "Swasta",
        "peternak": "Swasta",
    }

    df["Profesi"] = df["Profesi"].replace(mapping_parent)

    # =========================
    # 3. Tangani null asli
    # =========================
    df.loc[mask_null, "Profesi"] = "Tidak Diketahui"
    df["Profesi"] = df["Profesi"].fillna("Swasta")

    return df

