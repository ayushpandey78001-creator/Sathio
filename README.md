# Sathio — find your missing teammate

A full-stack platform for finding teammates for hackathons, startups, research, and
side projects. People create a profile, list skills and what they're looking for, get
an automatically computed rating score, and see a ranked feed of like-minded people to
connect with.

```
sathio/
├── render.yaml                 ← one Render "Blueprint" that deploys both services + a DB
├── backend/                    ← FastAPI + SQLAlchemy API
│   ├── app/
│   │   ├── main.py             ← app entrypoint, CORS, skill-catalog seeding
│   │   ├── database.py         ← SQLite locally / Postgres on Render via DATABASE_URL
│   │   ├── models.py           ← User, Skill, UserSkill, Connection
│   │   ├── schemas.py          ← Pydantic request/response models
│   │   ├── security.py         ← password hashing + JWT
│   │   ├── auth.py             ← get_current_user dependency
│   │   ├── matching.py         ← rating score + match score algorithms
│   │   ├── serializers.py      ← User -> JSON helper
│   │   └── routers/
│   │       ├── auth.py         ← POST /auth/signup, /auth/login
│   │       ├── users.py        ← GET/PUT /users/me, GET /users/skills/catalog
│   │       ├── matches.py      ← GET /matches (ranked discovery feed)
│   │       └── connections.py  ← request / respond to connections
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
└── frontend/                   ← React 19 + Vite + Tailwind SPA
    ├── index.html
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx              ← routes
    │   ├── index.css            ← Tailwind + design tokens
    │   ├── lib/api.js           ← axios client (adds JWT automatically)
    │   ├── context/AuthContext.jsx
    │   ├── components/
    │   │   ├── NavBar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── SignalGauge.jsx  ← radial "signal strength" gauge (rating/match score)
    │   │   └── SignalGraph.jsx  ← hero illustration
    │   └── pages/
    │       ├── Landing.jsx
    │       ├── Signup.jsx
    │       ├── Login.jsx
    │       ├── Profile.jsx      ← bio, skills, "looking for" tags
    │       ├── Discover.jsx     ← ranked match feed, send connection requests
    │       └── Connections.jsx  ← pending / accepted connections
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.js
    └── .env.example
```

## How matching works

- **Rating score (0–100)** rewards a complete profile: bio quality, number of skills,
  at least one "looking for" tag, a portfolio link, and a college/affiliation. See
  `backend/app/matching.py::compute_rating_score`.
- **Match score (0–100)** between two users is a weighted Jaccard similarity: 70% skill
  overlap + 30% interest overlap, plus a small bonus for the other person's profile
  quality so incomplete "ghost" profiles rank lower. See `compute_match`.
- `/matches` returns everyone (except the current user and existing connections)
  sorted by match score, highest first.

## Run it locally

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # optional but recommended
pip install -r requirements.txt
cp .env.example .env                                 # edit SECRET_KEY if you like
uvicorn app.main:app --reload --port 8000
```
This creates `sathio.db` (SQLite) on first run and seeds a starter skill catalog.
API docs live at `http://localhost:8000/docs`.

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:8000
npm run dev
```
Visit `http://localhost:5173`.

## Deploy to Render (free tier)

**Option A — one-click Blueprint (recommended)**
1. Push this repo to GitHub.
2. In Render: **New → Blueprint**, point it at your repo. Render reads `render.yaml`
   and creates three resources automatically:
   - `sathio-api` — a free Python web service running the FastAPI backend
   - `sathio-web` — a free static site running the built React app
   - `sathio-db` — a free Postgres database, auto-wired to the backend via `DATABASE_URL`
3. After the first deploy, open `sathio-web`, note its URL, and update:
   - On `sathio-api`: env var `CORS_ORIGINS` → your `sathio-web` URL (e.g.
     `https://sathio-web.onrender.com`) instead of `*`.
   - On `sathio-web`: env var `VITE_API_URL` → your `sathio-api` URL, then trigger a
     redeploy (static sites bake env vars in at build time).

**Option B — manual setup**
1. **New → PostgreSQL** (free plan) — copy the "Internal Database URL".
2. **New → Web Service** from your repo, root directory `backend`:
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Env vars: `SECRET_KEY` (any long random string), `DATABASE_URL` (from step 1),
     `CORS_ORIGINS` (your frontend URL once you have it, or `*` to start).
3. **New → Static Site** from your repo, root directory `frontend`:
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Env var: `VITE_API_URL` (your backend URL from step 2)
   - Add a rewrite rule `/* → /index.html` so client-side routing works.

**Notes on the free tier**
- Free web services spin down after inactivity — the first request after idle can take
  ~30–50s to wake up. That's a Render limitation, not a bug in this app.
- Free Postgres databases on Render expire after 30 days unless upgraded — fine for a
  demo/portfolio project, worth knowing before you rely on it long-term.
- SQLite (the local default) does **not** persist reliably on Render's free web
  services since the filesystem is ephemeral — use the free Postgres for anything
  deployed.

## What's intentionally simple (v1)

- Passwords are hashed with bcrypt and auth uses a stateless JWT (no refresh tokens /
  email verification yet).
- Skill matching is keyword-based (Jaccard similarity), not embeddings — fast, free,
  and transparent, but it won't catch synonyms like "ML" vs "machine learning" unless
  people use the shared catalog/autocomplete.
- No image uploads — avatars aren't implemented yet.
- No pagination on `/matches` — fine for hundreds of users, would need it at scale.

These are all reasonable next steps once the core loop (profile → score → match →
connect) is validated.
