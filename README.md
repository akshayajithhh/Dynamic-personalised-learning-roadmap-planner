# Dynamic Personalised Learning Roadmap Planner

Full-stack app for generating personalised learning roadmaps, tracking skill progress, and managing learning domains through an admin panel.

## What it does
- Lets users register/login and store sessions in local storage (`dpr_user`)
- Lists learning domains from MongoDB
- Generates roadmap steps by domain + learner preferences
- Unlocks skills progressively as users mark steps complete
- Shows module-level resources and study tips
- Supports admin-only domain creation

## Tech stack
- Frontend: React 19 + Vite + React Router
- Backend: Node.js + Express + Mongoose
- Database: MongoDB
- Auth: JWT bearer tokens

## Repo structure
- `frontend/` React client
- `backend/` Express API, models, services, seeder

## Quick start
1. Start MongoDB locally.
2. Configure and start backend.
3. Seed the database.
4. Start frontend.

### 1) Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dpr_db
JWT_SECRET=replace_with_secure_secret

```

Run backend:
```bash
npm run dev
```

Seed data (this clears and recreates core collections):
```bash
npm run seed
```

### 2) Frontend setup
```bash
cd frontend
npm install
npm run dev
```

Frontend default dev URL is usually `http://localhost:5173`.

## Scripts
### Backend (`backend/package.json`)
- `npm run dev` - start API with nodemon
- `npm start` - start API with node
- `npm run seed` - reset and seed domains/modules/skills/resources/users/roadmaps/progress

### Frontend (`frontend/package.json`)
- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - eslint

## API overview
Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Domains
- `GET /domains` (public)
- `POST /domains` (requires `Bearer` token with admin role)

### Roadmap
- `POST /roadmap/generate`
- `GET /roadmap/:userId?domain=<domainId-or-name>`
- `GET /roadmap/skill/:skillId?userId=<userId>`

### Progress
- `POST /progress/update`
- `GET /progress/:userId`

## Frontend routes
- `/`
- `/login`, `/register`
- `/dashboard`
- `/technology/:techId`
- `/generate-roadmap`
- `/learning-form/:techId`
- `/my-roadmaps`, `/roadmap`
- `/roadmap/module/:moduleId`
- `/progress`
- `/settings`
- `/weekly-plan`
- `/about`
- `/admin/create-domain`

## Notes
- Frontend API base is currently hardcoded in `frontend/src/services/api.js` as `http://localhost:5000/api`.
