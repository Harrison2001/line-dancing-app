from pathlib import Path
from datetime import datetime, timezone
from urllib.parse import urljoin
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

REQUEST_DELAY = 1.0

DIFFICULTY_LEVELS = [
    "Absolute Beginner",
    "High Beginner",
    "Beginner",
    "Easy Improver",
    "High Improver",
    "Improver",
    "Easy Intermediate",
    "High Intermediate",
    "Intermediate",
    "Easy Advanced",
    "Advanced",
]

SKIP_LINES = {
    "spotify",
    "play",
    "share",
    "pdf",
    "submit video",
    "command palette",
    "search for a command to run...",
}


def clean_text(value):
    if not value:
        return ""
    return re.sub(r"\s+", " ", value).strip()


def safe_print(value):
    safe_value = str(value).encode("ascii", errors="replace").decode("ascii")
    print(safe_value)


def get_soup(url):
    response = requests.get(url, headers=HEADERS, timeout=30)
    response.raise_for_status()
    return BeautifulSoup(response.text, "html.parser")


def extract_listing_links(soup):
    seen = set()
    dances = []

    for anchor in soup.find_all("a", href=True):
        href = anchor["href"]
        match = re.match(r"^/dances/([A-Z0-9]+)$", href)
        if not match:
            continue

        dance_id = match.group(1)
        if dance_id in seen:
            continue

        title = clean_text(anchor.get_text())
        if not title or title.lower() in {"view", "actions"}:
            continue

        seen.add(dance_id)
        dances.append(
            {
                "dance_id": dance_id,
                "dance_name": title,
                "stepsheet_url": urljoin(BASE_URL, href),
            }
        )

    return dances


def parse_detail_page(dance):
    soup = get_soup(dance["stepsheet_url"])
    lines = [clean_text(line) for line in soup.get_text("\n").splitlines()]
    lines = [line for line in lines if line]

    title = dance["dance_name"]
    level = ""
    choreographer = ""
    music = ""
    artist = ""
    release_date = ""

    for index, line in enumerate(lines):
        if line not in DIFFICULTY_LEVELS:
            continue

        level = line

        if index > 0:
            page_title = lines[index - 1]
            if page_title and page_title.lower() not in {"dances", "submit dance"}:
                title = page_title

        if index + 1 < len(lines):
            choreographer = lines[index + 1]

        for offset in range(index + 2, min(index + 15, len(lines))):
            candidate = lines[offset]
            if candidate.lower() in SKIP_LINES:
                continue

            if offset + 1 < len(lines) and lines[offset + 1].lower() == "by":
                music = candidate
                if offset + 2 < len(lines):
                    artist = lines[offset + 2]
                break

        break

    header_match = re.search(
        r"^(.+?)\s*-\s*(.+?)\s*-\s*([A-Za-z]+\s+\d{4})$",
        lines[0] if lines else "",
    )
    if header_match:
        title = clean_text(header_match.group(1)) or title
        choreographer = clean_text(header_match.group(2)) or choreographer
        release_date = clean_text(header_match.group(3))

    return {
        "source": "BootStepper",
        "dance_name": title,
        "level": level,
        "release_date": release_date,
        "choreographer": choreographer,
        "music": music,
        "artist": artist,
        "stepsheet_url": dance["stepsheet_url"],
        "scraped_at": datetime.now(timezone.utc).isoformat(),
    }


def save_to_csv(records):
    RAW_DIR.mkdir(parents=True, exist_ok=True)

    fieldnames = [
        "source",
        "dance_name",
        "level",
        "release_date",
        "choreographer",
        "music",
        "artist",
        "stepsheet_url",
        "scraped_at",
    ]

    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)


def collect_bootstepper_dances():
    safe_print(f"Fetching BootStepper listing: {DANCES_URL}")
    listing_soup = get_soup(DANCES_URL)
    dance_links = extract_listing_links(listing_soup)
    safe_print(f"Found {len(dance_links)} dances on listing page.")

    records = []

    for index, dance in enumerate(dance_links, start=1):
        safe_print(f"[{index}/{len(dance_links)}] Scraping: {dance['dance_name']}")

        try:
            records.append(parse_detail_page(dance))
        except requests.RequestException as error:
            safe_print(f"Failed to scrape {dance['dance_name']}: {error}")

        time.sleep(REQUEST_DELAY)

    return records


def main():
    safe_print("Collecting BootStepper dances...")

    try:
        records = collect_bootstepper_dances()
    except requests.RequestException as error:
        safe_print(f"Failed to collect BootStepper data: {error}")
        return

    save_to_csv(records)

    safe_print(f"Saved {len(records)} records to:")
    safe_print(OUTPUT_FILE)


if __name__ == "__main__":
    main()
