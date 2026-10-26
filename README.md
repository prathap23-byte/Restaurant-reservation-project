# Gather & Grain — Restaurant Table Reservation

**Course scope:** Experiments 10–20 (Units III, IV and V)

A responsive React + Vite restaurant discovery and table reservation project styled as a modern dining brand.

## Features
- Restaurant discovery, search, cuisine filter and restaurant detail pages
- Reservation form with controlled fields and validation
- Login/register pages, protected reservation dashboard, edit and cancel flows
- Reusable components, custom hooks, React Context and React Router
- Redux Toolkit global state for authentication, restaurants and reservations
- Includes a local Express REST API with JSON-file persistence, CRUD, bearer-token protected routes and Redux Toolkit global state.
- Testing/PWA/deployment experiments are included.

## Technology
React 18, Vite, React Router, Redux Toolkit, React Redux, Express, Node.js, Vitest, React Testing Library, lucide-react.

## Folder structure
```text
Restaurant_Reservation_Complete_Unit_III_IV_V/
├── public/                 # favicon, manifest, icons, offline fallback
├── src/
│   ├── components/         # shared UI and reservation form
│   ├── context/             # authentication context
│   ├── data/                # sample restaurant catalogue
│   ├── hooks/               # useAuth, useRestaurants, useReservations
│   ├── pages/               # routes/pages
│   ├── services/            # fetch-based REST API client
│   ├── store/               # Redux Toolkit slices
│   ├── tests/               # tests in the complete archive
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── server/                  # Express API in Unit IV/V archives
├── package.json
└── vite.config.js
```

## Prerequisites
- Node.js 20 LTS or newer (Node 18.18+ may work)
- npm
- VS Code

## Install and run
1. Extract this ZIP and open the extracted project folder in VS Code.
2. Open Terminal → New Terminal.
3. Run `npm install`.
4. In one terminal run `npm run server` (available in the Unit IV and complete archives).
5. In another terminal run `npm run dev`.
6. Open the local URL printed by Vite, normally `http://localhost:5173`.

For the Unit IV and complete archives, you can run both processes together with `npm run dev:full` after `npm install`. API requests use `VITE_API_BASE_URL` from `.env` if set, otherwise `http://localhost:4000/api`. Copy `.env.example` to `.env` to customise values. Restart Vite after changing environment variables.

## Backend setup and persistence
In Unit IV/V archives, the Express API listens on port 4000 by default and writes users/reservations to `server/data.json`. This is local development storage, not a production database. Keep the server running for authentication and reservation CRUD. The JSON file is generated/updated by the API and is ignored by Git. To reset local demo data, stop the server and replace its contents with `{"restaurants": [], "users": [], "reservations": []}`; the API will seed restaurant listings on first read.

Authentication in this college demo is intentionally development-only. The sample API stores a SHA-256 password hash and opaque bearer token in a local JSON file; it is not production-grade authentication. Use HTTPS, a maintained password-hashing algorithm, secure cookies, rate limiting, and a real database before production. Never place production secrets in `VITE_*` variables. Change `JWT_SECRET` is not required by this token demo; the example variable is illustrative only.

## Testing
In the complete archive, run `npm test` for the Vitest suite or `npm run test:watch` while editing. Run `npm run build` to create the production bundle. Automated tests are included but have not been claimed as passing unless actually run in your environment.

## PWA installation
In the complete archive, run `npm run build` and serve the built app on localhost or HTTPS. The service worker is registered in production mode and deliberately does not cache `/api/` responses, so authenticated data is not placed in Cache Storage. The manifest and SVG app icons are in `public/`. Browser install UI varies by browser; use the browser's install option when available.

## Chrome DevTools verification
1. Press F12 and select **Network**.
2. Select **Fetch/XHR** and reload the page. `GET /api/restaurants` should appear when the API is running.
3. Register or log in. Inspect `POST /api/auth/register` or `POST /api/auth/login`.
4. Create a reservation and inspect `POST /api/reservations`.
5. Open My reservations for `GET /api/reservations`; edit for `PUT /api/reservations/:id`; cancel for `DELETE /api/reservations/:id`.
6. Check request status, payload and response in the Network request details. Unauthenticated protected requests should return 401.
7. Under Application, inspect Manifest, Service Workers and Cache Storage. The service worker does not cache API requests.

## Deployment notes
- **GitHub Pages:** the workflow in `.github/workflows/deploy-pages.yml` builds the frontend. In the repository settings, enable Pages with GitHub Actions. A separate Express API is required for real login/CRUD; host it separately and set `VITE_API_BASE_URL` before building. GitHub Pages cannot run the Express server.
- **Vercel:** `vercel.json` rewrites SPA routes to `index.html`. For full CRUD, deploy the Express API separately or adapt the backend to Vercel Functions, then set `VITE_API_BASE_URL`.
- **Netlify:** `netlify.toml` and `public/_redirects` configure SPA fallback. Deploy the `dist` folder using `npm run build`; host the Express API separately and configure the API base URL.
- Deployment configuration is provided, but this project has not been published or deployed by this generator.

## Common issues
- **API connection error:** make sure the backend is running on port 4000 and that `VITE_API_BASE_URL` points to it.
- **401 on My reservations:** log in first; protected API routes require the bearer token.
- **Port already in use:** set `PORT=4001` for the backend and update `VITE_API_BASE_URL` accordingly.
- **Install errors / certificate errors:** check network/proxy configuration and npm registry access; do not disable TLS verification as a permanent fix.
- **Blank route after deployment:** confirm SPA fallback configuration and use the correct Vite base path for the hosting subpath.
- **Images do not load:** restaurant photography uses remote Unsplash image URLs and requires an internet connection.
