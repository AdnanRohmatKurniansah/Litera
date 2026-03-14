---
description: Environment setup and local frontend server installation workflow
---

# Setup and Start Dev Server

Follow this workflow to run the React + Vite application locally.

// turbo
1. Install All Dependencies
Ensure you are in the project directory `litera-web`.
```bash
npm install
```

2. Configure Environment File
Ensure the `.env` file exists. If not, copy it from `.env.example`. Do not auto-run this step if the environment requires manual configuration for API keys or endpoints.
```bash
cp .env.example .env
```

// turbo
3. Start Dev Server (Vite)
Run the local server with Hot Module Replacement (HMR).
```bash
npm run dev
```

The server will typically start at `http://localhost:5173/` (depending on Vite configuration).
