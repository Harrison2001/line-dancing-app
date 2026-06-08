from pathlib import Path
import json
import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[1]

PROCESSED_FILE = BASE_DIR / "data" / "processed" / "dances_processed.csv"
EXPORTS_DIR = BASE_DIR / "data" / "exports"
OUTPUT_FILE = EXPORTS_DIR / "dances_for_database.json"


def normalize_record(record):
    return {
        "source": str(record.get("source", "")).strip(),
        "danceName": str(record.get("dance_name", "")).strip(),
        "choreographer": str(record.get("choreographer", "")).strip(),
        "count": int(record.get("count", 0)),
        "wall": int(record.get("wall", 0)),
        "level": str(record.get("level", "")).strip(),
        "music": str(record.get("music", "")).strip(),
        "stepsheetUrl": str(record.get("stepsheet_url", "")).strip(),
        "scrapedAt": str(record.get("scraped_at", "")).strip(),
    }


def main():
    if not PROCESSED_FILE.exists():
        raise FileNotFoundError(f"Missing processed file: {PROCESSED_FILE}")

    df = pd.read_csv(PROCESSED_FILE)

    records = []

    for _, row in df.iterrows():
        record = normalize_record(row.to_dict())
        records.append(record)

    EXPORTS_DIR.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
        json.dump(records, file, indent=2, ensure_ascii=False)

    print(f"Prepared {len(records)} dance records for database loading")
    print(f"Saved to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()