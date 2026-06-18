# Roadmap

**Vision:** Build the go-to platform for the line dancing community.  
**Target deployment:** August 31, 2026

---

## Completed

### Authentication and Onboarding

- [x] User registration
- [x] Login/logout
- [x] JWT session management
- [x] Onboarding flow (location, experience, interests)
- [x] User profile fields on User model
- [ ] Profile picture upload (field exists, upload flow incomplete)

### Feed System

- [x] Text posts
- [x] Media posts (image/video via Cloudinary)
- [x] Like system (toggle + counter)
- [x] Comments
- [ ] Event posts (type exists in schema, not wired in UI)

### Dance Library

- [x] Search dances (MongoDB + external fallback)
- [x] Dance detail pages
- [x] Tutorial/demo video tabs
- [x] Difficulty levels and style categories
- [x] Song information
- [x] Related dances
- [x] YouTube video enrichment
- [x] ETL pipeline (CopperKnob + BootStepper, 100+ records)

### Discover Dances

- [x] Recommendation-based layout
- [x] Difficulty tabs
- [x] MongoDB-backed catalog
- [ ] Trending/popular sorting (partial — UI tabs exist)

### Personal Dance Library

- [x] Save dances with status (`known`, `learning`, `wantToLearn`)
- [x] Link saved dances to catalog via `danceId`
- [x] Profile library tab
- [x] Status management from detail and profile pages

### Data Engineering

- [x] Automated ETL pipeline
- [x] Validation layer
- [x] MongoDB loader
- [x] YouTube collection script
- [x] Scheduled batch job (Windows)

---

## In Progress

### Documentation

- [x] README, API, database, frontend, pipeline docs
- [ ] Deployment instructions

### Frontend Polish

- [ ] Align mobile/desktop home routes (`/` vs `/home`)
- [ ] Wire discover page to `NEXT_PUBLIC_API_URL`
- [ ] Complete logout flow in TopNavbar

---

## Planned — Version 1 (by August 31, 2026)

### Events System

- [ ] Event listings (database-backed)
- [ ] Event detail pages
- [ ] Event creation
- [ ] Local event discovery
- [ ] Venue information

### Location-Based Features

- [ ] Save user location (partial — city/state on User model)
- [ ] Recommend nearby venues
- [ ] Recommend nearby events
- [ ] Personalized local content

### Friends System

- [ ] Send/accept friend requests
- [ ] Friends list page (`/friends`)

### Groups

- [ ] Create groups
- [ ] Join groups
- [ ] Group discussions

### Messaging

- [ ] Direct messages
- [ ] Friend-to-friend conversations

### Launch Preparation

- [ ] Bug fixes and UI polish
- [ ] Mobile testing
- [ ] Performance testing
- [ ] Deployment

---

## Planned — Version 2 (Post-Launch)

### Automated Event Collection

- Monitor venue websites for new events
- Event suggestions with admin review

### Notification System

- New local events, dances, venue announcements
- Group and friend activity alerts

### AI Recommendations

- Dance, event, venue, and content recommendations

### Premium Features

- Advanced discovery tools
- Premium event notifications
- Enhanced profiles

---

## Success Criteria (Version 1)

A user should be able to:

1. ~~Create an account~~ ✓
2. ~~Set their location~~ ✓ (onboarding)
3. ~~Discover dances~~ ✓
4. ~~Learn dances~~ ✓ (detail pages with videos)
5. Find events — **static UI only**
6. Find nearby venues — **not started**
7. Connect with friends — **not started**
8. Join groups — **not started**
9. Send messages — **not started**
10. ~~Participate in the community~~ ✓ (feed, posts, comments)

**Progress:** 5 of 10 success criteria met.

---

## Development Phases

| Phase | Focus | Status |
|---|---|---|
| 1 | Authentication and onboarding | Complete |
| 2 | Feed improvements | Mostly complete |
| 3 | Dance systems | Complete |
| 4 | Events and venues | Not started |
| 5 | Community (friends, groups, messaging) | Not started |
| 6 | Launch preparation | Not started |

---

> This file supersedes `docs/ROADMAP.md` for tracking implementation status. The original roadmap vision document is preserved at [ROADMAP.md](ROADMAP.md).
