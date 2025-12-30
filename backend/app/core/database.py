import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()

DB_SERVER = os.getenv("DB_SERVER")
DB_DATABASE = os.getenv("DB_DATABASE")
DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_DRIVER = os.getenv("DB_DRIVER")

DATABASE_URL = (
    f"mssql+pyodbc://{DB_USERNAME}:{DB_PASSWORD}"
    f"@{DB_SERVER}/{DB_DATABASE}"
    f"?driver={DB_DRIVER.replace(' ', '+')}"
)

engine = create_engine(DATABASE_URL)
