# DPR Backend

This is the backend for the Dynamic Personalized Roadmap Planner (DPR).

## Tech Stack
- Node.js
- Express
- MongoDB
- Mongoose

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root of the `backend` folder with the following contents:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

3. Run the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Domains
- `GET /api/domains` - Get all learning domains (for dashboard cards)

### Roadmap
- `POST /api/roadmap/generate` - Generate a personalized roadmap
- `GET /api/roadmap/:userId` - Get user's roadmap

### Progress
- `POST /api/progress/update` - Update skill progress
- `GET /api/progress/:userId` - Get user's progress

## Project Structure
- `src/config` - Database configuration
- `src/controllers` - Route controllers
- `src/models` - Mongoose models
- `src/routes` - API routes
- `src/services` - core logic services (Roadmap Engine, Resource Selector)

