# Installed Packages

## Overview

This file explains why packages were installed and where they are used.

---

# Backend Packages

## express

Purpose:

Creates the backend server and API routes.

Used for:

- server.js
- routes
- API endpoints

Examples:

```js
app.use("/api/posts", postRoutes);
```

---

## mongoose

Purpose:

Connects MongoDB with Node.js.

Used for:

- Database connection
- Models
- Schemas
- Database queries

Examples:

```js
const Post = require("../models/Post");
```

---

## bcryptjs

Purpose:

Hashes passwords for security.

Used for:

- Signup
- Login

Examples:

```js
const hashedPassword = await bcrypt.hash(password,10);
```

Why:

Passwords should never be stored directly.

---

## jsonwebtoken

Purpose:

Creates authentication tokens.

Used for:

- Login sessions
- Protected routes
- User authentication

Examples:

```js
jwt.sign(...)
```

Why:

Keeps users logged in.

---

## cors

Purpose:

Allows frontend and backend to communicate.

Used for:

```js
app.use(cors());
```

Why:

Frontend:

```txt
localhost:3000
```

Backend:

```txt
localhost:5000
```

Need permission to communicate.

---

## dotenv

Purpose:

Loads secret variables.

Used for:

- Mongo URI
- JWT secret
- API keys

Examples:

```js
require("dotenv").config();
```

Why:

Protects sensitive information.

---

## nodemon

Purpose:

Automatically restarts backend during development.

Used for:

```bash
npm run dev
```

Why:

Avoids manually restarting server.

---

# Frontend Packages

## next.js

Purpose:

Frontend framework.

Used for:

- Routing
- Pages
- Components
- Rendering

---

## react

Purpose:

Builds UI components.

Used for:

- State
- Components
- Hooks

Examples:

```tsx
useState()
useEffect()
```

---

## tailwindcss

Purpose:

Fast styling system.

Used for:

- Layout
- Colors
- Responsive design

Examples:

```tsx
className="bg-orange-500"
```

---

# Future Packages

Potential future installs:

- cloudinary
- multer
- socket.io
- react-query
- stripe