from pathlib import Path
import json
import re
import os

from dotenv import load_dotenv
from pymongo import MongoClient


BASE_DIR = Path(__file__).resolve().parents[2]  # Data Engineering
PROJECT_DIR = BASE_DIR.parent                   # Line dancing App

BACKEND_ENV = PROJECT_DIR / "backend" / ".env"
DATA_FILE = BASE_DIR / "data" / "exports" / "dances_for_database.json"

load_dotenv(BACKEND_ENV)

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "line_dancing_app")

if not MONGO_URI:
    raise ValueError(f"MONGO_URI not found. Checked: {BACKEND_ENV}")


def make_slug(text):
    text = str(text or "").lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def safe_int(value, default=0):
    try:
        if value is None or value == "":
            return default
        return int(float(value))
    except (ValueError, TypeError):
        return default


def normalize_dance(record):
    title = (
        record.get("title")
        or record.get("danceName")
        or record.get("dance_name")
        or ""
    )

    source_name = (
        record.get("sourceName")
        or record.get("source")
        or "Unknown"
    )

    stepsheet_url = (
        record.get("stepsheetUrl")
        or record.get("stepsheet_url")
        or record.get("sourceUrl")
        or ""
    )

    count_value = record.get("counts") or record.get("count")
    wall_value = record.get("walls") or record.get("wall")

    return {
        "title": str(title).strip(),
        "danceName": str(title).strip(),
        "slug": record.get("slug") or make_slug(title),

        "choreographer": str(record.get("choreographer", "")).strip(),

        "songTitle": str(record.get("songTitle") or record.get("music") or "").strip(),
        "artist": str(record.get("artist", "")).strip(),

        "difficulty": str(record.get("difficulty") or record.get("level") or "").strip(),
        "counts": safe_int(count_value),
        "walls": safe_int(wall_value),

        "style": str(record.get("style") or "Line Dance").strip(),

        "sourceName": str(source_name).strip(),
        "sourceUrl": str(record.get("sourceUrl") or stepsheet_url).strip(),
        "stepsheetUrl": str(stepsheet_url).strip(),
        "sourceLinks": record.get("sourceLinks") or record.get("source_links") or [],

        "demoUrl": str(record.get("demoUrl", "")).strip(),
        "tutorialUrl": str(record.get("tutorialUrl", "")).strip(),
        "bestDemoVideo": str(
            record.get("bestDemoVideo") or record.get("best_demo_video") or ""
        ).strip(),
        "bestTutorialVideo": str(
            record.get("bestTutorialVideo") or record.get("best_tutorial_video") or ""
        ).strip(),
        "thumbnailUrl": str(record.get("thumbnailUrl", "")).strip(),

        "description": str(
            record.get("description") or f"Imported dance record for {title}"
        ).strip(),

        "tags": record.get("tags") or [
            "imported",
            "line-dance",
            str(source_name).lower(),
        ],

        "views": safe_int(record.get("views")),
        "saves": safe_int(record.get("saves")),

        "isActive": record.get("isActive", True),
        "isVerified": record.get("isVerified", False),

        "scrapedAt": str(
            record.get("scrapedAt") or record.get("scraped_at") or ""
        ).strip(),

        "normalizedSongKey": str(record.get("normalizedSongKey", "")).strip(),
        "sameSongVersionCount": safe_int(record.get("sameSongVersionCount")),
        "sameSongSlugs": record.get("sameSongSlugs") or [],
    }


def main():
    if not DATA_FILE.exists():
        raise FileNotFoundError(f"Missing export file: {DATA_FILE}")

    print(f"Loading from: {DATA_FILE}")

    with open(DATA_FILE, "r", encoding="utf-8") as file:
        raw_dances = json.load(file)

    print(f"Found {len(raw_dances)} raw dances")

    if not raw_dances:
        print("No dances found. Nothing to load.")
        return

    client = MongoClient(MONGO_URI)

    try:
        client.admin.command("ping")
        print("MongoDB connection successful")
    except Exception as error:
        print(f"MongoDB connection failed: {error}")
        raise

    db = client[DATABASE_NAME]
    collection = db["dances"]

    loaded_count = 0

    for record in raw_dances:
        dance = normalize_dance(record)

        if not dance["slug"]:
            print("Skipped record with missing slug")
            continue

        collection.update_one(
            {"slug": dance["slug"]},
            {"$set": dance},
            upsert=True,
        )

        loaded_count += 1

    print(f"Loaded/upserted {loaded_count} dances")
    print(f"Database: {DATABASE_NAME}")
    print("Collection: dances")

    total = collection.count_documents({})
    print(f"Verification: {total} documents currently in collection")

    client.close()


if __name__ == "__main__":
    main()