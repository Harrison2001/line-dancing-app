from pathlib import Path
import json
import csv
import re


BASE_DIR = Path(__file__).resolve().parents[2]

PROCESSED_FILE = BASE_DIR / "data" / "processed" / "merged_dances.json"
INVALID_FILE = BASE_DIR / "data" / "processed" / "dances_invalid.csv"
EXPORT_FILE = BASE_DIR / "data" / "exports" / "dances_for_database.json"


def make_slug(text):
    text = str(text or "").lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def is_valid_record(record):
    errors = []

    title = str(record.get("title") or "").strip()
    source_url = str(record.get("sourceUrl") or record.get("stepsheetUrl") or "").strip()

    if not title:
        errors.append("missing_title")

    if not source_url:
        errors.append("missing_source_url")

    slug = record.get("slug") or make_slug(title)
    record["slug"] = slug

    if not slug:
        errors.append("missing_slug")

    return len(errors) == 0, errors, record


def main():
    if not PROCESSED_FILE.exists():
        raise FileNotFoundError(f"Missing processed file: {PROCESSED_FILE}")

    with open(PROCESSED_FILE, "r", encoding="utf-8") as file:
        records = json.load(file)

    valid_records = []
    invalid_records = []

    for record in records:
        is_valid, errors, updated_record = is_valid_record(record)

        if is_valid:
            valid_records.append(updated_record)
        else:
            invalid_records.append({
                "title": record.get("title", ""),
                "sourceUrl": record.get("sourceUrl", ""),
                "errors": "|".join(errors),
            })

    EXPORT_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(EXPORT_FILE, "w", encoding="utf-8") as file:
        json.dump(valid_records, file, indent=2, ensure_ascii=False)

    INVALID_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(INVALID_FILE, "w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=["title", "sourceUrl", "errors"])
        writer.writeheader()
        writer.writerows(invalid_records)

    print(f"Processed records: {len(records)}")
    print(f"Valid records: {len(valid_records)}")
    print(f"Invalid records: {len(invalid_records)}")
    print(f"Export saved to: {EXPORT_FILE}")
    print(f"Invalid saved to: {INVALID_FILE}")


if __name__ == "__main__":
    main()