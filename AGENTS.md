# AGENTS.md

## Cursor Cloud specific instructions

FanWorks (`fanworks.io`) is a single-page marketing/landing site. It has one product surface: a Vite + React (TypeScript) landing page. A small Express server (`server/index.js`) exists only to serve the production build and expose a few endpoints.

The update script runs `npm install`, so dependencies are already installed when a session starts. Node `>=20` is required (see `package.json` `engines`); the package manager is npm (`package-lock.json`).

### Running / building (commands live in `package.json`)

- Dev (primary devex): `npm run dev` — Vite dev server on `http://127.0.0.1:8080` (port is set in `vite.config.ts`, not the default 5173). This is what you use for landing-page development and has hot reload.
- Type check: `npx tsc --noEmit` — there is no `lint` script and no ESLint config in the repo, so this is the closest thing to linting.
- Build: `npm run build` — outputs static assets to `dist/`.
- Production serve: `npm start` — Express serves `dist/` on port `3000`. Non-obvious: it serves the built files, so you must run `npm run build` first or `dist/` will be missing and routes will 404. Endpoints: `/health`, `/version`, and `POST /api/realtime-session`.

### Non-obvious notes

- There is no test framework or test suite in this repo.
- `POST /api/realtime-session` (OpenAI Realtime voice) requires `OPENAI_API_KEY` (see `.env.example`). It is optional: the current frontend (`src/App.tsx`) does not call it, so the landing page works fully without it. Without the key the endpoint returns a graceful 503 "Voice is not configured yet" message.
- The contact form does not POST to a backend — on submit it opens a `mailto:` link (to `hello@fanworks.io`) and shows an inline "Your email app is ready." status.
- Deployment is Railway (`railway.json`): build `npm run build`, start `npm start`, healthcheck `/health`.
