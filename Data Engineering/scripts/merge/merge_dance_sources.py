def merge_dance_records(records):
    """
    Combine multiple source records into one final dance record.
    """

    final = {
        "title": None,
        "normalized_title": None,
        "difficulty": None,
        "counts": None,
        "walls": None,
        "choreographer": None,
        "song_title": None,
        "artist": None,
        "source_links": [],
        "best_demo_video": None,
        "best_tutorial_video": None,
        "quality_score": 0,
    }

    for record in records:
        for key in final:
            if key == "source_links":
                final["source_links"].extend(record.get("source_links", []))
            elif final[key] is None and record.get(key):
                final[key] = record.get(key)

    final["source_links"] = list(set(final["source_links"]))
    final["quality_score"] = calculate_quality_score(final)

    return final


def calculate_quality_score(record):
    score = 0

    important_fields = [
        "title",
        "difficulty",
        "counts",
        "walls",
        "choreographer",
        "song_title",
        "artist",
        "best_demo_video",
        "best_tutorial_video",
    ]

    for field in important_fields:
        if record.get(field):
            score += 10

    return min(score, 100)