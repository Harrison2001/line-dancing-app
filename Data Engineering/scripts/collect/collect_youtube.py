from pathlib import Path
import os
import time
import requests
import pandas as pd
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parents[2]  # Data Engineering
PROJECT_DIR = BASE_DIR.parent                   # Line dancing App

BACKEND_ENV = PROJECT_DIR / "backend" / ".env"

INPUT_FILE = BASE_DIR / "data" / "exports" / "dances_for_database.json"
OUTPUT_FILE = BASE_DIR / "data" / "raw" / "youtube_dance_videos_raw.csv"

MAX_DANCES = 25
DELAY_SECONDS = 1

load_dotenv(BACKEND_ENV)

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")


def normalize_text(value):
    if pd.isna(value):
        return ""

    return str(value).strip()


def build_query(row):
    parts = [
        normalize_text(row.get("title")),
        normalize_text(row.get("songTitle")),
        normalize_text(row.get("artist")),
        normalize_text(row.get("choreographer")),
        "line dance demo tutorial",
    ]

    return " ".join([part for part in parts if part])


def search_youtube(query):
    if not YOUTUBE_API_KEY:
        raise ValueError(f"Missing YOUTUBE_API_KEY. Checked: {BACKEND_ENV}")

    url = "https://www.googleapis.com/youtube/v3/search"

    params = {
        "part": "snippet",
        "type": "video",
        "maxResults": 5,
        "q": query,
        "key": YOUTUBE_API_KEY,
    }

    response = requests.get(url, params=params, timeout=15)
    response.raise_for_status()

    return response.json().get("items", [])


def collect_youtube_videos():
    if not INPUT_FILE.exists():
        raise FileNotFoundError(f"Input file not found: {INPUT_FILE}")

    dances = pd.read_json(INPUT_FILE)

    print(f"Loaded dances from: {INPUT_FILE}")
    print(f"Total dances available: {len(dances)}")
    print(f"Collecting YouTube videos for first {MAX_DANCES} dances")

    results = []

    for index, row in dances.head(MAX_DANCES).iterrows():
        title = normalize_text(row.get("title"))
        slug = normalize_text(row.get("slug"))
        normalized_title = normalize_text(
            row.get("normalizedTitle") or slug or title.lower()
        )

        query = build_query(row)

        if not title:
            print(f"Skipping row {index}: missing title")
            continue

        print(f"[{index + 1}] Searching YouTube for: {query}")

        try:
            videos = search_youtube(query)

            if not videos:
                print(f"No videos found for: {title}")
                continue

            for rank, video in enumerate(videos, start=1):
                video_id = video.get("id", {}).get("videoId")
                snippet = video.get("snippet", {})

                if not video_id:
                    continue

                thumbnails = snippet.get("thumbnails", {})

                results.append(
                    {
                        "slug": slug,
                        "normalized_title": normalized_title,
                        "dance_title": title,
                        "song_title": normalize_text(row.get("songTitle")),
                        "artist": normalize_text(row.get("artist")),
                        "choreographer": normalize_text(row.get("choreographer")),
                        "youtube_rank": rank,
                        "youtube_video_id": video_id,
                        "youtube_title": snippet.get("title", ""),
                        "youtube_channel": snippet.get("channelTitle", ""),
                        "youtube_thumbnail": (
                            thumbnails.get("high", {}).get("url")
                            or thumbnails.get("medium", {}).get("url")
                            or thumbnails.get("default", {}).get("url", "")
                        ),
                        "youtube_url": f"https://www.youtube.com/watch?v={video_id}",
                        "youtube_query": query,
                    }
                )

            print(f"Found {len(videos)} videos for: {title}")

        except Exception as error:
            print(f"Failed YouTube search for {title}: {error}")

        time.sleep(DELAY_SECONDS)

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    output_df = pd.DataFrame(results)
    output_df.to_csv(OUTPUT_FILE, index=False)

    print(f"Saved YouTube results to: {OUTPUT_FILE}")
    print(f"Total video rows: {len(output_df)}")


if __name__ == "__main__":
    collect_youtube_videos()