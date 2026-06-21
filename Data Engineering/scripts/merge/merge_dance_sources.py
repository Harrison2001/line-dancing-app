from pathlib import Path
import json
import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[2]

STAGING_DIR = BASE_DIR / "data" / "staging"
PROCESSED_DIR = BASE_DIR / "data" / "processed"
EXPORTS_DIR = BASE_DIR / "data" / "exports"

COPPERKNOB_FILE = STAGING_DIR / "dances_staging.csv"
BOOTSTEPPER_FILE = STAGING_DIR / "bootstepper_dances_clean.csv"

PROCESSED_FILE = PROCESSED_DIR / "merged_dances.json"
EXPORT_FILE = EXPORTS_DIR / "dances_for_database.json"


def clean_value(value):
    if pd.isna(value):
        return ""
    return str(value).strip()


def make_normalized_title(title):
    return clean_value(title).lower()


def map_copperknob_record(row):
    return {
        "title": clean_value(row.get("dance_name")),
        "dance_name": clean_value(row.get("dance_name")),
        "normalized_title": make_normalized_title(row.get("dance_name")),
        "difficulty": clean_value(row.get("level")),
        "counts": clean_value(row.get("count")),
        "walls": clean_value(row.get("wall")),
        "choreographer": clean_value(row.get("choreographer")),
        "songTitle": clean_value(row.get("music")),
        "artist": "",
        "sourceName": "CopperKnob",
        "sourceUrl": clean_value(row.get("stepsheet_url")),
        "stepsheetUrl": clean_value(row.get("stepsheet_url")),
        "source_links": [clean_value(row.get("stepsheet_url"))],
        "best_demo_video": "",
        "best_tutorial_video": "",
        "quality_score": 0,
    }


def map_bootstepper_record(row):
    return {
        "title": clean_value(row.get("dance_name")),
        "dance_name": clean_value(row.get("dance_name")),
        "normalized_title": make_normalized_title(row.get("dance_name")),
        "difficulty": clean_value(row.get("level")),
        "counts": "",
        "walls": "",
        "choreographer": clean_value(row.get("choreographer")),
        "songTitle": clean_value(row.get("music")),
        "artist": clean_value(row.get("artist")),
        "sourceName": "BootStepper",
        "sourceUrl": clean_value(row.get("stepsheet_url")),
        "stepsheetUrl": clean_value(row.get("stepsheet_url")),
        "source_links": [clean_value(row.get("stepsheet_url"))],
        "best_demo_video": "",
        "best_tutorial_video": "",
        "quality_score": 0,
    }


def calculate_quality_score(record):
    score = 0

    important_fields = [
        "title",
        "difficulty",
        "counts",
        "walls",
        "choreographer",
        "songTitle",
        "sourceUrl",
    ]

    for field in important_fields:
        if record.get(field):
            score += 10

    return min(score, 100)


def merge_two_records(base, incoming):
    for key, value in incoming.items():
        if key == "source_links":
            base_links = base.get("source_links", [])
            incoming_links = incoming.get("source_links", [])
            base["source_links"] = list(set(base_links + incoming_links))

        elif not base.get(key) and value:
            base[key] = value

    base["quality_score"] = calculate_quality_score(base)
    return base


def load_records():
    records = []

    if COPPERKNOB_FILE.exists():
        copperknob_df = pd.read_csv(COPPERKNOB_FILE)
        for _, row in copperknob_df.iterrows():
            records.append(map_copperknob_record(row))

    if BOOTSTEPPER_FILE.exists():
        bootstepper_df = pd.read_csv(BOOTSTEPPER_FILE)
        for _, row in bootstepper_df.iterrows():
            records.append(map_bootstepper_record(row))

    return records


def main():
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    EXPORTS_DIR.mkdir(parents=True, exist_ok=True)

    source_records = load_records()

    merged = {}

    for record in source_records:
        key = record.get("normalized_title")

        if not key:
            continue

        if key not in merged:
            record["quality_score"] = calculate_quality_score(record)
            merged[key] = record
        else:
            merged[key] = merge_two_records(merged[key], record)

    final_records = list(merged.values())

    with open(PROCESSED_FILE, "w", encoding="utf-8") as file:
        json.dump(final_records, file, indent=2, ensure_ascii=False)

    with open(EXPORT_FILE, "w", encoding="utf-8") as file:
        json.dump(final_records, file, indent=2, ensure_ascii=False)

    print(f"Loaded {len(source_records)} source records")
    print(f"Merged into {len(final_records)} final dance records")
    print(f"Saved processed file: {PROCESSED_FILE}")
    print(f"Saved export file: {EXPORT_FILE}")


if __name__ == "__main__":
    main()