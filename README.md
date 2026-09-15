# academywebpage
This is the official webpage for the hockey academy.

## Stack
- **client/** — React + TypeScript + Vite, React Router, Tailwind CSS
- **server/** — Node + Express + TypeScript

## Getting started
```bash
npm install     # installs both workspaces
npm run dev     # client on http://localhost:5173, server on http://localhost:3001
```

The Vite dev server proxies `/api/*` requests to the Node server.

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Run client and server together with hot reload |
| `npm run build` | Type-check and build both into their `dist/` folders |
| `npm start` | Run the built server |
