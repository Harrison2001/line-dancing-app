# API Documentation

Base URL: `http://localhost:5000` (configurable via `PORT`)

All request/response bodies are JSON unless noted. Authentication uses JWT tokens returned from signup/login, but **most routes do not currently enforce JWT middleware** — `userId` and other identifiers are passed in request bodies or query params.

---

## Authentication

| Endpoint | Auth required |
|---|---|
| `POST /api/users/signup` | No |
| `POST /api/users/login` | No |
| All other endpoints | No (JWT not enforced on backend yet) |

JWT tokens expire after 7 days. Frontend stores token and user in `localStorage`.

---

## Users

### `GET /api/users`

List all users (testing route).

**Response:** Array of user objects (password excluded).

---

### `POST /api/users/signup`

Create a new account.

**Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201):**

```json
{
  "token": "jwt-string",
  "user": {
    "id": "objectId",
    "username": "string",
    "email": "string",
    "role": "user"
  }
}
```

**Errors:** `400` — email already in use, or creation failed.

---

### `POST /api/users/login`

Authenticate an existing user.

**Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**

```json
{
  "token": "jwt-string",
  "user": {
    "id": "objectId",
    "username": "string",
    "email": "string",
    "role": "user"
  }
}
```

**Errors:** `400` — invalid email or password.

---

### `GET /api/users/:userId`

Get a single user by ID.

**Response (200):** User object (password excluded).  
**Errors:** `404` — user not found.

---

### `PUT /api/users/:userId/profile`

Update user profile fields.

**Body (all optional):**

```json
{
  "bio": "string",
  "city": "string",
  "state": "string",
  "profileImage": "string",
  "danceExperience": "string",
  "skillLevel": "string",
  "danceFrequency": "string",
  "interests": ["string"]
}
```

**Response (200):**

```json
{
  "message": "Profile updated successfully",
  "user": { }
}
```

---

## Onboarding

### `PUT /api/onboarding/:userId`

Complete user onboarding. Sets `onboardingComplete: true`.

**Body (all optional):**

```json
{
  "city": "string",
  "state": "string",
  "danceExperience": "string",
  "skillLevel": "string",
  "danceFrequency": "string",
  "interests": ["string"],
  "bio": "string",
  "profileImage": "string"
}
```

**Response (200):**

```json
{
  "message": "Onboarding completed successfully",
  "user": { }
}
```

---

## Profiles

### `GET /api/profiles`

List all profiles (testing route). Populates `userId` with `username` and `email`.

---

### `GET /api/profiles/:userId`

Get profile by user ID.

**Response (200):** Profile object with populated user.  
**Errors:** `404` — profile not found.

---

### `POST /api/profiles`

Create a profile.

**Body:**

```json
{
  "userId": "objectId",
  "displayName": "string",
  "bio": "string",
  "location": "string",
  "profileImage": "string",
  "favoriteStyles": ["string"],
  "dancesKnown": ["string"],
  "dancesLearning": ["string"],
  "dancesWantToLearn": ["string"]
}
```

**Response (201):** Created profile.

---

### `PUT /api/profiles/:userId`

Update or create (upsert) a profile by user ID.

**Body:** Same fields as `POST /api/profiles` (except `userId` comes from URL).

**Response (200):**

```json
{
  "message": "Profile updated successfully",
  "profile": { }
}
```

---

## Dances

### `GET /api/dances`

List all active dances, sorted by newest.

**Response:** Array of dance objects where `isActive` is not `false`.

---

### `GET /api/dances/search?q={query}`

Search dances. Checks MongoDB first, then falls back to external sources (CopperKnob, linedancin.net).

**Query params:**

| Param | Required | Description |
|---|---|---|
| `q` | Yes | Search term |

**Response:** Search result object from `danceLookupService`.

**Errors:** `400` — missing query.

---

### `GET /api/dances/:id`

Get a single dance by ID.

**Errors:** `404` — dance not found or inactive.

---

### `GET /api/dances/:id/related`

Get up to 6 related dances matching difficulty, style, artist, or choreographer.

**Response:** Array of dance summaries.

---

### `PATCH /api/dances/:id/enrich-video`

Fetch a YouTube video for a dance and save it to the document.

**Response (200):**

```json
{
  "message": "Video enriched successfully",
  "dance": { },
  "video": { }
}
```

**Errors:** `404` — dance not found or no video found. Requires `YOUTUBE_API_KEY`.

---

## Saved Dances

### `GET /api/saved-dances/check?userId={id}&danceId={id}`

Check whether a user has saved a specific catalog dance.

**Response:**

```json
{
  "saved": true,
  "record": { }
}
```

`record` is included only when `saved` is `true`.

---

### `GET /api/saved-dances/:userId`

Get all saved dances for a user, sorted by newest.

---

### `POST /api/saved-dances`

Save or upsert a dance to a user's library.

**Body:**

```json
{
  "userId": "objectId",
  "danceId": "objectId",
  "danceTitle": "string",
  "song": "string",
  "artist": "string",
  "choreographer": "string",
  "difficulty": "string",
  "status": "known | learning | wantToLearn"
}
```

- When `danceId` is provided, upserts on `(userId, danceId)`.
- When `danceId` is omitted, creates a standalone saved dance entry.
- Default status: `wantToLearn`.

**Response (201):** Saved dance record.

---

### `PUT /api/saved-dances/:id`

Update the status of a saved dance.

**Body:**

```json
{
  "status": "known | learning | wantToLearn"
}
```

---

### `DELETE /api/saved-dances/:id`

Remove a saved dance.

**Response:**

```json
{
  "message": "Saved dance removed"
}
```

---

## Posts

### `GET /api/posts`

List all posts, sorted by newest.

---

### `GET /api/posts/user/:userId`

Get media posts for a specific user (`mediaUrl` is not empty).

---

### `POST /api/posts`

Create a text post.

**Body:**

```json
{
  "type": "text",
  "danceTitle": "string",
  "creator": "string",
  "handle": "string",
  "choreographer": "string",
  "difficulty": "string",
  "song": "string",
  "artist": "string",
  "bpm": 0,
  "counts": 0,
  "walls": 0,
  "image": "string"
}
```

Only `danceTitle` is effectively required; other fields have defaults.

**Response (201):** Created post.

---

### `POST /api/posts/media`

Create a media post after uploading to Cloudinary.

**Body:**

```json
{
  "userId": "objectId",
  "text": "string",
  "mediaUrl": "string",
  "publicId": "string",
  "resourceType": "image | video"
}
```

---

### `PATCH /api/posts/:postId/like`

Increment the like counter on a post (does not use the Like model).

**Response:** Updated post.

---

## Comments

### `GET /api/comments/:postId`

Get comments for a post. Populates `userId` with `username`.

---

### `POST /api/comments`

Create a comment.

**Body:**

```json
{
  "postId": "objectId",
  "userId": "objectId",
  "text": "string"
}
```

**Response (201):** Created comment.

---

## Likes

### `GET /api/likes/:postId`

Get like count for a post.

**Response:**

```json
{
  "count": 0
}
```

---

### `POST /api/likes`

Toggle like/unlike for a post.

**Body:**

```json
{
  "postId": "objectId",
  "userId": "objectId"
}
```

**Response:**

```json
{
  "liked": true,
  "count": 5
}
```

---

## Follows

### `POST /api/follows`

Toggle follow/unfollow between two users.

**Body:**

```json
{
  "followerId": "objectId",
  "followingId": "objectId"
}
```

**Response:**

```json
{
  "following": true
}
```

**Errors:** `400` — missing IDs or attempting to follow yourself.

---

### `GET /api/follows/:userId/following-count`

Count of users this user follows.

**Response:** `{ "count": 0 }`

---

### `GET /api/follows/:userId/follower-count`

Count of users following this user.

**Response:** `{ "count": 0 }`

---

## Uploads

### `POST /api/uploads`

Upload media to Cloudinary. Uses `multipart/form-data`.

**Form field:** `media` (file)

**Response (201):**

```json
{
  "mediaUrl": "string",
  "publicId": "string",
  "resourceType": "image | video"
}
```

Requires Cloudinary environment variables.

---

## YouTube

### `GET /api/youtube/search?q={query}`

Search YouTube for a dance video.

**Query params:**

| Param | Required | Description |
|---|---|---|
| `q` | Yes | Search query |

**Response:**

```json
{
  "videoUrl": "https://www.youtube.com/embed/{videoId}",
  "title": "string",
  "channelTitle": "string",
  "thumbnail": "string"
}
```

Returns `{ "videoUrl": "" }` when no results found. Requires `YOUTUBE_API_KEY`.

---

## Health Check

### `GET /`

**Response:** `LineDance backend is running` (plain text)
