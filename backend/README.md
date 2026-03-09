# DPR Backend

Express + MongoDB API for the Dynamic Personalised Learning Roadmap Planner.

## Stack
- Node.js (ES modules)
- Express
- MongoDB + Mongoose
- JWT auth
- bcrypt password hashing

## Setup
1. Install dependencies:
```bash
npm install
```

2. Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dpr_db
JWT_SECRET=replace_with_secure_secret

# AI provider config
CODING_AGENT_API_KEY=your_provider_api_key
# optional fallback supported by controller:
# OPENAI_API_KEY=your_provider_api_key
CODING_AGENT_API_URL=https://api.openai.com/v1/chat/completions
CODING_AGENT_MODEL=gpt-4o-mini
CODING_AGENT_TEMPERATURE=0.3
```

3. Start server:
```bash
npm run dev
```

4. Seed the database (destructive reset of core collections):
```bash
npm run seed
```

## Scripts
- `npm run dev` - run with nodemon
- `npm start` - run with node
- `npm run seed` - clear and repopulate domains/modules/skills/resources/users/roadmaps/progress

## API routes
Base: `http://localhost:5000/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Domains
- `GET /domains` (public)
- `POST /domains` (protected + admin only)

### Roadmap
- `POST /roadmap/generate`
- `GET /roadmap/:userId?domain=<domainId-or-name>`
- `GET /roadmap/skill/:skillId?userId=<userId>`

### Progress
- `POST /progress/update`
- `GET /progress/:userId`

### Agent
- `POST /agent/chat` (protected)

## Project structure
- `src/server.js` - bootstraps env, DB connection, and HTTP server
- `src/app.js` - middleware and route mounting
- `src/config/` - database connection
- `src/routes/` - route definitions
- `src/controllers/` - request handlers
- `src/models/` - mongoose schemas
- `src/services/` - roadmap generation and resource selection logic
- `src/seeder.js` - full dataset generation/reset script

## Notes
- Only `/api/domains` `POST` and `/api/agent/chat` are currently JWT-protected by middleware.
- Roadmap generation currently supports domain id or domain name inputs.

