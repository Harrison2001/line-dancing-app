from pathlib import Path
import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[1]

STAGING_FILE = BASE_DIR / "data" / "staging" / "dances_staging.csv"

PROCESSED_DIR = BASE_DIR / "data" / "processed"
VALID_OUTPUT_FILE = PROCESSED_DIR / "dances_processed.csv"
INVALID_OUTPUT_FILE = PROCESSED_DIR / "dances_invalid.csv"


REQUIRED_COLUMNS = [
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


def is_valid_url(value):
    value = str(value).strip()
    return value.startswith("https://www.copperknob.co.uk/")


def is_valid_number(value):
    try:
        if pd.isna(value) or str(value).strip() == "":
            return False
        return int(float(value)) > 0
    except ValueError:
        return False


def validate_row(row):
    errors = []

    if str(row["dance_name"]).strip() == "":
        errors.append("missing_dance_name")

    if str(row["stepsheet_url"]).strip() == "":
        errors.append("missing_stepsheet_url")
    elif not is_valid_url(row["stepsheet_url"]):
        errors.append("invalid_stepsheet_url")

    if not is_valid_number(row["count"]):
        errors.append("invalid_count")

    if not is_valid_number(row["wall"]):
        errors.append("invalid_wall")

    if str(row["level"]).strip() == "" or str(row["level"]).strip() == "Unknown":
        errors.append("unknown_level")

    return errors


def main():
    if not STAGING_FILE.exists():
        raise FileNotFoundError(f"Missing staging file: {STAGING_FILE}")

    df = pd.read_csv(STAGING_FILE)

    for column in REQUIRED_COLUMNS:
        if column not in df.columns:
            df[column] = ""

    df = df[REQUIRED_COLUMNS]

    df["validation_errors"] = df.apply(
        lambda row: ",".join(validate_row(row)),
        axis=1
    )

    valid_df = df[df["validation_errors"] == ""].copy()
    invalid_df = df[df["validation_errors"] != ""].copy()

    valid_df = valid_df.drop(columns=["validation_errors"])

    valid_df = valid_df.drop_duplicates(subset=["stepsheet_url"])

    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    valid_df.to_csv(VALID_OUTPUT_FILE, index=False)
    invalid_df.to_csv(INVALID_OUTPUT_FILE, index=False)

    print(f"Valid records: {len(valid_df)}")
    print(f"Invalid records: {len(invalid_df)}")
    print(f"Saved valid records to: {VALID_OUTPUT_FILE}")
    print(f"Saved invalid records to: {INVALID_OUTPUT_FILE}")


if __name__ == "__main__":
    main()