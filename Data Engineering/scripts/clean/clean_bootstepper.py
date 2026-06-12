from pathlib import Path
import pandas as pd
import re


BASE_DIR = Path(__file__).resolve().parents[2]

INPUT_FILE = BASE_DIR / "data" / "raw" / "bootstepper_dances_raw.csv"
OUTPUT_FILE = BASE_DIR / "data" / "staging" / "bootstepper_dances_clean.csv"


def normalize_text(value):
    if pd.isna(value):
        return ""

    value = str(value).strip()
    value = re.sub(r"\s+", " ", value)
    return value


def normalize_title(value):
    value = normalize_text(value)
    return value.lower()


def is_bad_title(title):
    bad_values = {
        "",
        "videos",
        "views",
        "restarts",
        "1",
        "4",
        "for choreographers",
    }

    return normalize_title(title) in bad_values


def main():
    df = pd.read_csv(INPUT_FILE)

    df["dance_name"] = df["dance_name"].apply(normalize_text)
    df["normalized_title"] = df["dance_name"].apply(normalize_title)
    df["level"] = df["level"].apply(normalize_text)
    df["choreographer"] = df["choreographer"].apply(normalize_text)
    df["music"] = df["music"].apply(normalize_text)

    df = df[~df["dance_name"].apply(is_bad_title)]

    df = df.drop_duplicates(subset=["normalized_title", "level", "music"])

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUTPUT_FILE, index=False)

    print(f"Cleaned {len(df)} BootStepper records")
    print(f"Saved to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()