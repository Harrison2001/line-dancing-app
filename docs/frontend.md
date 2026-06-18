# Frontend Documentation

**Framework:** Next.js 16 (App Router)  
**Language:** TypeScript  
**Styling:** Tailwind CSS 4  
**API client:** `frontend/services/api.ts`

---

## Folder Structure

```txt
frontend/
├── app/                  # App Router pages
│   ├── page.tsx          # Public landing page (/)
│   ├── home/             # Authenticated feed (/home)
│   ├── discover/         # Dance catalog (/discover)
│   ├── dances/[id]/      # Dance detail (/dances/:id)
│   ├── events/           # Events page (/events)
│   ├── profile/          # User profile (/profile)
│   ├── login/            # Login (/login)
│   ├── signup/           # Signup (/signup)
│   ├── onboarding/       # Onboarding (/onboarding)
│   ├── settings/         # Settings (/settings)
│   ├── upload/           # Upload page (/upload)
│   └── layout.tsx        # Root layout (TopNav + BottomNav)
│
├── components/           # Shared UI
├── services/api.ts       # Backend API functions
└── lib/user.ts           # localStorage user session helpers
```

---

## Layout and Navigation

### Root layout (`app/layout.tsx`)

- Renders `TopNavbar` (desktop, `md+` screens)
- Renders `BottomNav` (mobile, fixed bottom bar)
- Dark theme (`#100905` background)

### Desktop navigation (`TopNavbar`)

| Link | Route | Status |
|---|---|---|
| Home | `/home` | Implemented |
| Discover | `/discover` | Implemented |
| Events | `/events` | Implemented (static UI) |
| Friends | `/friends` | **Not implemented** (no page exists) |
| Profile menu | `/profile` | Implemented |

Profile dropdown also links to `/saved`, `/notifications`, and `/settings` — these routes are **not yet implemented** as standalone pages.

### Mobile navigation (`BottomNav`)

| Link | Route |
|---|---|
| Home | `/` |
| Discover | `/discover` |
| Events | `/events` |
| Friends | `/friends` |

> Note: Mobile Home links to `/` (landing), while desktop Home links to `/home` (feed). This is an inconsistency in the current codebase.

---

## Pages

### `/` — Landing page

**File:** `app/page.tsx`

Public marketing page with hero section, feature highlights, and CTAs to `/signup` and `/login`.

---

### `/home` — Community feed

**File:** `app/home/page.tsx`

- Loads posts from `GET /api/posts`
- `PostComposer` for creating text posts
- `FilterTabs` for feed filtering (UI only)
- `FeedCard` renders each post

**User journey:** Login → redirect to home → browse/create posts.

---

### `/discover` — Dance catalog

**File:** `app/discover/page.tsx`

- Fetches dances from `GET /api/dances`
- Difficulty tabs: Recommended, Beginner, Improver, Intermediate, Advanced
- Recommendation-based layout with dance cards
- Each card links to `/dances/[id]`

---

### `/dances/[id]` — Dance detail

**File:** `app/dances/[id]/page.tsx`

- Fetches single dance from `GET /api/dances/:id`
- Video tabs (demo, tutorial, YouTube fallback)
- Related dances from `GET /api/dances/:id/related`
- Save-to-library flow with status selection (`known`, `learning`, `wantToLearn`)
- Checks saved state via `GET /api/saved-dances/check`
- Redirects unauthenticated users to `/login` with return URL
- YouTube enrichment via `PATCH /api/dances/:id/enrich-video`

---

### `/events` — Events

**File:** `app/events/page.tsx`

Static UI with mock event cards and filter buttons. **No backend integration yet.**

---

### `/profile` — User profile

**File:** `app/profile/page.tsx`

Protected route — redirects to `/login` if no user in `localStorage`.

**Tabs:**
- **Uploads** — user media posts from `GET /api/posts/user/:userId`
- **Library** — saved dances from `GET /api/saved-dances/:userId`

Library cards link to `/dances/[id]` when `danceId` is present. Users can change status or remove dances.

Uses `lib/user.ts` for session helpers (`getStoredUser`, `getUserId`, `persistUser`).

---

### `/login` — Login

**File:** `app/login/page.tsx`

- Calls `loginUser()` → `POST /api/users/login`
- Stores `token` and `user` in `localStorage`
- Redirects to `/home` or return URL

---

### `/signup` — Signup

**File:** `app/signup/page.tsx`

- Calls `signupUser()` → `POST /api/users/signup`
- Stores session in `localStorage`
- Redirects to onboarding or home

---

### `/onboarding` — Onboarding

**File:** `app/onboarding/page.tsx`

Collects location, experience, skill level, and interests.  
Saves via `PUT /api/onboarding/:userId`.

---

### `/settings` — Settings

**File:** `app/settings/page.tsx`

Settings UI. TODO: Document specific settings once wired to backend.

---

### `/upload` — Upload

**File:** `app/upload/page.tsx`

Media upload page. Uses `uploadMedia()` and `createMediaPost()`.

---

## Key Components

| Component | Purpose |
|---|---|
| `TopNavbar` | Desktop header with nav links and profile menu |
| `BottomNav` | Mobile bottom tab bar |
| `FeedCard` | Renders a single feed post |
| `PostComposer` | Text input for creating posts |
| `FilterTabs` | Feed filter tabs (UI) |
| `UploadButton` | Triggers media upload modal |
| `UploadModal` | File picker and upload flow |
| `Sidebar` | Right sidebar with streak/challenges (static mock data) |

---

## Session Management

**Storage:** `localStorage`

| Key | Content |
|---|---|
| `token` | JWT string |
| `user` | JSON-serialized user object (`id`, `username`, `email`, `role`) |

**Helpers:** `frontend/lib/user.ts`

Protected pages check for stored user and redirect to `/login` if missing. See [authentication.md](authentication.md) for full auth flows.

---

## User Journeys

### New user signup

```txt
Landing (/) → Signup (/signup) → Onboarding (/onboarding) → Home (/home)
```

### Discover and save a dance

```txt
Discover (/discover) → Dance detail (/dances/:id) → Save with status → Profile library (/profile)
```

### Unauthenticated save attempt

```txt
Dance detail → Login (/login?returnUrl=...) → Return to dance detail → Save
```

### Create a post

```txt
Home (/home) → PostComposer → POST /api/posts → Feed updates
```

### Upload media

```txt
Profile (/profile) or Upload (/upload) → Select file → POST /api/uploads → POST /api/posts/media
```

---

## API Integration

All backend calls go through `frontend/services/api.ts`. Base URL from `NEXT_PUBLIC_API_URL` (default `http://localhost:5000`).

> The discover page currently hardcodes `http://localhost:5000` instead of using the env variable. TODO: align with `api.ts`.

---

## Routes Not Yet Implemented

These are linked in navigation but have no page files:

- `/friends`
- `/saved` (library is a tab on `/profile`)
- `/notifications`
