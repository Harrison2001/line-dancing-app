# Data Flow

## Overview

This file explains how data moves through the LineDance application.

---

# Post Creation Flow

Purpose:

Explains how a user creates a post.

Flow:

```txt
User types message
↓
PostComposer.tsx
↓
onAddPost()
↓
createPost()
↓
POST /api/posts
↓
Express route
↓
Post model
↓
MongoDB
↓
Saved in database
↓
Response returned
↓
Frontend updates feed
```

Files involved:

```txt
frontend/components/PostComposer.tsx

frontend/services/api.ts

backend/routes/posts.js

backend/models/Post.js
```

---

# Feed Loading Flow

Purpose:

Explains how feed data loads.

Flow:

```txt
User opens homepage
↓
page.tsx loads
↓
useEffect()
↓
getPosts()
↓
GET /api/posts
↓
Backend route
↓
MongoDB
↓
Posts returned
↓
FeedCard rendered
```

Files involved:

```txt
frontend/app/page.tsx

frontend/services/api.ts

backend/routes/posts.js

backend/models/Post.js
```

---

# User Signup Flow

Purpose:

Explains account creation.

Flow:

```txt
User enters username
↓
Frontend signup page
↓
POST /api/users/signup
↓
Users route
↓
bcrypt hashes password
↓
User model
↓
MongoDB
↓
JWT token generated
↓
Response returned
```

Files involved:

```txt
frontend/app/signup/page.tsx

backend/routes/users.js

backend/models/User.js
```

---

# Login Flow

Purpose:

Explains user login.

Flow:

```txt
User enters email/password
↓
POST /api/users/login
↓
Users route
↓
Find user in MongoDB
↓
bcrypt compares password
↓
JWT created
↓
Token returned
↓
Frontend stores token
```

Files involved:

```txt
frontend/app/login/page.tsx

backend/routes/users.js
```

---

# Dance Progress Flow

Purpose:

Tracks learning progress.

Flow:

```txt
User clicks:

✓ I Know This
📖 Learning
☆ Want To Learn

↓
SavedDance route
↓
SavedDance model
↓
MongoDB updates status
↓
Profile page refreshes
```

Files involved:

```txt
backend/routes/savedDances.js

backend/models/SavedDance.js

frontend/app/profile/page.tsx
```