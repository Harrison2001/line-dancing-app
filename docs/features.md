# Features

Features are split into **Implemented** (working in the codebase) and **Planned** (not yet built).

---

## Implemented

### User Accounts

- Signup with username, email, password
- Login with email/password
- JWT token generation (7-day expiry)
- Session stored in `localStorage`
- User profile fields (bio, city, state, experience, skill level, interests)
- Onboarding flow with `onboardingComplete` flag
- Protected profile page (redirects to login)

### Community Feed

- Text post creation
- Media post creation (image/video via Cloudinary)
- Feed loading from MongoDB
- Post likes (toggle via Like model + counter on Post)
- Comments on posts
- Filter tabs UI on feed

### Dance Catalog

- MongoDB-backed dance library (100+ dances from ETL pipeline)
- Discover page with difficulty tabs (Recommended, Beginner, Improver, Intermediate, Advanced)
- Dance detail pages with full metadata
- Related dances suggestions
- Dance search (MongoDB + external fallback to CopperKnob and linedancin.net)
- YouTube video search and enrichment on detail pages
- Video tabs (demo, tutorial, YouTube fallback)

### Personal Dance Library

- Save dances from detail page with learning status
- Three statuses: `known`, `learning`, `wantToLearn`
- Upsert by `(userId, danceId)` — links to catalog entries
- Check saved state before displaying UI
- Profile library tab with status management
- Library cards link to catalog dance detail when `danceId` exists
- Login redirect with return URL when saving unauthenticated

### Social

- Follow/unfollow toggle between users
- Follower and following counts

### Data Pipeline

- Automated ETL: collect → clean → merge → validate → load
- Sources: CopperKnob, BootStepper
- YouTube video collection (separate script)
- Validation layer with quality scoring
- MongoDB upsert by slug
- Scheduled Windows batch job

### Media

- Cloudinary upload for images and videos
- Media posts linked to user profiles

---

## Planned

### User Accounts (future)

- Google, Apple, Facebook login
- Email verification
- Forgot password
- JWT middleware on backend routes
- Refresh tokens
- Profile picture upload (field exists, upload flow TODO)

### Social Features

- Friends system (`/friends` page linked but not built)
- Replies, mentions, discussion threads
- Notifications (`/notifications` page linked but not built)
- In-app messaging
- Direct messages between friends

### Events

- Event listings backed by database (currently static mock UI)
- Event detail pages
- Event creation
- Local event discovery
- Venue information
- RSVP system
- Map integration

### Groups

- Create and join groups
- Group discussions

### Search

- Global search across dances, songs, choreographers, users, events
- Advanced filters (popularity, genre, location, trending)

### Analytics

- Trending dances
- Popular songs
- User engagement metrics
- Analytics dashboards

### Recommendations

- Personalized dance recommendations
- Personalized event/venue recommendations
- Dance discovery feed

### Moderation

- Content moderation by admins
- Dance submission approval workflow
- User reporting

### Mobile

- Push notifications
- Offline saved dances
- Camera uploads

### Monetization (long-term)

- Premium features
- Subscription tiers
- Event ticket integration

### AI / ML (long-term)

- Recommendation engine
- Trend prediction
- User behavior analysis

---

## How Features Connect

```txt
ETL Pipeline → MongoDB dances → Discover page → Dance detail
                                                    ↓
                                            Save to library
                                                    ↓
                                            Profile library tab

Signup/Login → Onboarding → Home feed → Posts/Comments/Likes
                              ↓
                         Media upload (Cloudinary)
```

See [frontend.md](frontend.md) for user journeys and [api.md](api.md) for endpoint details.
