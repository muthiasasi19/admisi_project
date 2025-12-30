
# etl/extract.py
import pandas as pd
import pyodbc
from config import DB_CONFIG

def get_connection():
    conn_str = (
        f"DRIVER={{{DB_CONFIG['DRIVER']}}};"
        f"SERVER={DB_CONFIG['SERVER']};"
        f"DATABASE={DB_CONFIG['DATABASE']};"
        f"UID={DB_CONFIG['USERNAME']};"
        f"PWD={DB_CONFIG['PASSWORD']};"
        "TrustServerCertificate=yes;"
    )
    return pyodbc.connect(conn_str)

def extract_table(query: str) -> pd.DataFrame:
    conn = get_connection()
    df = pd.read_sql(query, conn)
    conn.close()
    return df
