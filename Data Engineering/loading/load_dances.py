from pathlib import Path
import json
from pymongo import MongoClient
from dotenv import load_dotenv
import os

BASE_DIR = Path(__file__).resolve().parents[1]
PROJECT_DIR = BASE_DIR.parent

BACKEND_ENV = PROJECT_DIR / "backend" / ".env"
DATA_FILE = BASE_DIR / "data" / "exports" / "dances_for_database.json"

load_dotenv(BACKEND_ENV)

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "line_dancing_app")

if not MONGO_URI:
    raise ValueError(f"MONGO_URI not found. Checked: {BACKEND_ENV}")

client = MongoClient(MONGO_URI)

try:
    client.admin.command("ping")
    print("✅ MongoDB connection successful")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    raise

db = client[DATABASE_NAME]
collection = db["dances"]


def main():
    if not DATA_FILE.exists():
        raise FileNotFoundError(f"Missing export file: {DATA_FILE}")

    print(f"📂 Loading from: {DATA_FILE}")

    with open(DATA_FILE, "r", encoding="utf-8") as file:
        dances = json.load(file)

    print(f"🕺 Found {len(dances)} dances")

    if not dances:
        print("⚠️ No dances found. Nothing to load.")
        return

    delete_result = collection.delete_many({})
    print(f"🗑️ Deleted {delete_result.deleted_count} existing dances")

    result = collection.insert_many(dances)

    print(f"✅ Inserted {len(result.inserted_ids)} dances")
    print(f"📊 Database: {DATABASE_NAME}")
    print("📁 Collection: dances")

    total = collection.count_documents({})
    print(f"🔍 Verification: {total} documents currently in collection")


if __name__ == "__main__":
    main()