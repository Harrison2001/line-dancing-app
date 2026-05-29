# Line Dance Platform - Database Plan

## Overview

The database will store the main information needed for the Line Dance Platform, including users, dances, events, comments, likes, saved dances, and dance requests.

The first version of the database should stay simple. The goal is to support the MVP first, then expand later as the app grows.

---

# Database Choice

For the first version, possible database options include:

## Option 1: PostgreSQL

Best for:
- structured data
- relationships between users, dances, events, and comments
- long-term scalability
- real-world backend development practice

## Option 2: Firebase Firestore

Best for:
- faster setup
- authentication integration
- real-time features
- simpler early development

## Option 3: MongoDB

Best for:
- flexible document-based data
- fast prototyping
- less strict structure

## Recommended Choice

For this project, PostgreSQL is the strongest long-term option because the app has many relationships:

- users save dances
- users comment on dances
- users like dances
- dances belong to songs/choreographers
- events connect to locations and users

Firebase can also be useful if the goal is to build fast and avoid backend complexity early.

---

# Main Data Entities

The first version of the database should include:

```txt
users
dances
events
comments
likes
saved_dances
dance_requests
```

Future entities may include:

```txt
songs
choreographers
notifications
follows
groups
analytics_events
recommendations
```

---

# MVP Database Tables

## 1. users

Stores account and profile information.

```txt
users
- id
- username
- email
- password_hash
- profile_picture_url
- location
- bio
- created_at
- updated_at
```

### Notes

- `email` should be unique.
- `password_hash` stores the encrypted password, not the real password.
- `location` can be used later for local event discovery.

---

## 2. dances

Stores the main dance information.

```txt
dances
- id
- title
- song_title
- artist
- choreographer
- difficulty
- description
- tutorial_url
- demo_video_url
- tags
- created_by_user_id
- created_at
- updated_at
```

### Notes

- `difficulty` can be beginner, intermediate, or advanced.
- `tutorial_url` can point to YouTube.
- `demo_video_url` can point to TikTok, Instagram, or another external video.
- `created_by_user_id` connects the dance to the user who added it.

---

## 3. events

Stores dance events.

```txt
events
- id
- title
- description
- location_name
- address
- city
- state
- event_date
- start_time
- end_time
- event_url
- created_by_user_id
- created_at
- updated_at
```

### Notes

- Events can be local dance nights, workshops, socials, or competitions.
- `event_url` can link to Facebook, Eventbrite, Instagram, or a venue page.

---

## 4. comments

Stores comments users leave on dances.

```txt
comments
- id
- user_id
- dance_id
- comment_text
- created_at
- updated_at
```

### Notes

- Each comment belongs to one user.
- Each comment belongs to one dance.

---

## 5. likes

Stores likes on dances.

```txt
likes
- id
- user_id
- dance_id
- created_at
```

### Notes

- A user should only be able to like the same dance once.
- This table helps track popularity.

---

## 6. saved_dances

Stores dances users save to their profile.

```txt
saved_dances
- id
- user_id
- dance_id
- created_at
```

### Notes

- This allows users to build a personal saved dance list.
- A user should only be able to save the same dance once.

---

## 7. dance_requests

Stores requests for dances people want to learn or see played.

```txt
dance_requests
- id
- user_id
- dance_title
- song_title
- artist
- request_reason
- status
- created_at
- updated_at
```

### Notes

Possible `status` values:

```txt
pending
approved
added
rejected
```

This feature helps identify what dances the community wants.

---

# Table Relationships

## User Relationships

```txt
users 1 → many dances
users 1 → many events
users 1 → many comments
users 1 → many likes
users 1 → many saved_dances
users 1 → many dance_requests
```

## Dance Relationships

```txt
dances 1 → many comments
dances 1 → many likes
dances 1 → many saved_dances
```

## Event Relationships

```txt
users 1 → many events
```

---

# Simple Relationship Diagram

```txt
users
  │
  ├── dances
  │     ├── comments
  │     ├── likes
  │     └── saved_dances
  │
  ├── events
  │
  └── dance_requests
```

---

# Example Data Flow

## Saving a Dance

```txt
User clicks "Save Dance"
 ↓
Frontend sends user_id and dance_id
 ↓
Backend checks if the dance is already saved
 ↓
Backend inserts record into saved_dances
 ↓
Database stores the saved dance
 ↓
Frontend updates the save button
```

---

## Liking a Dance

```txt
User clicks "Like"
 ↓
Frontend sends user_id and dance_id
 ↓
Backend checks if the user already liked it
 ↓
Backend inserts record into likes
 ↓
Database stores the like
 ↓
Frontend updates the like count
```

---

## Adding a Dance Request

```txt
User submits a dance request
 ↓
Frontend sends request form
 ↓
Backend validates the request
 ↓
Backend inserts record into dance_requests
 ↓
Database stores the request
 ↓
Request appears in community requests page
```

---

# MVP Database Scope

The first database version should focus only on:

```txt
users
dances
comments
likes
saved_dances
dance_requests
```

Events can be added early, but they are not required for the first working prototype.

---

# Future Database Expansion

Later versions may add:

## songs

```txt
songs
- id
- title
- artist
- genre
- spotify_url
- apple_music_url
- created_at
```

## choreographers

```txt
choreographers
- id
- name
- bio
- profile_url
- created_at
```

## follows

```txt
follows
- id
- follower_user_id
- following_user_id
- created_at
```

## notifications

```txt
notifications
- id
- user_id
- notification_type
- message
- is_read
- created_at
```

## analytics_events

```txt
analytics_events
- id
- user_id
- event_type
- dance_id
- metadata
- created_at
```

---

# Analytics Possibilities

The database can later support analytics such as:

- most liked dances
- most saved dances
- most requested dances
- trending dances by week
- popular songs by region
- user engagement activity
- local event engagement

---

# Recommendation Possibilities

Later, saved dances, likes, comments, and views can be used to recommend:

- dances similar to what a user saved
- popular dances in a user’s area
- trending dances among similar users
- dances by favorite choreographers
- songs connected to dances users already like

---

# Important Database Rules

## Security Rules

- Never store plain-text passwords.
- Users should only edit their own profile.
- Users should only delete their own comments.
- Admin roles may be needed later for moderation.

## Data Quality Rules

- Dance titles should not be empty.
- Song titles should not be empty.
- Duplicate dances should be checked before adding.
- Email addresses should be unique.
- Likes and saved dances should not be duplicated.

---

# First Build Priority

The first database build should support:

```txt
1. Creating users
2. Adding dances
3. Viewing dances
4. Saving dances
5. Liking dances
6. Commenting on dances
7. Requesting new dances
```

The goal is not to build a perfect database immediately. The goal is to create a clean foundation that can grow as the app becomes more advanced.