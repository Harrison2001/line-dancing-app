from pathlib import Path
from datetime import datetime, timezone
import csv
import re
import time

import requests
from bs4 import BeautifulSoup


BASE_URL = "https://www.copperknob.co.uk"
RECENT_URL = f"{BASE_URL}/recentlyadded"

BASE_DIR = Path(__file__).resolve().parents[2]
RAW_DIR = BASE_DIR / "data" / "raw"
OUTPUT_FILE = RAW_DIR / "copperknob_dances_raw.csv"

HEADERS = {
    "User-Agent": "LineDanceDiscoveryApp/0.1 educational project"
}


def clean_text(value):
    if not value:
        return ""
    return re.sub(r"\s+", " ", value).strip()


def safe_print(value):
    safe_value = str(value).encode("ascii", errors="replace").decode("ascii")
    print(safe_value)


def get_soup(url):
    response = requests.get(url, headers=HEADERS, timeout=15)
    response.raise_for_status()
    return BeautifulSoup(response.text, "html.parser")


def get_recent_dance_links(limit=10):
    soup = get_soup(RECENT_URL)

    links = []
    seen = set()

    for a in soup.find_all("a", href=True):
        href = a["href"]

        if "/stepsheets/" in href:
            full_url = href if href.startswith("http") else BASE_URL + href
            title = clean_text(a.get_text())

            if full_url not in seen and title:
                seen.add(full_url)
                links.append({
                    "dance_name": title,
                    "stepsheet_url": full_url,
                })

        if len(links) >= limit:
            break

    return links


def parse_detail_page(dance):
    soup = get_soup(dance["stepsheet_url"])

    text_lines = [clean_text(x) for x in soup.get_text("\n").splitlines()]
    text_lines = [x for x in text_lines if x]

    record = {
        "source": "CopperKnob",
        "dance_name": dance["dance_name"],
        "stepsheet_url": dance["stepsheet_url"],
        "count": "",
        "wall": "",
        "level": "",
        "choreographer": "",
        "music": "",
        "scraped_at": datetime.now(timezone.utc).isoformat(),
    }

    for i, line in enumerate(text_lines):
        if line == "Count:" and i + 1 < len(text_lines):
            record["count"] = text_lines[i + 1]

        elif line == "Wall:" and i + 1 < len(text_lines):
            record["wall"] = text_lines[i + 1]

        elif line == "Level:" and i + 1 < len(text_lines):
            record["level"] = text_lines[i + 1]

        elif line == "Choreographer:" and i + 1 < len(text_lines):
            record["choreographer"] = text_lines[i + 1]

        elif line == "Music:" and i + 1 < len(text_lines):
            record["music"] = text_lines[i + 1]

    return record


def save_to_csv(records):
    RAW_DIR.mkdir(parents=True, exist_ok=True)

    fieldnames = [
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

    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)


def main():
    safe_print("Getting recent CopperKnob dance links...")

    dance_links = get_recent_dance_links(limit=10)
    safe_print(f"Found {len(dance_links)} dance links.")

    records = []

    for dance in dance_links:
        safe_name = dance["dance_name"].encode("ascii", errors="replace").decode("ascii")
        safe_print(f"Scraping: {safe_name}")

        try:
            record = parse_detail_page(dance)
            records.append(record)
        except requests.RequestException as error:
            safe_print(f"Failed to scrape {safe_name}: {error}")

        time.sleep(1)

    save_to_csv(records)

    safe_print(f"Saved {len(records)} records to:")
    safe_print(OUTPUT_FILE)


if __name__ == "__main__":
    main()