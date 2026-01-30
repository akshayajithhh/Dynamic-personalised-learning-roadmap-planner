## Dynamic Personalized Roadmap Planner (DPR)

DPR is an **intelligent, data-rich learning platform** that generates **personalized skill roadmaps** across multiple technology domains.  
Instead of static course lists, DPR structures knowledge into **Domains → Modules → Skills → Resources** and builds a tailored path based on a learner’s profile.

---

## System Architecture

- **Frontend (`frontend/`)**  
  React + Vite single-page application that provides the learning dashboard, roadmap visualization, progress tracking UI, and forms for capturing learner preferences.

- **Backend (`backend/`)**  
  Node.js + Express API that handles authentication, domain/module/skill data, roadmap generation, and progress updates.

- **Database (MongoDB)**  
  Stores the **knowledge graph** (domains, modules, skills, resources) and user-specific roadmaps and progress, using Mongoose models.

Authentication uses **JWT**. The frontend talks to the backend via REST APIs under the `/api/*` namespace, and MongoDB persists both the **global knowledge base** and **per-user learning state**.

---

## Knowledge Base Structure

The DPR backend models a structured learning graph:

- **Domain** (`Domain` model)  
  High-level learning area such as:
  - Frontend Development
  - Backend Development
  - Full Stack Development
  - Data Science
  - Cybersecurity
  - DevOps & Cloud
  - Mobile App Development  
  
  Each domain includes:
  - `name`: e.g. `"Frontend Development"`  
  - `description`: What this track covers  
  - `icon`: Emoji to visually represent the domain (🖥️, 🛠️, 🌐, 📊, 🛡️, ☁️, 📱, etc.)  
  - `technologies`: Array of core technologies (e.g. `['HTML', 'CSS', 'JavaScript', 'React']`)

- **Module** (`Module` model)  
  A coherent learning stage inside a domain (3–5 modules per domain). Examples:
  - Frontend Development
    - HTML & Semantic Markup
    - CSS & Responsive Design
    - JavaScript & Browser APIs
    - React Fundamentals
  - Backend Development
    - Node.js Fundamentals
    - Databases & Storage
    - API Development with Express
    - Authentication & Security  
  
  Fields:
  - `name`
  - `description`
  - `domainId` (ref `Domain`)
  - `order` (numeric ordering within the domain)

- **Skill** (`Skill` model)  
  A concrete capability inside a module (4–6 skills per module). Examples:
  - `HTML Basics`, `Semantic HTML`, `Forms & Validation`
  - `JavaScript Basics`, `DOM Manipulation`, `Async JavaScript & Fetch API`
  - `Node.js Runtime & Module System`, `Asynchronous Patterns`
  - `Python Fundamentals`, `NumPy & Pandas`, `Data Visualization`  
  
  Fields:
  - `name`
  - `description`
  - `domain`: human-readable domain name (kept for simple querying and compatibility)
  - `moduleId` (ref `Module`)
  - `level`: `Beginner | Intermediate | Advanced`
  - `estimatedHours`: numeric effort estimate
  - `prerequisites`: array of **skill IDs** (`Skill` refs) to enforce logical progression

- **Resource** (`Resource` model)  
  Concrete learning materials per skill (2–3 per skill), pointing to real-world sources such as MDN, freeCodeCamp, YouTube, and official docs.  
  Fields:
  - `skillId` (ref `Skill`)
  - `title`
  - `type`: `"video" | "documentation" | "tutorial"`
  - `url`
  - `difficulty`: `Beginner | Intermediate | Advanced`
  - `rating`: numeric quality score (1–5)

- **Roadmap & Progress**  
  - `Roadmap`: stores a **user + domain specific** sequence of skills with associated resources and unlock status.  
  - `Progress`: tracks per-skill completion and percentage for each user.  

Together, these models turn DPR into a **realistic learning database**, not just a demo with a single track.

---

## Personalization & Roadmap Logic

When a learner selects a domain and fills in preferences (skill level, learning style, etc.), DPR’s backend:

- **Identifies the domain** chosen from the dashboard (e.g. Frontend Development, Data Science).
- **Resolves relevant modules** for that domain via `Module.domainId` and orders them via `order`.
- **Gathers skills** attached to those modules via `Skill.moduleId` and filters by:
  - **Skill level**: beginner-friendly skills first, then intermediate and advanced, with safe fallback logic so the roadmap never ends up empty.
  - **Prerequisites**: ensures advanced skills depend on more fundamental ones.
- **Selects resources** per skill using the `resourceSelector` service:
  - Matches the user’s preferred learning style (video vs documentation vs tutorial).
  - Considers difficulty and rating to choose the highest scoring resource.
- **Builds a roadmap** (`Roadmap` document) as an ordered list of skill + resource pairs, marking the first skill as `"unlocked"` and the rest as `"locked"`.
- **Updates progress** when learners mark modules as complete, unlocking the next skill in the roadmap.

Learners can then see:
- A **visual roadmap** per domain (ordered modules/skills).
- A **detail view** for each module with its description and resources.
- **Progress metrics** over time (modules completed, % of track done, estimated time invested).

---

## Tech Stack

- **Frontend**
  - React (SPA)
  - React Router
  - Vite dev/build tooling
  - Context API for auth/user state

- **Backend**
  - Node.js + Express
  - JWT-based authentication
  - Modular route + controller structure
  - Roadmap engine and resource selector services

- **Database**
  - MongoDB (via Mongoose)
  - Models: `User`, `Domain`, `Module`, `Skill`, `Resource`, `Roadmap`, `Progress`

---

## Running the Project

### 1. Backend

From the `backend` directory:

```bash
npm install
```

Create a `.env` file in `backend` (see `backend/README.md` for details), then run:

```bash
npm run dev
```

This will:
- Connect to MongoDB
- Start the API server (default `http://localhost:5000`)

To seed the rich knowledge base (multiple domains, modules, skills, and resources), run:

```bash
node src/seeder.js
```

### 2. Frontend

From the `frontend` directory:

```bash
npm install
npm run dev
```

Open the printed local URL (e.g. `http://localhost:5173`/`5174`) in your browser.  
Use the dashboard to select a domain, generate a roadmap, drill into modules, and track progress.

For more endpoint-level details, see `backend/README.md`. For page/component structure, see `frontend/README.md`.

---

## Future Scope

- **Admin Panel**  
  Manage domains, modules, skills, and resources directly from the UI (create/update/delete learning items without touching the database).

- **Adaptive Learning**  
  Adjust roadmap difficulty and ordering dynamically based on:
  - Completion speed and accuracy
  - Self-reported confidence
  - Time spent per module

- **AI-Powered Recommendations**  
  - Suggest next best skills or domains based on user behavior and goals.
  - Recommend external resources (articles, videos, courses) ranked by relevance and quality.
  - Generate personalized weekly study plans from roadmap + availability.

This makes DPR a strong portfolio-ready project showcasing **full-stack engineering, data modeling, and personalized learning logic** in one cohesive system.

