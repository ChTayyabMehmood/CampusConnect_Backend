# 📡 CampusConnect API Reference

**Base URL:** `http://localhost:3000`

---

## 1. POST /signup — Create Account

| | |
|---|---|
| **Auth required** | ❌ No |
| **What to send** | `email`, `password`, `first_name`, `last_name` |

**📤 Request:**
```json
{
  "email": "john@example.com",
  "password": "StrongPass1@",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Rules:**
| Field | Constraint |
|-------|------------|
| `email` | Valid email format (e.g. `x@y.z`) |
| `password` | Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char (`@$!%*?&`) |
| `first_name` | 2–50 characters |
| `last_name` | 2–50 characters |

**📥 Response (201):**
```json
{
  "success": true,
  "message": "user created successfully",
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "role": "student",
    "is_verified": false
  }
}
```

**❌ Errors:** `400` — invalid fields, `409` — email already exists

---

## 2. POST /login — Sign In

| | |
|---|---|
| **Auth required** | ❌ No |
| **What to send** | `email`, `password` |

**📤 Request:**
```json
{
  "email": "john@example.com",
  "password": "StrongPass1@"
}
```

**📥 Response (200):** Sets a cookie named `token`. Save this cookie — it's needed for all other APIs.
```json
{
  "success": true,
  "message": "User login successfully",
  "data": {
    "email": "john@example.com",
    "id": 1,
    "first_name": "John"
  }
}
```

**❌ Errors:** `400` — invalid email, `401` — wrong password, `404` — user not found

---

## 3. POST /onboarding — Complete Profile (Student)

| | |
|---|---|
| **Auth required** | ✅ Yes (cookie `token`) |
| **What to send** | `college`, `graduation_year` (1–4), `major`, `skills[]` |

**📤 Request:**
```json
{
  "college": "MIT",
  "graduation_year": 4,
  "major": "Computer Science",
  "skills": ["JavaScript", "Node.js", "SQL"]
}
```

**Rules:**
| Field | Constraint |
|-------|------------|
| `college` | 1–200 characters |
| `graduation_year` | Number 1–4 (1st year → 4th year) |
| `major` | 1–90 characters |
| `skills` | Array of 1–10 strings, each 1–50 chars |

**📥 Response (201):**
```json
{
  "success": true,
  "message": "student profile created successfully",
  "data": {
    "id": 1, "user_id": 1, "college": "MIT",
    "graduation_year": 4, "major": "Computer Science",
    "bio": null, "skills": ["JavaScript", "Node.js", "SQL"],
    "github_url": null, "linkedin_url": null, "portfolio_url": null,
    "created_at": "2026-07-25T19:46:38.457Z",
    "updated_at": "2026-07-25T19:46:38.457Z"
  }
}
```

**❌ Errors:** `400` — invalid values, `401` — bad token, `409` — already has a profile

---

## 4. GET /feed — Browse Opportunities

| | |
|---|---|
| **Auth required** | ✅ Yes (cookie `token`) |
| **What to send** | Nothing (no body) |

**📥 Response (200):**
```json
{
  "success": true,
  "message": "feed retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Hackathon 2026",
      "description": "Build something awesome",
      "type": "event",
      "mode": "online",
      "location": null,
      "deadline": "2026-08-15",
      "organizer": "CS Department",
      "organizer_email": "cs@uni.edu",
      "organizer_website": null,
      "created_by": 1,
      "created_at": "2026-07-25T12:00:00.000Z",
      "updated_at": "2026-07-25T12:00:00.000Z"
    }
  ]
}
```

---

## 5. GET /opportunity/:id — Opportunity Details

| | |
|---|---|
| **Auth required** | ✅ Yes (cookie `token`) |
| **What to send** | `:id` in the URL path |

**📥 Response (200):**
```json
{
  "success": true,
  "message": "Opportunity retrieved successfully",
  "data": { "id": 1, "title": "Hackathon 2026", "description": "...", "type": "event", "mode": "online", ... }
}
```

**❌ Errors:** `404` — opportunity not found

---

## 6. POST /opportunity/:id/apply — Apply to Opportunity

| | |
|---|---|
| **Auth required** | ✅ Yes (cookie `token`) |
| **What to send** | `:id` in URL + optional `message` in body |

**📤 Request:**
```json
{
  "message": "I'd love to join this!"
}
```
`message` is optional — max 500 chars. Can be `{}` or `{ "message": "" }`.

**📥 Response (201):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": 1, "user_id": 1, "opportunity_id": 1,
    "status": "pending", "message": "I'd love to join this!",
    "applied_at": "2026-07-25T12:00:00.000Z"
  }
}
```

**❌ Errors:** `400` — already applied / message too long, `404` — opportunity not found

---

## 7. POST /opportunity/:id/saved — Save / Bookmark

| | |
|---|---|
| **Auth required** | ✅ Yes (cookie `token`) |
| **What to send** | `:id` in URL only (no body) |

**📥 Response (201):**
```json
{
  "success": true,
  "message": "Opportunity saved successfully",
  "data": { "id": 1, "user_id": 1, "opportunity_id": 1, "saved_at": "2026-07-25T12:00:00.000Z" }
}
```

**❌ Errors:** `400` — already saved, `404` — opportunity not found

---

## 8. GET /alluser — List All Users

| | |
|---|---|
| **Auth required** | ❌ No |
| **What to send** | Nothing |

**📥 Response (200):**
```json
{
  "success": true,
  "message": "All users retrieved successfully",
  "data": [
    { "email": "john@example.com", "first_name": "John", "last_name": "Doe" }
  ]
}
```

---

## 9. POST /logout — Sign Out

| | |
|---|---|
| **Auth required** | ❌ No |
| **What to send** | Nothing (clears the cookie) |

**📥 Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## ⚠️ General Rules

### Auth Cookie
After login, the backend sets a cookie named `token`. The frontend must send this cookie with every authenticated request (`/onboarding`, `/feed`, `/opportunity/*`). If using `fetch`, set `credentials: "include"`.

### Error Format
All errors return:
```json
{
  "success": false,
  "message": "What went wrong"
}
```

| Code | Meaning |
|------|---------|
| 400 | Bad request (invalid/ missing fields) |
| 401 | Unauthorized (login again) |
| 404 | Resource not found |
| 409 | Conflict (duplicate — already exists) |
| 500 | Server error |
