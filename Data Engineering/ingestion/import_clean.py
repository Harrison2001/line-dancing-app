from pathlib import Path
import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[1]

RAW_FILE = BASE_DIR / "data" / "raw" / "dances_raw.csv"

STAGING_DIR = BASE_DIR / "data" / "staging"
OUTPUT_FILE = STAGING_DIR / "dances_staging.csv"


def normalize_text(value):
    if pd.isna(value):
        return ""

    return str(value).strip()


def normalize_level(value):
    value = normalize_text(value).lower()

    if "absolute beginner" in value:
        return "Absolute Beginner"
    if "high beginner" in value:
        return "High Beginner"
    if "beginner" in value:
        return "Beginner"
    if "improver" in value:
        return "Improver"
    if "intermediate" in value:
        return "Intermediate"
    if "advanced" in value:
        return "Advanced"

    return "Unknown"


def main():
    if not RAW_FILE.exists():
        raise FileNotFoundError(f"Missing raw file: {RAW_FILE}")

    df = pd.read_csv(RAW_FILE)

    required_columns = [
        "source",
        "dance_name",
        "choreographer",
        "count",
        "wall",
        "level",
        "music",
        "stepsheet_url",
        "scraped_at",
    ]

    for column in required_columns:
        if column not in df.columns:
            df[column] = ""

    df["source"] = df["source"].apply(normalize_text)
    df["dance_name"] = df["dance_name"].apply(normalize_text)
    df["choreographer"] = df["choreographer"].apply(normalize_text)
    df["count"] = df["count"].apply(normalize_text)
    df["wall"] = df["wall"].apply(normalize_text)
    df["level"] = df["level"].apply(normalize_level)
    df["music"] = df["music"].apply(normalize_text)
    df["stepsheet_url"] = df["stepsheet_url"].apply(normalize_text)
    df["scraped_at"] = df["scraped_at"].apply(normalize_text)

    df = df[df["dance_name"] != ""]
    df = df.drop_duplicates(subset=["dance_name", "choreographer", "music", "stepsheet_url"])

    df = df[required_columns]

    STAGING_DIR.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUTPUT_FILE, index=False)

    print(f"Cleaned {len(df)} dance records")
    print(f"Saved to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()