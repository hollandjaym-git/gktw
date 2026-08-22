# GKTW Mission Trip Schedule

Standalone volunteer shift-schedule + van-planning app for Give Kids The World
Village mission trips. Lives at **gktw.alpinepost.app**.

Extracted from options-journal (where it ran behind the `/gktw` path) into its
own app in the alpinepost.app ecosystem: frontend nginx + a tiny Express backend
+ Postgres, fronted in production by the shared `front-caddy`.

## Stack

- **frontend/** — Vite + React SPA (single component, `src/gktw/GktwTrip.jsx`),
  served by nginx. No auth; no service worker.
- **backend/** — Express + `pg`. All logic (schema, seed data, van algorithm,
  `/api/gktw/*` routes) is in `backend/gktw.js`; `server.js` is just the boot
  shell. Van-plan **writes** require the admin PIN (in `gktw.js`).
- **Postgres** — tables `gktw_shifts`, `gktw_van_settings`, `gktw_van_overrides`,
  `gktw_van_time_overrides`. Schema + seed run automatically on backend startup.

## Run locally

```bash
docker compose up --build -d      # http://localhost:8082
docker compose logs -f
docker compose down
```

The backend seeds the current trip's schedule from the `SHIFTS` constant in
`backend/gktw.js` on first boot (empty table only).

## Deploy (droplet, alpinepost.app ecosystem)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Requires `PGSHARED_GKTW_PASSWORD` in `.env` and the shared `edge` + `data`
networks + `pg-shared` (with the `gktw` role/db) already up. `front-caddy` routes
`gktw.alpinepost.app` → the `gktw-web` frontend alias.

## Loading a new trip

The schedule is transcribed trip data. For the next trip:

1. Replace `PREFERRED_NAMES`, `PINS`, `ASSIGNMENT_INFO`, and `SHIFTS` in
   `backend/gktw.js` with the new roster (same shapes).
2. Wipe the tables so the new data seeds:
   `TRUNCATE gktw_shifts, gktw_van_settings, gktw_van_overrides, gktw_van_time_overrides;`
3. Restart the backend — `seedIfEmpty` repopulates from the new `SHIFTS`.
