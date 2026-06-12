from pathlib import Path
from datetime import datetime, timezone
import csv
import re
import time

import requests
from bs4 import BeautifulSoup


BASE_URL = "https://www.copperknob.co.uk"
POPULAR_URL = f"{BASE_URL}/mostpopular"

MAX_DANCES = 100
PAGE_SIZE = 20
REQUEST_DELAY = 1.0

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
    response = requests.get(url, headers=HEADERS, timeout=20)
    response.raise_for_status()
    return BeautifulSoup(response.text, "html.parser")


def get_popular_page_url(recnum):
    if recnum == 0:
        return POPULAR_URL

    return f"{POPULAR_URL}?recnum={recnum}"


def get_popular_dance_links(limit=MAX_DANCES):
    links = []
    seen = set()

    for recnum in range(0, limit, PAGE_SIZE):
        page_url = get_popular_page_url(recnum)
        safe_print(f"Getting popular page: {page_url}")

        try:
            soup = get_soup(page_url)
        except requests.RequestException as error:
            safe_print(f"Failed page {page_url}: {error}")
            continue

        page_links_found = 0

        for a in soup.find_all("a", href=True):
            href = a["href"]

            if "/stepsheets/" not in href:
                continue

            full_url = href if href.startswith("http") else BASE_URL + href
            title = clean_text(a.get_text())

            if full_url not in seen and title:
                seen.add(full_url)
                links.append({
                    "dance_name": title,
                    "stepsheet_url": full_url,
                })
                page_links_found += 1

            if len(links) >= limit:
                break

        safe_print(f"Found {page_links_found} new links on page.")

        if len(links) >= limit:
            break

        time.sleep(REQUEST_DELAY)

    return links[:limit]


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
    safe_print("Getting popular CopperKnob dance links...")

    dance_links = get_popular_dance_links(limit=MAX_DANCES)
    safe_print(f"Found {len(dance_links)} total dance links.")

    records = []

    for index, dance in enumerate(dance_links, start=1):
        safe_name = dance["dance_name"].encode("ascii", errors="replace").decode("ascii")
        safe_print(f"[{index}/{len(dance_links)}] Scraping: {safe_name}")

        try:
            record = parse_detail_page(dance)
            records.append(record)
        except requests.RequestException as error:
            safe_print(f"Failed to scrape {safe_name}: {error}")

        time.sleep(REQUEST_DELAY)

    save_to_csv(records)

    safe_print(f"Saved {len(records)} records to:")
    safe_print(OUTPUT_FILE)


if __name__ == "__main__":
    main()