import os
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "DRIVER": os.getenv("DB_DRIVER"),
    "SERVER": os.getenv("DB_SERVER"),
    "DATABASE": os.getenv("DB_NAME"),
    "USERNAME": os.getenv("DB_USER"),
    "PASSWORD": os.getenv("DB_PASSWORD"),
}
