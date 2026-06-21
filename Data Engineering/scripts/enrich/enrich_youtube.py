from pathlib import Path
import json
import os
import re
import time

import requests
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = BASE_DIR.parent

BACKEND_ENV = PROJECT_DIR / "backend" / ".env"
EXPORT_FILE = BASE_DIR / "data" / "exports" / "dances_for_database.json"
AUDIT_FILE = BASE_DIR / "data" / "raw" / "youtube_enrichment_audit.json"

DELAY_SECONDS = 2.0
MAX_DANCES = 0
SKIP_IF_HAS_VIDEOS = True
MAX_RETRIES = 4
RETRY_BACKOFF_SECONDS = 15

load_dotenv(BACKEND_ENV)
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")


def normalize_text(value):
    if value is None:
        return ""
    return str(value).strip()


def sanitize_error(error):
    message = str(error)
    if YOUTUBE_API_KEY:
        message = message.replace(YOUTUBE_API_KEY, "[REDACTED]")
    return re.sub(r"([?&]key=)[^&\s\"']+", r"\1[REDACTED]", message, flags=re.I)


def build_search_query(record, search_type):
    title = normalize_text(record.get("title"))
    song = normalize_text(record.get("songTitle"))
    artist = normalize_text(record.get("artist"))
    choreographer = normalize_text(record.get("choreographer"))

    parts = [title]

    if song:
        parts.append(song)
    if artist:
        parts.append(artist)
    if choreographer:
        parts.append(choreographer)

    if search_type == "demo":
        parts.append("line dance demo")
    else:
        parts.append("line dance tutorial")

    return " ".join(part for part in parts if part)


def youtube_api_error(response):
    return RuntimeError(f"YouTube API error {response.status_code}")


def search_youtube(query, max_results=3):
    if not YOUTUBE_API_KEY:
        raise ValueError(f"Missing YOUTUBE_API_KEY. Checked: {BACKEND_ENV}")

    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "type": "video",
        "maxResults": max_results,
        "q": query,
        "key": YOUTUBE_API_KEY,
    }

    for attempt in range(MAX_RETRIES):
        response = requests.get(url, params=params, timeout=20)

        if response.status_code == 429:
            wait_seconds = RETRY_BACKOFF_SECONDS * (attempt + 1)
            print(f"YouTube rate limit hit. Waiting {wait_seconds}s before retry...")
            time.sleep(wait_seconds)
            continue

        if not response.ok:
            raise youtube_api_error(response)
        break
    else:
        raise RuntimeError("YouTube API rate limit exceeded after retries")

    items = response.json().get("items", [])
    results = []

    for item in items:
        video_id = item.get("id", {}).get("videoId")
        snippet = item.get("snippet", {})
        if not video_id:
            continue

        thumbnails = snippet.get("thumbnails", {})
        results.append(
            {
                "video_id": video_id,
                "title": snippet.get("title", ""),
                "channel": snippet.get("channelTitle", ""),
                "url": f"https://www.youtube.com/watch?v={video_id}",
                "thumbnail": (
                    thumbnails.get("high", {}).get("url")
                    or thumbnails.get("medium", {}).get("url")
                    or thumbnails.get("default", {}).get("url", "")
                ),
            }
        )

    return results


def pick_best_video(results, search_type):
    if not results:
        return None

    keywords = ["tutorial", "teach", "walkthrough"] if search_type == "tutorial" else ["demo", "dance"]

    for result in results:
        title = result["title"].lower()
        if any(keyword in title for keyword in keywords):
            return result

    return results[0]


def needs_enrichment(record):
    if not SKIP_IF_HAS_VIDEOS:
        return True

    demo = normalize_text(record.get("best_demo_video"))
    tutorial = normalize_text(record.get("best_tutorial_video"))
    return not demo or not tutorial


def enrich_record(record, audit_entry):
    title = normalize_text(record.get("title"))
    if not title:
        audit_entry["skipped"] = "missing_title"
        return record

    demo_query = build_search_query(record, "demo")
    tutorial_query = build_search_query(record, "tutorial")

    if not normalize_text(record.get("best_demo_video")):
        demo_results = search_youtube(demo_query)
        best_demo = pick_best_video(demo_results, "demo")
        if best_demo:
            record["best_demo_video"] = best_demo["url"]
            record["demoUrl"] = best_demo["url"]
            record["thumbnailUrl"] = best_demo["thumbnail"]
            audit_entry["demo"] = {
                "query": demo_query,
                "url": best_demo["url"],
                "title": best_demo["title"],
            }
        time.sleep(DELAY_SECONDS)

    if not normalize_text(record.get("best_tutorial_video")):
        tutorial_results = search_youtube(tutorial_query)
        best_tutorial = pick_best_video(tutorial_results, "tutorial")
        if best_tutorial:
            record["best_tutorial_video"] = best_tutorial["url"]
            record["tutorialUrl"] = best_tutorial["url"]
            audit_entry["tutorial"] = {
                "query": tutorial_query,
                "url": best_tutorial["url"],
                "title": best_tutorial["title"],
            }
        time.sleep(DELAY_SECONDS)

    return record


def main():
    if not EXPORT_FILE.exists():
        raise FileNotFoundError(f"Export file not found: {EXPORT_FILE}")

    with open(EXPORT_FILE, "r", encoding="utf-8") as file:
        dances = json.load(file)

    print(f"Loaded {len(dances)} dances from: {EXPORT_FILE}")

    candidates = [dance for dance in dances if needs_enrichment(dance)]
    if MAX_DANCES > 0:
        candidates = candidates[:MAX_DANCES]

    print(f"Enriching YouTube videos for {len(candidates)} dances")

    audit_log = []

    for index, record in enumerate(candidates, start=1):
        title = normalize_text(record.get("title"))
        print(f"[{index}/{len(candidates)}] YouTube search: {title}")

        audit_entry = {"title": title, "slug": record.get("slug", "")}

        try:
            enrich_record(record, audit_entry)
        except Exception as error:
            safe_error = sanitize_error(error)
            audit_entry["error"] = safe_error
            print(f"Failed for {title}: {safe_error}")

        audit_log.append(audit_entry)

    with open(EXPORT_FILE, "w", encoding="utf-8") as file:
        json.dump(dances, file, indent=2, ensure_ascii=False)

    AUDIT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(AUDIT_FILE, "w", encoding="utf-8") as file:
        json.dump(audit_log, file, indent=2, ensure_ascii=False)

    demo_count = sum(1 for dance in dances if normalize_text(dance.get("best_demo_video")))
    tutorial_count = sum(
        1 for dance in dances if normalize_text(dance.get("best_tutorial_video"))
    )

    print(f"Updated export: {EXPORT_FILE}")
    print(f"Dances with demo videos: {demo_count}")
    print(f"Dances with tutorial videos: {tutorial_count}")
    print(f"Audit log: {AUDIT_FILE}")


if __name__ == "__main__":
    main()
