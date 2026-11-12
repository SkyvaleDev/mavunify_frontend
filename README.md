# Mavunify Frontend

React + Vite + Tailwind v4 web app for Mavunify — a farming platform for Ugandan farmers.
The UI follows the Figma design source in `../Submit changes/`.

## Stack

- React 19, TypeScript, Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- react-router-dom v7
- lucide-react icons

## Run

```bash
npm install
npm run dev        # serves on port 8443 (configurable via PORT)
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview
```

## Structure

- `src/pages/` — Landing, Auth, Dashboard, AskMavunify, FarmRecords, Sustainability, Weather, Marketplace, LearningCentre, Community, Experts, Profile
- `src/components/AppLayout.tsx` — app shell (desktop sidebar + mobile bottom nav)
- `src/components/ui/` — button, card, badge primitives
- `src/index.css` — Tailwind import + Mavunify design tokens

## Routes

`/` landing · `/auth` sign in/up · `/dashboard` · `/ask` · `/records` · `/sustainability` · `/weather` · `/marketplace` · `/learn` · `/community` · `/experts` · `/profile`
