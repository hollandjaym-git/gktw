# Seed migration — 2026 trip data

`2026-trip-data.sql` is a data-only snapshot of the four `gktw_*` tables taken
from options-journal's DB (a prod replica) when GKTW was extracted into this app.
It preserves the current trip's state — including the **7 van overrides**, the
**1 leave-time override**, and the tuned van settings — that the backend's
constant-based auto-seed (`seedIfEmpty`) would NOT recreate.

The backend seeds `gktw_shifts` + default settings from constants on first boot,
so this file is optional. Load it when you want the exact prod-replica state
(e.g. for testing). It `TRUNCATE`s the four tables first, so it's safe to run
after the auto-seed and idempotent on re-runs.

## Load into the local stack

```bash
docker exec -i gktw-db psql -U gktw -d gktw < backend/seed-migration/2026-trip-data.sql
```

## Not for future trips

For a new trip you replace the data constants in `backend/gktw.js` and reseed
(see the repo README) — do **not** load this file. It's a one-time carry-over of
the 2026 trip only.
