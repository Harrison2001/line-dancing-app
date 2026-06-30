LINE_DANCE_SIGNALS = [
    ("line dance", 6),
    ("linedance", 6),
    ("line dancing", 6),
    ("country dance", 5),
    ("country linedance", 5),
    ("step sheet", 5),
    ("stepsheet", 5),
    ("step by step", 5),
    ("walkthrough", 4),
    ("tutorial", 4),
    ("teach", 3),
    ("lesson", 3),
    ("instruction", 3),
    ("breakdown", 3),
    ("demo", 3),
    ("demonstration", 3),
    ("dance along", 3),
    ("choreography", 2),
    ("copperknob", 4),
    ("bootscootin", 3),
    ("boot scootin", 3),
]

MUSIC_VIDEO_SIGNALS = [
    ("official music video", -10),
    ("official video", -8),
    ("music video", -8),
    ("official audio", -8),
    ("lyric video", -8),
    ("lyrics video", -8),
    (" with lyrics", -6),
    (" lyrics", -4),
    ("vevo", -9),
    (" - topic", -7),
    ("audio only", -6),
    ("full album", -5),
    ("record label", -4),
    ("premiere", -3),
    ("remastered", -2),
    ("official hd", -5),
    ("official 4k", -5),
]

MUSIC_VIDEO_CHANNELS = ["vevo", "official", "records", "topic", "music"]


def normalize_text(value):
    return str(value or "").lower().strip()


def score_line_dance_video(video, search_type="demo", dance_title="", song_title=""):
    title = normalize_text(video.get("title"))
    channel = normalize_text(video.get("channel") or video.get("channelTitle"))
    combined = f"{title} {channel}"
    score = 0

    for pattern, points in LINE_DANCE_SIGNALS:
        if pattern in combined:
            score += points

    for pattern, points in MUSIC_VIDEO_SIGNALS:
        if pattern in combined:
            score += points

    if search_type == "tutorial":
        if any(
            keyword in combined
            for keyword in [
                "tutorial",
                "teach",
                "lesson",
                "walkthrough",
                "step by step",
                "breakdown",
            ]
        ):
            score += 4
    elif any(
        keyword in combined
        for keyword in ["demo", "demonstration", "dance along", "performance"]
    ):
        score += 3

    dance_key = normalize_text(dance_title)
    song_key = normalize_text(song_title)

    if len(dance_key) >= 3 and dance_key in title:
        score += 4

    if len(song_key) >= 3 and song_key in title:
        score += 2

    if score < 4 and any(label in channel for label in MUSIC_VIDEO_CHANNELS):
        score -= 4

    return score


def pick_best_line_dance_video(results, search_type="demo", dance_title="", song_title=""):
    if not results:
        return None

    ranked = sorted(
        results,
        key=lambda video: score_line_dance_video(
            video,
            search_type=search_type,
            dance_title=dance_title,
            song_title=song_title,
        ),
        reverse=True,
    )

    best = ranked[0]
    best_score = score_line_dance_video(
        best,
        search_type=search_type,
        dance_title=dance_title,
        song_title=song_title,
    )

    if best_score < -2:
        return None

    return best
