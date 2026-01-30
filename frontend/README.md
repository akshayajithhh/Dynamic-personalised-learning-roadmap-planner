# Dynamic Personalized Roadmap Planner (DPR)

A React-based frontend application designed to help users generate custom learning roadmaps based on their skills and preferences.

## 🚀 Features

- **Personalized Roadmaps**: Adapts to skill level, time availability, and learning style.
- **Progress Tracking**: Track completed modules and daily streaks.
- **Interactive UI**: Clean, modern interface with a friendly learning atmosphere.
- **Mock Backend**: Simulated API calls for a realistic experience without a server.

## 🛠️ Technology Stack

- **React 18**: Functional components & Hooks.
- **React Router Dom 6**: Client-side routing.
- **Vanilla CSS**: Custom design system with CSS Variables.
- **Vite**: Fast build tool and dev server.

## 📂 Project Structure

```
src/
├── components/         # Reusable UI building blocks
│   ├── cards/          # Display components (Tech, Module, Resource)
│   ├── forms/          # User input forms (Login, Preferences)
│   ├── layout/         # Structural components (Navbar, Footer)
│   └── ui/             # Primitive components (Button, Loader)
├── context/            # Global state (UserContext)
├── pages/              # Application views mapped to routes
├── services/           # Mock API simulation
├── styles/             # Global CSS & Design Tokens
├── App.jsx             # Main App component
├── main.jsx            # Entry point
└── router.jsx          # Route definitions
```

## 🎨 Design System

The UI uses a custom Design System defined in `src/styles/variables.css`:

- **Colors**: Primary Blue (`#2563eb`), Surface White (`#ffffff`), Text Dark (`#111827`).
- **Typography**: `Poppins` for headings, `Inter` for body text.
- **Components**: Rounded corners (`0.5rem`), soft shadows, and clean whitespace.

## 🏃‍♂️ Running the Project

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start development server**:
    ```bash
    npm run dev
    ```

3.  **Build for production**:
    ```bash
    npm run build
    ```

## 🔌 Connecting a Backend

Currently, the app uses `services/api.js` to simulate backend responses. To connect a real backend:

1.  Replace the functions in `services/api.js` with real `fetch` or `axios` calls.
2.  Ensure the backend returns data in the expected structure (match the mock data format).
3.  Update error handling to manage real network errors.

## 📝 Mock Data

- **Login**: Any email/password will work (simulates success).
- **Roadmap**: Generates a static mock roadmap for demonstration.
