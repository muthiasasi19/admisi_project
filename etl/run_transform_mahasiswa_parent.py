# etl/run_transform_mahasiswa_parent.py
import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[1]  # ADMISI/
load_dotenv(BASE_DIR / ".env")

print("DEBUG ENV CHECK")
print("DB_NAME:", os.getenv("DB_NAME"))
print("DB_PASSWORD:", os.getenv("DB_PASSWORD"))
print("DB_SERVER  :", os.getenv("DB_SERVER"))
print("DB_DRIVER  :", os.getenv("DB_DRIVER"))
print("="*40)

import pandas as pd

# =========================
# IMPORT TRANSFORM MODULE
# =========================
from transform.parent.mahasiswa_parent.normalize_profession import normalize_profession
from transform.parent.mahasiswa_parent.drop_wali import drop_wali
from transform.parent.mahasiswa_parent.apply_parent_aggregation import apply_parent_aggregation
from transform.parent.mahasiswa_parent.map_profession_mahasiswa import map_profession_mahasiswa
from transform.parent.mahasiswa_parent.apply_province import apply_province_mahasiswa_parent

from transform.income.impute_from_ump import impute_income_from_ump



# =========================
# LOAD DATA FROM SQL SERVER
# =========================
from extract import extract_table

df_parent = extract_table("SELECT * FROM dbo.mahasiswa_parent")
df_ump    = extract_table("SELECT * FROM dbo.Upah_Minimum_Provinsi")
df_ref    = extract_table("SELECT * FROM dbo.Ref_Provinsi_Kabupaten_Kota")

print("RAW mahasiswa_parent rows:", len(df_parent))

# =========================
# 1. NORMALISASI PROFESI
# =========================
df_parent = normalize_profession(df_parent)

# =========================
# 2. DROP WALI
# =========================
df_parent = drop_wali(df_parent)

# =========================
# 3. IMPUTASI PROVINSI
# =========================
df_parent = apply_province_mahasiswa_parent(
    df_parent=df_parent,
    df_ref_location=df_ref
)

# =========================
# 4. IMPUTASI INCOME INDIVIDUAL (UMP)
# =========================
df_parent = impute_income_from_ump(
    df=df_parent,
    ump_df=df_ump,
    province_col="provinsi_final",   # ✅ BENAR
    income_col="Income",
    year_col="Angkatan"
)

# =========================
# 5. AGREGASI FAMILY
# =========================
df_final = apply_parent_aggregation(df_parent)

# =========================
# 6. MAPPING PROFESI (FINAL)
# =========================
df_final = map_profession_mahasiswa(df_final)

print("\n=== SANITY CHECK : MAHASISWA_PARENT ===")

# 1. 1 mahasiswa = 1 baris
print("Duplicate NIM:",
      df_final["Nim"].duplicated().sum())

# 2. Wali tidak ikut
print("Contains wali:",
      "Parent_Type_Id" in df_final.columns)

# 3. Income harus numerik
print("Income dtype:",
      df_final["total_income"].dtype)

# 4. Income NULL / 0
print("Income NULL count:",
      df_final["total_income"].isna().sum())

print("Income = 0 count:",
      (df_final["total_income"] == 0).sum())

# 5. Profesi NULL (boleh)
print("\nProfesi NULL count:",
      df_final["Profesi"].isna().sum())

# 6. Profesi distribution
print("\nProfesi distribution:")
print(df_final["Profesi"].value_counts(dropna=False))

# =========================
# SAMPLE OUTPUT
# =========================
print("\n=== SAMPLE DATA ===")
print(df_final.sample(5))

# =========================
# 7. LOAD TO DATABASE
# =========================
from utils.db_writer import write_fact_table

print("Writing analytics.fact_mahasiswa_family...")
write_fact_table(df_final, "fact_mahasiswa_family")
print("✅ fact_mahasiswa_family written")
