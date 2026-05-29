# Line Dance Platform - Frontend Structure

## Overview

The frontend is the user-facing side of the Line Dance Platform. It includes all pages, navigation, layouts, forms, buttons, cards, and user interaction features.

The goal of the frontend is to provide a clean and organized experience for dancers to:
- discover dances
- learn choreography
- find events
- interact with the community
- save favorite dances
- request dances

The frontend should start simple and expand over time.

---

# Frontend Folder Structure

```txt
frontend/
│
├── pages/
│   ├── HomePage
│   ├── DanceLibraryPage
│   ├── DanceDetailPage
│   ├── AddDancePage
│   ├── EventsPage
│   ├── RequestsPage
│   ├── ProfilePage
│   ├── LoginPage
│   └── SignupPage
│
├── components/
│   ├── Navbar
│   ├── Footer
│   ├── DanceCard
│   ├── EventCard
│   ├── CommentBox
│   ├── SearchBar
│   ├── FilterDropdown
│   ├── Button
│   ├── FormInput
│   └── ProfileCard
│
├── services/
│   └── API requests
│
├── styles/
│
└── assets/
```

---

# Navigation Structure

The frontend navigation bar should include:

```txt
Home
Dances
Events
Requests
Profile
Login / Signup
```

Future navigation may include:
- Notifications
- Messages
- Saved Dances
- Settings

---

# Main Frontend Pages

## 1. Home Page

### Purpose

The Home Page is the main landing page for users.

### Main Content

- Welcome section
- Featured dances
- Trending dances
- Recently added dances
- Upcoming events
- Quick navigation buttons

### Possible Sections

```txt
Hero Section
Trending Dances
Recently Added
Upcoming Events
Community Highlights
```

---

## 2. Dance Library Page

### Purpose

Displays all dances available on the platform.

### Main Content

- Dance cards
- Search functionality
- Filters
- Sorting options

### Filters

```txt
Difficulty
Genre
Newest
Most Popular
Most Saved
Most Liked
```

### Dance Card Information

Each dance card may display:
- Dance title
- Song title
- Artist
- Difficulty
- Thumbnail image
- Like count
- Save button

---

## 3. Dance Detail Page

### Purpose

Shows complete information about a single dance.

### Main Content

- Dance title
- Song title
- Artist
- Choreographer
- Difficulty
- Tutorial links
- Demo video links
- Description
- Tags
- Comments
- Like button
- Save button

### User Actions

Users can:
- like dances
- save dances
- comment
- share dances later

---

## 4. Add Dance Page

### Purpose

Allows users to submit new dances.

### Form Fields

```txt
Dance Title
Song Title
Artist
Choreographer
Difficulty
Description
Tutorial URL
Demo Video URL
Tags
```

### User Actions

Users can:
- submit dances
- edit dances later
- upload links
- add descriptions

---

## 5. Events Page

### Purpose

Displays dance events and socials.

### Main Content

- Event cards
- Date and time
- Event location
- Event descriptions
- External links

### Future Features

- map integration
- local event filtering
- RSVP system

---

## 6. Requests Page

### Purpose

Allows users to request dances they want added.

### Main Content

- Request form
- Requested dance list
- Request status

### Request Fields

```txt
Dance Title
Song Title
Artist
Reason for Request
```

---

## 7. Profile Page

### Purpose

Displays a user's profile and activity.

### Main Content

- Username
- Profile picture
- Bio
- Saved dances
- Liked dances
- Uploaded dances
- Dance requests

### Future Features

- follower system
- badges
- user statistics

---

## 8. Login Page

### Purpose

Allows users to log into the platform.

### Form Fields

```txt
Email
Password
```

---

## 9. Signup Page

### Purpose

Allows users to create an account.

### Form Fields

```txt
Username
Email
Password
Confirm Password
```

---

# Reusable Frontend Components

The frontend should use reusable UI components to keep the code organized.

## Components

```txt
Navbar
Footer
DanceCard
EventCard
CommentBox
SearchBar
FilterDropdown
Button
FormInput
ProfileCard
```

---

# Frontend Design Goals

The frontend should aim to be:

- clean
- easy to navigate
- mobile-friendly
- community-focused
- visually organized
- scalable

The design should help dancers quickly:
- find dances
- learn choreography
- discover events
- interact with the community

---

# MVP Frontend Priority

The first frontend version should focus ONLY on:

```txt
1. Home Page
2. Dance Library Page
3. Dance Detail Page
4. Add Dance Page
5. Requests Page
```

The first version does not need:
- advanced animations
- messaging
- notifications
- real-time updates
- AI recommendations

---

# First Frontend Development Goal

The first coding goal is to create:
- blank pages
- navigation
- basic layouts

The pages only need to exist and connect together before adding full functionality.