REQUIRED_FIELDS = ["title", "normalized_title"]
RECOMMENDED_FIELDS = [
    "difficulty",
    "counts",
    "walls",
    "choreographer",
    "song_title",
    "artist",
    "best_demo_video",
    "best_tutorial_video",
]


def validate_final_dance(record):
    errors = []
    warnings = []

    for field in REQUIRED_FIELDS:
        if not record.get(field):
            errors.append(f"Missing required field: {field}")

    for field in RECOMMENDED_FIELDS:
        if not record.get(field):
            warnings.append(f"Missing recommended field: {field}")

    if record.get("counts") is not None and not isinstance(record.get("counts"), int):
        errors.append("counts must be an integer")

    if record.get("walls") is not None and not isinstance(record.get("walls"), int):
        errors.append("walls must be an integer")

    is_valid = len(errors) == 0

    return {
        "is_valid": is_valid,
        "errors": errors,
        "warnings": warnings,
    }


if __name__ == "__main__":
    sample = {
        "title": "The Wolf",
        "normalized_title": "the wolf",
        "difficulty": "Intermediate",
        "counts": 32,
        "walls": 4,
    }

    print(validate_final_dance(sample))