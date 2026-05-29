# Authentication System

## Overview

This document explains how authentication currently works in the Line Dance Platform.

Status:

```txt
Completed (Version 1)
```

---

# Signup Process

Implemented Features:

- create account
- save users to MongoDB
- hash passwords with bcrypt
- generate JWT tokens
- store token in localStorage
- redirect to homepage after signup

Flow:

```txt
User enters username/email/password
↓
Signup page
↓
signupUser()
↓
POST /api/users/signup
↓
bcrypt hashes password
↓
MongoDB saves user
↓
JWT token generated
↓
Store token locally
↓
Redirect to homepage
```

Files involved:

```txt
frontend/app/signup/page.tsx

frontend/services/api.ts

backend/routes/users.js

backend/models/User.js
```

---

# Login Process

Implemented Features:

- validate email/password
- compare hashed passwords
- create JWT token
- save token locally
- redirect to homepage

Flow:

```txt
User enters email/password
↓
Login page
↓
loginUser()
↓
POST /api/users/login
↓
Find user in MongoDB
↓
Compare passwords
↓
JWT created
↓
Store token locally
↓
Redirect to homepage
```

Files involved:

```txt
frontend/app/login/page.tsx

frontend/services/api.ts

backend/routes/users.js
```

---

# Session Management

Current session storage:

```txt
localStorage
```

Stored items:

```txt
token
user
```

Examples:

```js
localStorage.setItem("token", data.token);

localStorage.setItem(
 "user",
 JSON.stringify(data.user)
);
```

---

# Navbar Authentication

Current features:

- show username
- show profile initial
- show login button when logged out
- show signup button when logged out
- show logout button when logged in

Flow:

```txt
User logs in
↓
Navbar checks localStorage
↓
Display username and profile icon
```

---

# Logout Process

Implemented Features:

- remove token
- remove user information
- clear session
- redirect to login page

Flow:

```txt
Logout clicked
↓
Remove token
↓
Remove user
↓
Redirect to login
```

---

# Protected Routes

Current protected routes:

```txt
/profile
```

Flow:

```txt
User visits profile
↓
Check localStorage
↓
No user found
↓
Redirect to login
```

---

# Future Authentication Improvements

Future ideas:

- JWT middleware protection on backend
- email verification
- forgot password
- Google login
- Apple login
- profile picture upload
- refresh tokens
- session expiration