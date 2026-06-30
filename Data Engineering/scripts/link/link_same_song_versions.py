from pathlib import Path
import json
import re
import sys
from collections import defaultdict

BASE_DIR = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(BASE_DIR))

from config.song_utils import build_normalized_song_key, is_usable_song_title

EXPORT_FILE = BASE_DIR / "data" / "exports" / "dances_for_database.json"
GROUPS_FILE = BASE_DIR / "data" / "processed" / "same_song_groups.json"


def clean_text(value):
    return str(value or "").strip()


def is_valid_dance_title(title, choreographer="", source_name=""):
    normalized = clean_text(title).lower()
    if len(normalized) < 3:
        return False

    if re.match(
        r"^(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}$",
        normalized,
        re.I,
    ):
        return False

    choreographer_text = clean_text(choreographer)
    alpha_chars = sum(1 for char in choreographer_text if char.isalpha())

    if alpha_chars <= 2 and choreographer_text:
        return False

    if clean_text(source_name) == "BootStepper" and normalized in {
        "roy verdonk",
        "tim johnson",
        "ivonne verhagen",
    }:
        return False

    return True


def main():
    if not EXPORT_FILE.exists():
        raise FileNotFoundError(f"Missing export file: {EXPORT_FILE}")

    with open(EXPORT_FILE, "r", encoding="utf-8") as file:
        dances = json.load(file)

    keyed_groups = defaultdict(list)

    for dance in dances:
        song_title = clean_text(dance.get("songTitle"))
        artist = clean_text(dance.get("artist"))
        slug = clean_text(dance.get("slug"))
        title = clean_text(dance.get("title") or dance.get("dance_name"))
        choreographer = clean_text(dance.get("choreographer"))

        song_key = build_normalized_song_key(song_title, artist)
        dance["normalizedSongKey"] = song_key
        dance["sameSongVersionCount"] = 0
        dance["sameSongSlugs"] = []

        if not song_key or not slug or not is_valid_dance_title(
            title, choreographer, dance.get("sourceName")
        ):
            continue

        keyed_groups[song_key].append(dance)

    group_summaries = []
    linked_dance_count = 0

    for song_key, members in keyed_groups.items():
        unique_slugs = []
        seen_slugs = set()

        for dance in members:
            slug = dance.get("slug")
            if slug in seen_slugs:
                continue
            seen_slugs.add(slug)
            unique_slugs.append(slug)

        if len(unique_slugs) < 2:
            continue

        version_slugs = sorted(unique_slugs)
        version_count = len(version_slugs)

        for dance in members:
            slug = dance.get("slug")
            other_slugs = [item for item in version_slugs if item != slug]
            dance["sameSongVersionCount"] = version_count
            dance["sameSongSlugs"] = other_slugs

        linked_dance_count += len(members)

        group_summaries.append(
            {
                "normalizedSongKey": song_key,
                "songTitleExamples": sorted(
                    {
                        clean_text(dance.get("songTitle"))
                        for dance in members
                        if clean_text(dance.get("songTitle"))
                    }
                )[:5],
                "versionCount": version_count,
                "dances": [
                    {
                        "slug": dance.get("slug"),
                        "title": dance.get("title"),
                        "choreographer": dance.get("choreographer"),
                        "sourceName": dance.get("sourceName"),
                        "songTitle": dance.get("songTitle"),
                    }
                    for dance in members
                    if dance.get("slug") in version_slugs
                ],
            }
        )

    group_summaries.sort(key=lambda item: (-item["versionCount"], item["normalizedSongKey"]))

    with open(EXPORT_FILE, "w", encoding="utf-8") as file:
        json.dump(dances, file, indent=2, ensure_ascii=False)

    GROUPS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(GROUPS_FILE, "w", encoding="utf-8") as file:
        json.dump(group_summaries, file, indent=2, ensure_ascii=False)

    print(f"Processed {len(dances)} dances")
    print(f"Same-song groups found: {len(group_summaries)}")
    print(f"Dances linked to a group: {linked_dance_count}")
    print(f"Updated export: {EXPORT_FILE}")
    print(f"Saved groups: {GROUPS_FILE}")


if __name__ == "__main__":
    main()
