#etl/utils/db_writer.py

from utils.database import engine

def write_fact_table(df, table_name):
    df.to_sql(
        name=table_name,
        schema="analytics",
        con=engine,
        if_exists="replace",   # FULL REBUILD (AMAN SEKARANG)
        index=False,
        chunksize=5000
    )
