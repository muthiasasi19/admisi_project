#etl/utils/database.py

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()

DATABASE_URL = (
    f"mssql+pyodbc://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_SERVER')}/{os.getenv('DB_NAME')}"
    f"?driver={os.getenv('DB_DRIVER').replace(' ', '+')}"
)

engine = create_engine(DATABASE_URL)
