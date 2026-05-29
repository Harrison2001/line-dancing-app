# LineDance Platform - Database Design

## Overview

The app will use one MongoDB database with multiple collections.

```txt
LineDanceDatabase
├── users
├── profiles
├── posts
├── comments
├── likes
├── savedDances
├── events
├── messages
└── notifications

# users

Stores login/account information.

```js
{
  _id,
  username,
  email,
  password,
  role,
  isVerified,
  profileImage,
  createdAt,
  updatedAt
}

