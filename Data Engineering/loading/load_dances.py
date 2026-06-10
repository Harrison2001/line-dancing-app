from pathlib import Path
import json
import re
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


def make_slug(text):
    text = str(text or "").lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def normalize_dance(record):
    title = record.get("title") or record.get("danceName") or record.get("dance_name") or ""
    source_name = record.get("sourceName") or record.get("source") or "CopperKnob"
    stepsheet_url = record.get("stepsheetUrl") or record.get("stepsheet_url") or record.get("sourceUrl") or ""

    return {
        "title": str(title).strip(),
        "danceName": str(title).strip(),
        "slug": record.get("slug") or make_slug(title),
        "choreographer": str(record.get("choreographer", "")).strip(),

        "songTitle": str(record.get("songTitle") or record.get("music") or "").strip(),
        "artist": str(record.get("artist", "")).strip(),

        "difficulty": str(record.get("difficulty") or record.get("level") or "").strip(),
        "counts": int(record.get("counts") or record.get("count") or 0),
        "walls": int(record.get("walls") or record.get("wall") or 0),

        "style": str(record.get("style") or "Line Dance").strip(),

        "sourceName": str(source_name).strip(),
        "sourceUrl": str(record.get("sourceUrl") or stepsheet_url).strip(),
        "stepsheetUrl": str(stepsheet_url).strip(),

        "demoUrl": str(record.get("demoUrl", "")).strip(),
        "tutorialUrl": str(record.get("tutorialUrl", "")).strip(),
        "thumbnailUrl": str(record.get("thumbnailUrl", "")).strip(),

        "description": str(
            record.get("description") or f"Imported dance record for {title}"
        ).strip(),

        "tags": record.get("tags") or ["imported", "line-dance", str(source_name).lower()],
        "views": int(record.get("views", 0)),
        "saves": int(record.get("saves", 0)),

        "isActive": record.get("isActive", True),
        "isVerified": record.get("isVerified", False),

        "scrapedAt": str(record.get("scrapedAt") or record.get("scraped_at") or "").strip(),
    }


def main():
    if not DATA_FILE.exists():
        raise FileNotFoundError(f"Missing export file: {DATA_FILE}")

    print(f"📂 Loading from: {DATA_FILE}")

    with open(DATA_FILE, "r", encoding="utf-8") as file:
        raw_dances = json.load(file)

    print(f"🕺 Found {len(raw_dances)} raw dances")

    if not raw_dances:
        print("⚠️ No dances found. Nothing to load.")
        return

    dances = [normalize_dance(record) for record in raw_dances]

    delete_result = collection.delete_many({})
    print(f"🗑️ Deleted {delete_result.deleted_count} existing dances")

    result = collection.insert_many(dances)

    print(f"✅ Inserted {len(result.inserted_ids)} normalized dances")
    print(f"📊 Database: {DATABASE_NAME}")
    print("📁 Collection: dances")

    total = collection.count_documents({})
    print(f"🔍 Verification: {total} documents currently in collection")


if __name__ == "__main__":
    main()