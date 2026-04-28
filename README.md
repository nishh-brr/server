# Zero Trust — Docker Setup & Fix Guide

## 🐛 Issues Fixed

### 1. `manifest.json` Error (Hosting)
**Problem:** `client/public/index.html` references `manifest.json` but the file didn't exist.
This causes a 404 error in the browser and breaks PWA hosting on Netlify/Vercel.

**Fix:** Copy `manifest.json` → `client/public/manifest.json`

---

### 2. Client Dockerfile — Wrong CMD
**Problem:** `CMD ["npm", "run", "dev"]` — React CRA has no `dev` script.
This causes the container to crash immediately on startup.

**Fix:** `CMD ["npm", "start"]` (the correct CRA command)

---

### 3. No docker-compose.yml
**Fix:** `docker-compose.yml` added at the root level.
Note: No local MongoDB container needed — your project uses MongoDB Atlas.

---

### 4. No .dockerignore files
**Problem:** Without `.dockerignore`, Docker copies `node_modules` into the build
context, making images huge and slow.

**Fix:** `.dockerignore` files added for both `client/` and `server/`.

---

## 📁 Where to Place Each File

```
zero_trust_fixed/
├── docker-compose.yml          ← NEW (root level)
├── client/
│   ├── Dockerfile              ← REPLACE with fixed version
│   ├── .dockerignore           ← NEW
│   └── public/
│       └── manifest.json       ← NEW (fixes hosting error)
└── server/
    ├── Dockerfile              ← unchanged (already fine)
    └── .dockerignore           ← NEW
```

---

## ▶️ How to Run

```bash
cd zero_trust_fixed

# Build & start both containers
docker compose up --build

# Run in background
docker compose up --build -d

# Stop containers
docker compose down
```

## 🌐 URLs

| Service       | URL                        |
|---------------|----------------------------|
| Frontend      | http://localhost:3000      |
| Backend API   | http://localhost:5000/api  |
| Health Check  | http://localhost:5000/api/health |

## 🛠️ Useful Commands

```bash
# View live logs
docker compose logs -f

# View logs for one service
docker compose logs -f server

# Restart one service
docker compose restart client

# Shell into a container
docker compose exec server sh
```
