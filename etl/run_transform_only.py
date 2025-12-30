# etl/run_transform_only.py
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

from transform.parent.normalize_profession import normalize_profession_column
from transform.parent.drop_wali import drop_wali
from transform.province.apply_province import apply_province_resolution
from transform.income.impute_from_ump import impute_income_from_ump
from transform.apply_parent_aggregation import apply_parent_aggregation
from transform.parent.map_profession_camaru import map_profession_camaru

from extract import extract_table

df_parent = extract_table("SELECT * FROM dbo.camaru_parent")
df_camaru = extract_table("SELECT * FROM dbo.Camaru")
df_ref    = extract_table("SELECT * FROM dbo.Ref_Provinsi_Kabupaten_Kota")
df_ump    = extract_table("SELECT * FROM dbo.Upah_Minimum_Provinsi")

print("RAW parent rows:", len(df_parent))

# 1. NORMALISASI PROFESI
df_parent = normalize_profession_column(df_parent)

# 2. DROP WALI
df_parent = drop_wali(df_parent)

# 3. RESOLVE PROVINSI
df_parent = apply_province_resolution(
    df_parent=df_parent,
    df_camaru=df_camaru,
    df_ref_location=df_ref
)

# 4. IMPUTASI INCOME INDIVIDUAL
df_parent = impute_income_from_ump(
    df=df_parent,
    ump_df=df_ump
)

# 5. AGREGASI FAMILY (total_income + profesi utama)
df_final = apply_parent_aggregation(df_parent)

# 6. MAPPING PROFESI (FINAL)
df_final = map_profession_camaru(df_final)

print("FINAL rows:", len(df_final))
print("Unique Camaru:", df_final["Camaru_Id"].nunique())


print("\n=== SANITY CHECK : CAMARU_PARENT ===")

# 1. 1 Camaru = 1 baris
print("Duplicate Camaru_Id:",
      df_final["Camaru_Id"].duplicated().sum())

# 2. Wali tidak ikut
print("Contains wali:",
      "Parent_Type_Id" in df_final.columns)

# 3. Income harus numerik
print("Income dtype:",
      df_final["total_income"].dtype)

# 4. Income = 0 tapi profesi tidak valid
invalid_zero = df_final.query(
    "total_income == 0 and Profesi not in ['tidak bekerja', 'tidak terdaftar', 'pensiun']"
)
print("Invalid zero income rows:", len(invalid_zero))

# 5. Proporsi imputasi
if "is_imputed_income" in df_final.columns:
    print("Imputed income ratio:",
          df_final["is_imputed_income"].mean())

# 6. Profesi distribution
print("\nProfesi distribution:")
print(df_final["Profesi"].value_counts(dropna=False))


print("\n=== SAMPLE DATA ===")
print(df_final.sample(5))

# =========================
# 7. LOAD TO DATABASE
# =========================
from utils.db_writer import write_fact_table

print("Writing analytics.fact_camaru_family...")
write_fact_table(df_final, "fact_camaru_family")
print("✅ fact_camaru_family written")
