# Zero Trust Architecture — Hybrid Cloud Console

## Project Structure
```
zero_trust_fixed/
├── server/          ← Express + MongoDB backend (port 5000)
└── client/          ← React frontend (port 3000)
```

## Setup & Run

### 1. Backend
```bash
cd server
npm install
node server.js
```
Server runs at: http://localhost:5000

### 2. Frontend
```bash
cd client
npm install
npm start
```
Frontend runs at: http://localhost:3000

---

## What's Connected

| Frontend Page     | Backend Endpoint                    | Database       |
|-------------------|-------------------------------------|----------------|
| Login             | POST /api/auth/login                | MongoDB (User) |
| Register          | POST /api/auth/register             | MongoDB (User) |
| Dashboard         | GET  /api/events/dashboard-summary  | MongoDB        |
| Hybrid Cloud      | GET  /api/events/hybrid-summary     | MongoDB+Firebase|
| Hybrid Cloud      | GET  /api/events/hybrid-events      | MongoDB+Firebase|
| Audit Logs        | GET  /api/events/login-events       | MongoDB        |
| Audit Logs        | GET  /api/events/login-summary      | MongoDB        |
| Threat Monitor    | GET  /api/events/threat-events      | MongoDB        |
| Threat Monitor    | GET  /api/events/threat-summary     | MongoDB        |

## Auth Flow
1. User registers → password hashed with bcrypt → stored in MongoDB
2. User logs in → JWT token returned → stored in localStorage as `zt_token`
3. All protected pages check for `zt_token` → redirect to /login if missing
4. Every API call sends `Authorization: Bearer <token>` header
5. Logout clears localStorage and redirects to /login

## Hybrid Cloud Logic
- On-Prem IPs (from ALLOWED_IPS in .env) → saved to MongoDB `onpremevents`
- Cloud IPs (all others) → saved to Firebase Firestore `cloudevents`
- If Firebase is unavailable → falls back to MongoDB `cloudevents` collection

## MongoDB Collections
- `users` — registered accounts
- `loginevents` — every login attempt (success + fail)
- `onpremevents` — on-prem login events (hybrid)
- `cloudevents` — cloud login events (fallback from Firebase)
- `threatevents` — blocked/flagged IPs
- `dangerousips` — blocklist
