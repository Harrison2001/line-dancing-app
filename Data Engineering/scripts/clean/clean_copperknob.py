from pathlib import Path
import pandas as pd
import re


BASE_DIR = Path(__file__).resolve().parents[2]

INPUT_FILE = BASE_DIR / "data" / "raw" / "copperknob_dances_raw.csv"
OUTPUT_FILE = BASE_DIR / "data" / "staging" / "dances_staging.csv"


def normalize_text(value):
    if pd.isna(value):
        return ""

    value = str(value).strip()
    value = re.sub(r"\s+", " ", value)
    return value


def normalize_title(value):
    return normalize_text(value).lower()


def safe_int(value):
    value = normalize_text(value)

    match = re.search(r"\d+", value)
    if match:
        return int(match.group())

    return 0


def main():
    if not INPUT_FILE.exists():
        raise FileNotFoundError(f"Missing input file: {INPUT_FILE}")

    df = pd.read_csv(INPUT_FILE)

    print(f"Raw CopperKnob rows: {len(df)}")

    df["dance_name"] = df["dance_name"].apply(normalize_text)
    df["normalized_title"] = df["dance_name"].apply(normalize_title)

    df["choreographer"] = df["choreographer"].apply(normalize_text)
    df["count"] = df["count"].apply(safe_int)
    df["wall"] = df["wall"].apply(safe_int)
    df["level"] = df["level"].apply(normalize_text)
    df["music"] = df["music"].apply(normalize_text)
    df["stepsheet_url"] = df["stepsheet_url"].apply(normalize_text)
    df["source"] = df["source"].apply(normalize_text)
    df["scraped_at"] = df["scraped_at"].apply(normalize_text)

    df = df[df["dance_name"] != ""]

    df = df.drop_duplicates(subset=["normalized_title", "choreographer", "music"])

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUTPUT_FILE, index=False)

    print(f"Clean CopperKnob rows: {len(df)}")
    print(f"Saved to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()