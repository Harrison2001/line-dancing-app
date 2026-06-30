import re

MONTH_YEAR_PATTERN = re.compile(
    r"^(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}$",
    re.I,
)

NOISE_SONGS = {
    "",
    "unknown",
    "tbd",
    "n/a",
}


def normalize_song_text(value):
    if value is None:
        return ""

    text = str(value).lower().strip()
    text = text.replace("&", " and ")

    text = re.sub(r"\([^)]*\)", " ", text)
    text = re.sub(r"\[[^\]]*\]", " ", text)
    text = re.sub(r"\s*-\s*official\b.*$", "", text, flags=re.I)
    text = re.sub(r"\s*-\s*.*$", "", text)
    text = re.sub(r"\s*(feat\.?|ft\.?|featuring)\s+.*$", "", text, flags=re.I)
    text = re.sub(r"\s*(remix|radio mix|live|version|edit|mix)\s*$", "", text, flags=re.I)
    text = re.sub(r"[^a-z0-9]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    return text


def is_usable_song_title(song_title):
    normalized = normalize_song_text(song_title)

    if normalized in NOISE_SONGS or len(normalized) < 3:
        return False

    if MONTH_YEAR_PATTERN.match(normalized):
        return False

    if normalized.isdigit():
        return False

    return True


def build_normalized_song_key(song_title, artist=""):
    song_key = normalize_song_text(song_title)
    artist_key = normalize_song_text(artist)

    if not is_usable_song_title(song_title):
        return ""

    if artist_key and artist_key not in song_key:
        return f"{artist_key}|{song_key}"

    return song_key
