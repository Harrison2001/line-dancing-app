# Changelog

Concise history of meaningful updates. Styling-only tweaks are omitted.

---

## 2026 (Unreleased)

### Saved Dance Library

- Hardened saved-dance library flow and normalized user session handling
- Added save-to-library from dance detail page with `danceId` linking
- Added check/upsert APIs for saved dances
- Users can set learning status from detail page with login redirect
- Profile library cards link to catalog dances when `danceId` is available

### Dance Detail Page

- Refactored video loading states and API integration
- Added video tabs and related dances section
- Added YouTube video fallback for dances without embedded videos
- Built dance detail page connected to live MongoDB data

### Discover Page

- Refactored into recommendation-based layout
- Added difficulty tabs (Recommended, Beginner, Improver, Intermediate, Advanced)
- Connected discover page to MongoDB dance catalog

### Data Pipeline

- Built automated dance data pipeline with validation layer
- Added YouTube data collection script
- Added YouTube video enrichment service (backend)
- Scaled pipeline to 100+ dance records
- Added BootStepper validation and cleaning
- Built end-to-end ETL: collect → clean → merge → validate → load
- Added CopperKnob ETL pipeline with raw staging
- Reorganized data engineering scripts structure
- Added pipeline runner (`run_pipeline.py`)

### Dance API

- Built dance detail and related dance API endpoints
- Added database-first dance search pipeline
- Fixed backend dance API database connection
- Added dance data model and search import backend

### Earlier Development

- Built discover page with search improvements
- Added authentication system (signup, login, JWT)
- Built community feed with posts, likes, comments
- Added Cloudinary media uploads
- Added user profiles and onboarding
- Added follow system
- Created data engineering architecture and documentation

---

## Format

Future entries should follow:

```txt
### [Feature Area]
- What changed and why (one line per meaningful change)
```

Group by release or month when deploying.
