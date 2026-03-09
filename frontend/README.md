# DPR Frontend

React client for the Dynamic Personalised Learning Roadmap Planner.

## Stack
- React 19
- React Router DOM 7
- Vite 7
- Vanilla CSS (`src/styles/`)

## Features
- User auth flows (register/login/logout) with persisted local session
- Domain browsing and roadmap generation form
- Roadmap view with module detail and resource cards
- Progress page with completion insights
- Light/dark theme toggle
- Auth-gated right-side AI guide panel
- Admin page for creating new domains

## Run locally
1. Install dependencies:
```bash
npm install
```

2. Start dev server:
```bash
npm run dev
```

3. Build production bundle:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Scripts
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Routes
- `/`
- `/login`
- `/register`
- `/dashboard`
- `/technology/:techId`
- `/generate-roadmap`
- `/learning-form/:techId`
- `/my-roadmaps`
- `/roadmap`
- `/roadmap/module/:moduleId`
- `/progress`
- `/settings`
- `/weekly-plan`
- `/about`
- `/admin/create-domain`

## Project structure
```text
src/
  components/
    agent/      # AI side panel
    cards/      # Domain/module/resource cards
    forms/      # Auth + learning preference forms
    layout/     # Navbar/layout/footer
    ui/         # Buttons, loader, progress bar
  context/      # User auth/session context
  pages/        # Route pages
  services/     # API client wrappers
  styles/       # global.css + variables.css
  App.jsx
  main.jsx
  router.jsx
```

## Backend integration
- API base URL is hardcoded in `src/services/api.js`:
  - `http://localhost:5000/api`
- Start backend before using auth, roadmap, progress, and agent features.
- Auth token is read from local storage key `dpr_user` and sent as `Bearer` token where available.