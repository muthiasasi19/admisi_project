#app/services/test_query.py
import pandas as pd
from backend.app.core.database import engine

def get_camaru_count():
    query = """
    SELECT COUNT(*) AS total
    FROM analytics.fact_camaru_family
    """
    df = pd.read_sql(query, engine)
    return int(df.iloc[0]["total"])
