// GKTW mission-trip schedule — standalone backend.
//
// Extracted from options-journal (where it lived as backend/gktw.js behind the
// /gktw path). Now its own app: a tiny Express server whose ONLY job is to serve
// the volunteer-schedule + van-planning API. No auth, no other features.
//
// All the real logic lives in ./gktw.js (schema, seed data, van algorithm, and
// the /api/gktw/* routes). This file is just the boot shell: pool + query helper
// + JSON body parsing + a health check + the one register call.

const express = require("express");
const cors = require("cors");
const { Pool, types: pgTypes } = require("pg");

// Match the number/timestamp parsing options-journal used, so any code moved
// over behaves identically. OID 1700 = NUMERIC (parse to float), 1114 =
// TIMESTAMP WITHOUT TIME ZONE (read as UTC wall-clock).
pgTypes.setTypeParser(1700, (val) => (val == null ? null : parseFloat(val)));
pgTypes.setTypeParser(1114, (val) => (val == null ? null : new Date(val.replace(" ", "T") + "Z")));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const query = (text, params) => pool.query(text, params);

const app = express();
const PORT = process.env.PORT || 3001;

// Same-origin in production (front-caddy -> nginx -> here), so only the app's own origins may call cross-origin.
const CORS_ALLOWED = new Set((process.env.GKTW_CORS_ORIGINS || "https://gktw.alpinepost.app,http://localhost:8082,http://localhost:5173").split(",").map((x) => x.trim()).filter(Boolean));
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(cors({ origin: (origin, cb) => cb(null, !origin || CORS_ALLOWED.has(origin)) }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", async (req, res) => {
  try {
    await query("SELECT 1");
    res.json({ ok: true, service: "gktw", db: "up" });
  } catch (err) {
    res.status(500).json({ ok: false, service: "gktw", db: "down", error: err.message });
  }
});

// Registers /api/gktw/* and kicks off the schema/seed on boot.
require("./gktw")(app, query);

app.listen(PORT, () => console.log(`GKTW API running on port ${PORT}`));
