from pathlib import Path
from datetime import datetime, timezone
import csv
import re
import time

import requests
from bs4 import BeautifulSoup


BASE_URL = "https://bootstepper.com"
DANCES_URL = f"{BASE_URL}/dances"

BASE_DIR = Path(__file__).resolve().parents[2]
RAW_DIR = BASE_DIR / "data" / "raw"
OUTPUT_FILE = RAW_DIR / "bootstepper_dances_raw.csv"

HEADERS = {
    "User-Agent": "LineDanceDiscoveryApp/0.1 educational project"
}


def clean_text(value):
    if not value:
        return ""
    return re.sub(r"\s+", " ", value).strip()


def get_soup(url):
    response = requests.get(url, headers=HEADERS, timeout=15)
    response.raise_for_status()
    return BeautifulSoup(response.text, "html.parser")


def save_to_csv(records):
    RAW_DIR.mkdir(parents=True, exist_ok=True)

    fieldnames = [
        "source",
        "dance_name",
        "level",
        "release_date",
        "choreographer",
        "music",
        "stepsheet_url",
        "scraped_at",
    ]

    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)


def collect_bootstepper_dances(limit=10):
    soup = get_soup(DANCES_URL)

    text_lines = [clean_text(x) for x in soup.get_text("\n").splitlines()]
    text_lines = [x for x in text_lines if x]

    records = []
    scraped_at = datetime.now(timezone.utc).isoformat()

    # This is a simple first-pass parser.
    # BootStepper is more app-like, so we may need to adjust this after seeing output.
    for i, line in enumerate(text_lines):
        if len(records) >= limit:
            break

        possible_title = line

        # Skip common UI text
        skip_words = {
            "Dances",
            "Submit a Dance",
            "Filters",
            "View",
            "Actions",
            "Steps",
            "Command Palette",
            "Search for a command to run...",
            "Search dances...",
        }

        if possible_title in skip_words:
            continue

        # Rough pattern based on BootStepper listing:
        # title -> level/month -> choreographer -> song
        level = ""
        release_date = ""
        choreographer = ""
        music = ""

        next_lines = text_lines[i + 1:i + 8]

        for item in next_lines:
            if any(level_word in item for level_word in [
                "Absolute Beginner",
                "Beginner",
                "Improver",
                "Intermediate",
                "Advanced",
            ]):
                level = item

            elif " - " in item and not music:
                music = item

            elif not choreographer and item not in skip_words:
                choreographer = item

        # Only keep rows that look like actual dance records
        if level or music:
            records.append({
                "source": "BootStepper",
                "dance_name": possible_title,
                "level": level,
                "release_date": release_date,
                "choreographer": choreographer,
                "music": music,
                "stepsheet_url": DANCES_URL,
                "scraped_at": scraped_at,
            })

    return records


def main():
    print("Collecting BootStepper dances...")

    try:
        records = collect_bootstepper_dances(limit=10)
    except requests.RequestException as error:
        print(f"Failed to collect BootStepper data: {error}")
        return

    time.sleep(1)

    save_to_csv(records)

    print(f"Saved {len(records)} records to:")
    print(OUTPUT_FILE)


if __name__ == "__main__":
    main()