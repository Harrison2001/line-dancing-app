# Data Pipeline Documentation

The dance catalog ETL pipeline lives in `Data Engineering/`. It collects dance records from external sources, cleans and merges them, validates quality, and loads them into MongoDB.

---

## Overview

```txt
CopperKnob + BootStepper (collect)
        ↓
    Raw CSV files
        ↓
    Clean scripts (per source)
        ↓
    Staging CSV files
        ↓
    Merge script
        ↓
    Validate script
        ↓
    Export JSON
        ↓
    Load to MongoDB (dances collection)
```

YouTube video collection runs as a separate script (`collect_youtube.py`) and is not part of the main `run_pipeline.py` orchestrator.

---

## Data Sources

| Source | Script | Output |
|---|---|---|
| CopperKnob | `scripts/collect/collect_copperknob_recent.py` | `Data/raw/copperknob_dances_raw.csv` |
| BootStepper | `scripts/collect/collect_bootstepper.py` | `Data/raw/bootstepper_dances_raw.csv` |
| YouTube | `scripts/collect/collect_youtube.py` | `Data/raw/youtube_dance_videos_raw.csv` |

---

## Pipeline Steps

Orchestrated by `scripts/jobs/run_pipeline.py`:

| Step | Script | Input | Output |
|---|---|---|---|
| 1. Collect CopperKnob | `collect/collect_copperknob_recent.py` | CopperKnob website | Raw CSV |
| 2. Collect BootStepper | `collect/collect_bootstepper.py` | BootStepper website | Raw CSV |
| 3. Clean CopperKnob | `clean/clean_copperknob.py` | Raw CopperKnob CSV | `Data/staging/` |
| 4. Clean BootStepper | `clean/clean_bootstepper.py` | Raw BootStepper CSV | `Data/staging/bootstepper_dances_clean.csv` |
| 5. Merge sources | `merge/merge_dance_sources.py` | Staging files | `Data/processed/merged_dances.json` |
| 6. Validate | `validate/validate_final_dance.py` | Merged data | `Data/exports/dances_for_database.json` |
| 7. Load | `load/load_dances.py` | Export JSON | MongoDB `dances` collection |

> **TODO:** `run_pipeline.py` references `scrape_copperknob_recent.py` but the actual file is `collect_copperknob_recent.py`. The CopperKnob collect step is currently skipped when the orchestrator runs. Run `collect_copperknob_recent.py` manually or fix the path in `run_pipeline.py`.

---

## Data Directories

```txt
Data Engineering/Data/
├── raw/              # Unprocessed scraper output
├── staging/          # Cleaned per-source files
├── processed/        # Merged and intermediate files
│   ├── merged_dances.json
│   └── dances_invalid.csv    # Records that failed validation
└── exports/
    └── dances_for_database.json   # Final validated export for MongoDB
```

---

## Validation

**Script:** `scripts/validate/validate_final_dance.py`  
**Schema:** `config/dance_schema.py`

Required fields for a valid dance record:

| Field | Type |
|---|---|
| `title` | string |
| `normalized_title` | string |
| `difficulty` | string |
| `counts` | int |
| `walls` | int |
| `choreographer` | string |
| `song_title` | string |
| `artist` | string |
| `source_links` | list |
| `best_demo_video` | string |
| `best_tutorial_video` | string |
| `quality_score` | int |

Invalid records are written to `Data/processed/dances_invalid.csv`.

---

## MongoDB Loading

**Script:** `scripts/load/load_dances.py`

- Reads `backend/.env` for `MONGO_URI` and `DATABASE_NAME`
- Reads `Data/exports/dances_for_database.json`
- Normalizes field names (e.g. `danceName`, `songTitle`, `slug`)
- Upserts into `dances` collection keyed on `slug`

**Connection:**

| Env var | Default |
|---|---|
| `MONGO_URI` | required |
| `DATABASE_NAME` | `line_dancing_app` |

---

## Running the Pipeline

### Full pipeline

```bash
cd "Data Engineering"
python scripts/jobs/run_pipeline.py
```

### Scheduled job (Windows)

```bash
Data Engineering/scripts/jobs/run_daily_pipeline.bat
```

Logs append to `Data Engineering/logs/pipeline_daily.log`.

### Individual steps

```bash
python scripts/collect/collect_bootstepper.py
python scripts/clean/clean_bootstepper.py
python scripts/merge/merge_dance_sources.py
python scripts/validate/validate_final_dance.py
python scripts/load/load_dances.py
```

---

## Backend Enrichment (Post-Load)

After dances are in MongoDB, the backend can enrich records at runtime:

| Service | Purpose |
|---|---|
| `youtubeService.js` | Search YouTube for demo videos (`PATCH /api/dances/:id/enrich-video`) |
| `danceLookupService.js` | Search MongoDB + external sources (`GET /api/dances/search`) |
| `copperknobService.js` | Scrape CopperKnob for dance lookups |

These are API-layer enrichments, not part of the batch ETL pipeline.

---

## Python Dependencies

TODO: Document required Python packages. The scripts use at minimum:

- `pymongo`
- `python-dotenv`

Check individual scripts for additional imports (`requests`, etc.).

---

## Logs

| File | Content |
|---|---|
| `logs/pipeline_daily.log` | Output from scheduled batch runs |

---

## Related Documentation

- [database.md](database.md) — `dances` collection schema
- [api.md](api.md) — Dance API endpoints
- `Data Engineering/README.log/README.md` — Original data engineering overview (aspirational architecture)
