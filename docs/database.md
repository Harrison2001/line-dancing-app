# Database Documentation

**Engine:** MongoDB  
**Default database name:** `line_dancing_app` (set via `DATABASE_NAME` env var)  
**ODM:** Mongoose (backend)

---

## Collections Overview

| Collection | Model file | Purpose |
|---|---|---|
| `users` | `User.js` | Accounts and profile fields |
| `profiles` | `profile.js` | Extended profile data (separate from User) |
| `dances` | `Dance.js` | Dance catalog (populated by ETL pipeline) |
| `saveddances` | `SavedDance.js` | User dance libraries with learning status |
| `posts` | `Post.js` | Community feed posts |
| `comments` | `Comment.js` | Post comments |
| `likes` | `Like.js` | Post like records |
| `follows` | `Follow.js` | User follow relationships |

> Mongoose pluralizes model names automatically. The `dances` collection is loaded directly by the Python pipeline via `db["dances"]`.

Collections referenced in planning docs but **not yet implemented:** `events`, `messages`, `notifications`.

---

## users

Stores account credentials and inline profile/onboarding fields.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `username` | String | required, unique | Display name |
| `email` | String | required, unique, lowercase | Login email |
| `password` | String | required | bcrypt-hashed |
| `role` | String | enum: `user`, `admin`; default `user` | User role |
| `isVerified` | Boolean | default `false` | Email verification flag |
| `profileImage` | String | default `/images/default-profile.jpg` | Avatar URL |
| `bio` | String | default `""` | User bio |
| `city` | String | default `""` | Location city |
| `state` | String | default `""` | Location state |
| `danceExperience` | String | default `""` | Experience description |
| `skillLevel` | String | default `""` | Skill level |
| `danceFrequency` | String | default `""` | How often they dance |
| `interests` | [String] | default `[]` | Interest tags |
| `onboardingComplete` | Boolean | default `false` | Onboarding finished flag |
| `createdAt` | Date | auto | Timestamp |
| `updatedAt` | Date | auto | Timestamp |

---

## profiles

Separate profile documents linked to users. Used alongside inline User profile fields.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `userId` | ObjectId → User | required, unique | Owner |
| `displayName` | String | required | Public display name |
| `bio` | String | default `""` | Profile bio |
| `location` | String | default `""` | Location string |
| `profileImage` | String | default `/images/default-profile.jpg` | Avatar URL |
| `favoriteStyles` | [String] | default `[]` | Preferred dance styles |
| `dancesKnown` | [String] | default `[]` | Known dance names |
| `dancesLearning` | [String] | default `[]` | Dances in progress |
| `dancesWantToLearn` | [String] | default `[]` | Wishlist dances |
| `createdAt` | Date | auto | Timestamp |
| `updatedAt` | Date | auto | Timestamp |

---

## dances

Dance catalog. The Mongoose schema defines a minimal subset; the ETL loader and API routes use additional fields stored in MongoDB.

### Mongoose schema fields

| Field | Type | Description |
|---|---|---|
| `source` | String | Data source identifier |
| `danceName` | String | required, indexed |
| `choreographer` | String | Choreographer name |
| `count` | Number | Step count |
| `wall` | Number | Wall count |
| `level` | String | Difficulty level |
| `music` | String | Song name |
| `stepsheetUrl` | String | Stepsheet link |
| `scrapedAt` | String | Scrape timestamp |
| `createdAt` | Date | auto |
| `updatedAt` | Date | auto |

### Fields loaded by ETL pipeline (`load_dances.py`)

| Field | Type | Description |
|---|---|---|
| `title` | String | Display title |
| `slug` | String | URL-safe identifier (upsert key) |
| `songTitle` | String | Song name |
| `artist` | String | Artist name |
| `difficulty` | String | e.g. Beginner, Improver, Intermediate |
| `counts` | Number | Step count |
| `walls` | Number | Wall count |
| `style` | String | Dance style (default: Line Dance) |
| `sourceName` | String | e.g. CopperKnob, BootStepper |
| `sourceUrl` | String | Source page URL |
| `demoUrl` | String | Demo video URL |
| `tutorialUrl` | String | Tutorial video URL |
| `thumbnailUrl` | String | Thumbnail image URL |
| `description` | String | Dance description |
| `tags` | [String] | Tags array |
| `views` | Number | View count |
| `saves` | Number | Save count |
| `isActive` | Boolean | default `true` |
| `isVerified` | Boolean | default `false` |

### Fields added by YouTube enrichment

| Field | Type | Description |
|---|---|---|
| `bestDemoVideo` | String | YouTube embed URL |
| `youtubeVideoId` | String | YouTube video ID |
| `youtubeTitle` | String | Video title |
| `youtubeChannel` | String | Channel name |
| `youtubeThumbnail` | String | Video thumbnail URL |
| `videoEnrichedAt` | Date | When video was enriched |

**Upsert key:** `slug` (pipeline uses `update_one` with `upsert: true`)

---

## saveddances

User personal dance libraries with learning progress.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `userId` | ObjectId → User | required | Owner |
| `danceId` | ObjectId → Dance | optional | Link to catalog dance |
| `danceTitle` | String | required | Dance name (denormalized) |
| `song` | String | default `""` | Song name |
| `artist` | String | default `""` | Artist |
| `choreographer` | String | default `""` | Choreographer |
| `difficulty` | String | default `""` | Difficulty level |
| `status` | String | enum: `known`, `learning`, `wantToLearn`; default `wantToLearn` | Learning status |
| `createdAt` | Date | auto | Timestamp |
| `updatedAt` | Date | auto | Timestamp |

**Index:** Unique compound index on `(userId, danceId)` where `danceId` exists and is not null.

---

## posts

Community feed posts.

| Field | Type | Description |
|---|---|---|
| `type` | String | enum: `text`, `tutorial`, `video`, `event`; default `text` |
| `creator` | String | Creator display name |
| `handle` | String | Creator handle |
| `choreographer` | String | Choreographer label |
| `difficulty` | String | Difficulty label |
| `danceTitle` | String | required — post title/content |
| `song` | String | Song name |
| `artist` | String | Artist name |
| `bpm` | Number | Beats per minute |
| `counts` | Number | Step count |
| `walls` | Number | Wall count |
| `likes` | String | Like count (stored as string) |
| `comments` | String | Comment count (stored as string) |
| `saves` | String | Save count (stored as string) |
| `image` | String | Thumbnail/image URL |
| `mediaUrl` | String | Cloudinary media URL |
| `publicId` | String | Cloudinary public ID |
| `resourceType` | String | enum: `image`, `video`, `raw`, `""` |
| `createdAt` | Date | auto |
| `updatedAt` | Date | auto |

> Media posts also store `userId` at runtime, though it is not defined in the Mongoose schema.

---

## comments

| Field | Type | Constraints | Description |
|---|---|---|---|
| `postId` | ObjectId → Post | required | Parent post |
| `userId` | ObjectId → User | required | Author |
| `text` | String | required | Comment body |
| `createdAt` | Date | auto | Timestamp |
| `updatedAt` | Date | auto | Timestamp |

---

## likes

| Field | Type | Constraints | Description |
|---|---|---|---|
| `postId` | ObjectId → Post | required | Liked post |
| `userId` | ObjectId → User | required | User who liked |
| `createdAt` | Date | auto | Timestamp |
| `updatedAt` | Date | auto | Timestamp |

---

## follows

| Field | Type | Constraints | Description |
|---|---|---|---|
| `followerId` | ObjectId → User | required | User doing the following |
| `followingId` | ObjectId → User | required | User being followed |
| `createdAt` | Date | auto | Timestamp |
| `updatedAt` | Date | auto | Timestamp |

**Index:** Unique compound index on `(followerId, followingId)`.

---

## Relationships

```txt
User ──1:N──> SavedDance ──N:1──> Dance (optional danceId link)
User ──1:1──> Profile
User ──1:N──> Post (media posts, via userId)
User ──1:N──> Comment
User ──1:N──> Like
User ──1:N──> Follow (as followerId)
User ──1:N──> Follow (as followingId)
Post ──1:N──> Comment
Post ──1:N──> Like
```

---

## Data Loading

Dance records are loaded by the Python ETL pipeline:

- **Source file:** `Data Engineering/Data/exports/dances_for_database.json`
- **Loader script:** `Data Engineering/scripts/load/load_dances.py`
- **Upsert strategy:** Match on `slug`, `$set` all fields, create if missing

See [data-pipeline.md](data-pipeline.md) for the full pipeline.
