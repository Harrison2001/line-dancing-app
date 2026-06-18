# Line Dancing App

A full-stack platform for the line dancing community — discover dances, track your learning progress, browse events, and connect with other dancers.

**Author:** Harrison Wier  
**Target launch:** August 31, 2026

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB |
| Media | Cloudinary |
| Data pipeline | Python (collect, clean, merge, validate, load) |
| Auth | JWT, bcrypt |

---

## Project Structure

```txt
Line dancing App/
├── backend/              # Express REST API
│   ├── config/           # DB, Cloudinary
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route handlers
│   ├── services/         # YouTube, CopperKnob, dance lookup
│   └── server.js         # Entry point
│
├── frontend/             # Next.js application
│   ├── app/              # App Router pages
│   ├── components/       # Shared UI components
│   └── services/         # API client (api.ts)
│
├── Data Engineering/     # ETL pipeline for dance catalog
│   ├── scripts/          # collect, clean, merge, validate, load
│   ├── Data/             # raw, staging, processed, exports
│   └── logs/             # Pipeline run logs
│
└── docs/                 # Project documentation
```

---

## Prerequisites

- **Node.js** 18+
- **MongoDB** (local or Atlas)
- **Python** 3.10+ (for data pipeline only)
- **npm**

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB connection string |
| `DATABASE_NAME` | No | Database name (default: `line_dancing_app`) |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens |
| `YOUTUBE_API_KEY` | Yes* | Google YouTube Data API key for video search/enrichment |
| `CLOUDINARY_CLOUD_NAME` | Yes* | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes* | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes* | Cloudinary API secret |
| `PORT` | No | Server port (default: `5000`) |

\* Required for media uploads and YouTube video features.

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | Backend URL (default: `http://localhost:5000`) |

---

## Getting Started

### 1. Clone and install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

Create `backend/.env` with at least `MONGO_URI` and `JWT_SECRET`.  
Optionally create `frontend/.env.local` with `NEXT_PUBLIC_API_URL`.

### 3. Start the backend

```bash
cd backend
npm run dev
```

Runs on `http://localhost:5000`.

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

Runs on `http://localhost:3000`.

### 5. Load dance data (optional)

```bash
cd "Data Engineering"
python scripts/jobs/run_pipeline.py
```

See [docs/data-pipeline.md](docs/data-pipeline.md) for full pipeline details.

---

## Key Features (Implemented)

- User signup, login, and onboarding
- Community feed with posts, likes, comments, and media uploads
- Dance catalog backed by MongoDB (100+ dances from CopperKnob and BootStepper)
- Discover page with difficulty tabs and recommendations
- Dance detail pages with video tabs, related dances, and YouTube enrichment
- Personal dance library with status tracking (`known`, `learning`, `wantToLearn`)
- Follow system (toggle follow/unfollow)
- Automated ETL pipeline for dance data

See [docs/features.md](docs/features.md) for the full feature list.

---

## Documentation

| Document | Description |
|---|---|
| [docs/api.md](docs/api.md) | REST API endpoints |
| [docs/database.md](docs/database.md) | MongoDB collections and fields |
| [docs/frontend.md](docs/frontend.md) | Pages, navigation, and user journeys |
| [docs/data-pipeline.md](docs/data-pipeline.md) | ETL pipeline and data sources |
| [docs/features.md](docs/features.md) | Implemented and planned features |
| [docs/changelog.md](docs/changelog.md) | Release history |
| [docs/roadmap.md](docs/roadmap.md) | Development roadmap |
| [docs/authentication.md](docs/authentication.md) | Auth flows |
| [docs/data-flow.md](docs/data-flow.md) | Request/response flows |

---

## Scripts

### Backend

| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (development) |
| `npm start` | Start production server |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

### Data Pipeline

| Command | Description |
|---|---|
| `python scripts/jobs/run_pipeline.py` | Run full ETL pipeline |
| `scripts/jobs/run_daily_pipeline.bat` | Windows scheduled job wrapper |

---

## Deployment

TODO: Deployment instructions not yet documented. Target date is August 31, 2026.
