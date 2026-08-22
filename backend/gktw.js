// ─────────────────────────────────────────────────────────────────────────────
// GKTW mission-trip schedule — Give Kids The World Village volunteer app.
// This module owns everything: the schema (gktw_shifts + van tables), the seed
// data for the current trip (SHIFTS below), the van-planning algorithm, and the
// unauthenticated /api/gktw/* routes. It's registered by server.js as
// `require('./gktw')(app, query)`.
//
// NEXT TRIP: the schedule below is one trip's transcribed data. To reload for a
// future trip, replace the PINS / ASSIGNMENT_INFO / SHIFTS constants with the
// new roster, wipe the tables (`TRUNCATE gktw_shifts, gktw_van_settings,
// gktw_van_overrides, gktw_van_time_overrides;`), and restart — seedIfEmpty
// repopulates from the new SHIFTS on the next boot.
// ─────────────────────────────────────────────────────────────────────────────

// Preferred / short display names for a few volunteers (cosmetic only).
const PREFERRED_NAMES = {
  "Alikah Henson": "Ali",
  "William Baucum": "Will",
};

// PINs are printed on the same roster every volunteer already has — not a
// secret — shown alongside each name so people can tell volunteers with
// similar/shared names apart.
const PINS = {
  "Abby Hammett": "22743", "Malvin Sanders": "63953", "Alikah Henson": "735700",
  "William Baucum": "968028", "Lisa Connell": "42696", "Allie Shebs": "968067",
  "Hayden Gurganus": "496905", "John William Connell": "330918", "Cole Reese": "435655",
  "Keri Southern": "200512", "Cooper Southern": "632490", "Rachel Steed": "926213",
  "Isaac Steed": "117466", "Kailyn Steed": "118934", "Paxton Lambert": "473700",
  "Baker Williams": "923640", "Chloe Kwasneiwski": "214682", "Kara Kwasneiwski": "546103",
  "Sophie Holland": "433919", "Stacey Holland": "986424", "Claire Connell": "531450",
  "Bentley Watts": "53980", "Michelle Judd": "775046", "Peyton Judd": "477057",
  "Jay Holland": "144642", "Tracey Mullinax": "976321", "Nathan Whitaker": "265975",
  "Michelle Whitaker": "123476",
};

// Assignment type -> { age requirement, where to meet }. Looked up by the
// clean assignment name (age requirement text is stripped from the raw
// "Assignment ***Age Requirement: ..." strings before this lookup).
const ASSIGNMENT_INFO = {
  "Cafe Clayton Breakfast":        { age: "8+ w/ adult; 16+ alone",        where: "Meet F&B in the Cafe" },
  "Cafe Clayton Dinner":           { age: "8+ w/ adult; 16+ alone",        where: "Meet F&B in the Cafe" },
  "Cafe Clayton Delivery":         { age: "16+ w/ valid driver's license", where: "Meet F&B in the Cafe" },
  "Cafe Clayton Greeter":          { age: "16+",                           where: "Meet F&B in the Cafe" },
  "Breakfast at Zach's Timeout":   { age: "12+ w/ an adult; 16+ alone",     where: "Meet F&B in the Cafe" },
  "Henri's Starlite Scoops":       { age: "10+ w/ an adult; 16+ alone",     where: "Wait in VS lobby" },
  "Amberville Attendant":          { age: "10+ w/ an adult; 16+ alone",     where: "Wait in VS lobby" },
  "Castle Attendant":              { age: "10+ w/ an adult; 16+ alone",     where: "Wait in VS lobby" },
  "Carousel Gate Keeper":          { age: "16+",                           where: "Wait in VS lobby" },
  "Carousel Operator":             { age: "18+",                           where: "Wait in VS lobby" },
  "Olivia's Oasis":                { age: "18+",                           where: "Wait in VS lobby" },
  "Rockin' Spa Transformation Attendant": { age: "14+ w/ adult; 16+ alone", where: "Wait in VS lobby" },
  "Attractions Operator":          { age: "18+",                           where: "Wait in VS lobby" },
  "Noah's Nook Attendant":         { age: "10+ w/ adult; 16+ alone",        where: "Wait in VS lobby" },
  "Park of Dreams Attendant":      { age: "16+",                           where: "Wait in VS lobby" },
  "WonderLab Greeter":             { age: "14+ w/ an adult; 16+ alone",     where: "Wait in VS lobby" },
  "Halloween Extravaganza":        { age: "8+ w/ adult; 16+ alone",         where: "Wait in VS lobby" },
  "Digital Photography Assistant": { age: "16+",                           where: "Wait in VS lobby" },
  "Train Conductor":               { age: "18+ w/ valid driver's license", where: "Go to Engineering" },
  "Train Driver":                  { age: "25+ w/ valid driver's license", where: "Go to Engineering" },
  "Village Shuttle Driver":        { age: "18+ w/ valid driver's license", where: "Go to Engineering" },
  "Mayor Clayton's Surprise Birthday Bash": { age: "8+ w/ adult; 16+ alone", where: "Wait in VS lobby" },
  "Winter Wonderland":             { age: "8+ w/ adult; 16+ alone",         where: "Wait in VS lobby" },
  "Horse & Pony Rides":            { age: "14+ w/ an adult; 16+ alone",     where: "Wait in VS lobby" },
};

// Master schedule, transcribed from the trip's by-day assignment sheets.
// { date: 'YYYY-MM-DD', assignment, from, to, names: [...] }
const SHIFTS = [
  // ── 6/27 ──────────────────────────────────────────────────────────────
  { date: "2026-06-27", assignment: "Cafe Clayton Breakfast", from: "7:30 AM", to: "10:30 AM", names: [
    "Malvin Sanders","Abby Hammett","William Baucum","Allie Shebs","Lisa Connell","Paxton Lambert",
    "Baker Williams","Kailyn Steed","John William Connell","Hayden Gurganus","Alikah Henson","Cooper Southern",
    "Rachel Steed","Isaac Steed","Peyton Judd","Tracey Mullinax","Bentley Watts","Claire Connell",
    "Sophie Holland","Michelle Judd","Stacey Holland","Cole Reese" ] },
  { date: "2026-06-27", assignment: "Henri's Starlite Scoops", from: "7:30 AM", to: "11:00 AM", names: ["Michelle Whitaker","Nathan Whitaker"] },
  { date: "2026-06-27", assignment: "Amberville Attendant", from: "7:45 AM", to: "11:15 AM", names: ["Jay Holland"] },
  { date: "2026-06-27", assignment: "Castle Attendant", from: "8:00 AM", to: "11:15 AM", names: ["Kara Kwasneiwski"] },
  { date: "2026-06-27", assignment: "Carousel Gate Keeper", from: "8:30 AM", to: "12:00 PM", names: ["Chloe Kwasneiwski"] },
  { date: "2026-06-27", assignment: "Carousel Operator", from: "8:30 AM", to: "12:00 PM", names: ["Keri Southern"] },
  { date: "2026-06-27", assignment: "Olivia's Oasis", from: "4:30 PM", to: "9:15 PM", names: ["Keri Southern","Tracey Mullinax"] },
  { date: "2026-06-27", assignment: "Rockin' Spa Transformation Attendant", from: "4:30 PM", to: "9:15 PM", names: ["Kailyn Steed","Hayden Gurganus","Allie Shebs"] },
  { date: "2026-06-27", assignment: "Amberville Attendant", from: "5:30 PM", to: "9:15 PM", names: ["William Baucum"] },
  { date: "2026-06-27", assignment: "Cafe Clayton Delivery", from: "5:30 PM", to: "9:30 PM", names: ["Peyton Judd","Alikah Henson","Chloe Kwasneiwski","Kara Kwasneiwski"] },
  { date: "2026-06-27", assignment: "Cafe Clayton Dinner", from: "5:30 PM", to: "8:30 PM", names: ["Stacey Holland","Jay Holland","Nathan Whitaker","Michelle Whitaker"] },
  { date: "2026-06-27", assignment: "Castle Attendant", from: "5:30 PM", to: "9:15 PM", names: ["Claire Connell","Isaac Steed"] },
  { date: "2026-06-27", assignment: "Attractions Operator", from: "5:45 PM", to: "9:15 PM", names: ["Lisa Connell","Michelle Judd"] },
  { date: "2026-06-27", assignment: "Carousel Gate Keeper", from: "6:00 PM", to: "9:15 PM", names: ["Paxton Lambert"] },
  { date: "2026-06-27", assignment: "Carousel Operator", from: "6:00 PM", to: "9:15 PM", names: ["Rachel Steed"] },
  { date: "2026-06-27", assignment: "Noah's Nook Attendant", from: "6:00 PM", to: "9:00 PM", names: ["Sophie Holland","Bentley Watts"] },
  { date: "2026-06-27", assignment: "Park of Dreams Attendant", from: "6:00 PM", to: "9:15 PM", names: ["Abby Hammett"] },
  { date: "2026-06-27", assignment: "WonderLab Greeter", from: "6:15 PM", to: "9:15 PM", names: ["Cooper Southern"] },
  { date: "2026-06-27", assignment: "Henri's Starlite Scoops", from: "6:30 PM", to: "10:00 PM", names: ["John William Connell","Malvin Sanders","Baker Williams","Cole Reese"] },

  // ── 6/28 ──────────────────────────────────────────────────────────────
  { date: "2026-06-28", assignment: "Breakfast at Zach's Timeout", from: "7:30 AM", to: "10:30 AM", names: ["Michelle Judd"] },
  { date: "2026-06-28", assignment: "Cafe Clayton Breakfast", from: "7:30 AM", to: "10:30 AM", names: [
    "Tracey Mullinax","John William Connell","Lisa Connell","Paxton Lambert","William Baucum","Malvin Sanders",
    "Abby Hammett","Cole Reese","Keri Southern","Cooper Southern","Rachel Steed","Isaac Steed","Baker Williams",
    "Peyton Judd","Jay Holland","Michelle Whitaker","Nathan Whitaker","Kara Kwasneiwski","Sophie Holland",
    "Stacey Holland","Claire Connell" ] },
  { date: "2026-06-28", assignment: "Horse & Pony Rides", from: "7:30 AM", to: "11:15 AM", names: ["Alikah Henson","Bentley Watts","Chloe Kwasneiwski","Hayden Gurganus","Allie Shebs","Kailyn Steed"] },
  { date: "2026-06-28", assignment: "Rockin' Spa Transformation Attendant", from: "4:30 PM", to: "9:15 PM", names: ["Alikah Henson","Peyton Judd","Sophie Holland"] },
  { date: "2026-06-28", assignment: "Amberville Attendant", from: "5:30 PM", to: "9:15 PM", names: ["Cole Reese"] },
  { date: "2026-06-28", assignment: "Cafe Clayton Delivery", from: "5:30 PM", to: "9:30 PM", names: ["Rachel Steed","Lisa Connell","Cooper Southern","Baker Williams"] },
  { date: "2026-06-28", assignment: "Cafe Clayton Dinner", from: "5:30 PM", to: "8:30 PM", names: [
    "John William Connell","Abby Hammett","Kailyn Steed","Tracey Mullinax","Keri Southern","Malvin Sanders",
    "Allie Shebs","Chloe Kwasneiwski","Kara Kwasneiwski","Claire Connell","Bentley Watts","Jay Holland",
    "Paxton Lambert","Michelle Whitaker","Nathan Whitaker" ] },
  { date: "2026-06-28", assignment: "Carousel Gate Keeper", from: "6:00 PM", to: "9:15 PM", names: ["Isaac Steed"] },
  { date: "2026-06-28", assignment: "Carousel Operator", from: "6:00 PM", to: "9:15 PM", names: ["William Baucum"] },
  { date: "2026-06-28", assignment: "Noah's Nook Attendant", from: "6:00 PM", to: "9:00 PM", names: ["Michelle Judd","Stacey Holland"] },
  { date: "2026-06-28", assignment: "Park of Dreams Attendant", from: "6:00 PM", to: "9:15 PM", names: ["Hayden Gurganus"] },

  // ── 6/29 ──────────────────────────────────────────────────────────────
  { date: "2026-06-29", assignment: "Breakfast at Zach's Timeout", from: "7:30 AM", to: "10:30 AM", names: ["Cole Reese","Cooper Southern"] },
  { date: "2026-06-29", assignment: "Cafe Clayton Breakfast", from: "7:30 AM", to: "10:30 AM", names: [
    "Keri Southern","Rachel Steed","Isaac Steed","Kailyn Steed","Hayden Gurganus","Allie Shebs","Lisa Connell",
    "Baker Williams","Malvin Sanders","Abby Hammett","Nathan Whitaker","Michelle Whitaker","Tracey Mullinax",
    "Peyton Judd","Michelle Judd","Bentley Watts","Claire Connell","Kara Kwasneiwski" ] },
  { date: "2026-06-29", assignment: "Henri's Starlite Scoops", from: "7:30 AM", to: "11:00 AM", names: ["Alikah Henson"] },
  { date: "2026-06-29", assignment: "Train Conductor", from: "7:30 AM", to: "11:00 AM", names: ["Stacey Holland"] },
  { date: "2026-06-29", assignment: "Train Driver", from: "7:30 AM", to: "11:00 AM", names: ["Jay Holland"] },
  { date: "2026-06-29", assignment: "Amberville Attendant", from: "7:45 AM", to: "11:15 AM", names: ["William Baucum","John William Connell"] },
  { date: "2026-06-29", assignment: "Castle Attendant", from: "8:00 AM", to: "11:15 AM", names: ["Chloe Kwasneiwski","Sophie Holland","Paxton Lambert"] },
  { date: "2026-06-29", assignment: "Rockin' Spa Transformation Attendant", from: "4:30 PM", to: "9:15 PM", names: ["Keri Southern","Stacey Holland","Michelle Judd","Kara Kwasneiwski"] },
  { date: "2026-06-29", assignment: "Cafe Clayton Delivery", from: "5:30 PM", to: "9:30 PM", names: ["Allie Shebs","Isaac Steed","Tracey Mullinax","Alikah Henson"] },
  { date: "2026-06-29", assignment: "Castle Attendant", from: "5:30 PM", to: "9:15 PM", names: ["Cole Reese","Cooper Southern"] },
  { date: "2026-06-29", assignment: "Attractions Operator", from: "5:45 PM", to: "9:15 PM", names: ["Abby Hammett","Malvin Sanders"] },
  { date: "2026-06-29", assignment: "Carousel Gate Keeper", from: "6:00 PM", to: "9:15 PM", names: ["Bentley Watts"] },
  { date: "2026-06-29", assignment: "Carousel Operator", from: "6:00 PM", to: "9:15 PM", names: ["Lisa Connell"] },
  { date: "2026-06-29", assignment: "Noah's Nook Attendant", from: "6:00 PM", to: "9:00 PM", names: ["Rachel Steed","John William Connell"] },
  { date: "2026-06-29", assignment: "Village Shuttle Driver", from: "6:00 PM", to: "9:00 PM", names: ["Jay Holland"] },
  { date: "2026-06-29", assignment: "Halloween Extravaganza", from: "6:30 PM", to: "9:00 PM", names: ["Kailyn Steed","Baker Williams","Hayden Gurganus","Peyton Judd","Chloe Kwasneiwski","Claire Connell","Sophie Holland"] },
  { date: "2026-06-29", assignment: "Henri's Starlite Scoops", from: "6:30 PM", to: "10:00 PM", names: ["William Baucum"] },
  { date: "2026-06-29", assignment: "Digital Photography Assistant", from: "6:45 PM", to: "8:45 PM", names: ["Paxton Lambert"] },

  // ── 7/1 ───────────────────────────────────────────────────────────────
  { date: "2026-07-01", assignment: "Breakfast at Zach's Timeout", from: "7:30 AM", to: "10:30 AM", names: ["Nathan Whitaker","Michelle Whitaker"] },
  { date: "2026-07-01", assignment: "Cafe Clayton Breakfast", from: "7:30 AM", to: "10:30 AM", names: [
    "Jay Holland","Chloe Kwasneiwski","Abby Hammett","Alikah Henson","Lisa Connell","Allie Shebs",
    "John William Connell","Cole Reese","Rachel Steed","Paxton Lambert","Kailyn Steed","Bentley Watts",
    "Stacey Holland","Sophie Holland" ] },
  { date: "2026-07-01", assignment: "Train Conductor", from: "7:30 AM", to: "11:00 AM", names: ["William Baucum"] },
  { date: "2026-07-01", assignment: "Train Driver", from: "7:30 AM", to: "11:00 AM", names: ["Malvin Sanders"] },
  { date: "2026-07-01", assignment: "Amberville Attendant", from: "7:45 AM", to: "11:15 AM", names: ["Isaac Steed","Claire Connell"] },
  { date: "2026-07-01", assignment: "Castle Attendant", from: "8:00 AM", to: "11:15 AM", names: ["Baker Williams","Hayden Gurganus","Peyton Judd"] },
  { date: "2026-07-01", assignment: "Carousel Gate Keeper", from: "8:30 AM", to: "12:00 PM", names: ["Kara Kwasneiwski"] },
  { date: "2026-07-01", assignment: "Carousel Operator", from: "8:30 AM", to: "12:00 PM", names: ["Tracey Mullinax"] },
  { date: "2026-07-01", assignment: "Cafe Clayton Delivery", from: "5:30 PM", to: "9:30 PM", names: ["Baker Williams","Lisa Connell","Rachel Steed","Isaac Steed","Chloe Kwasneiwski"] },
  { date: "2026-07-01", assignment: "Cafe Clayton Dinner", from: "5:30 PM", to: "8:30 PM", names: ["Michelle Whitaker","Nathan Whitaker","Kara Kwasneiwski","Paxton Lambert","Hayden Gurganus"] },
  { date: "2026-07-01", assignment: "Cafe Clayton Greeter", from: "5:30 PM", to: "8:30 PM", names: ["Tracey Mullinax"] },
  { date: "2026-07-01", assignment: "Castle Attendant", from: "5:30 PM", to: "9:15 PM", names: ["Kailyn Steed","Allie Shebs"] },
  { date: "2026-07-01", assignment: "Attractions Operator", from: "5:45 PM", to: "9:15 PM", names: ["Abby Hammett","Stacey Holland"] },
  { date: "2026-07-01", assignment: "Noah's Nook Attendant", from: "6:00 PM", to: "9:00 PM", names: ["Claire Connell","Peyton Judd"] },
  { date: "2026-07-01", assignment: "Village Shuttle Driver", from: "6:00 PM", to: "9:00 PM", names: ["Malvin Sanders"] },
  { date: "2026-07-01", assignment: "Henri's Starlite Scoops", from: "6:30 PM", to: "10:00 PM", names: ["Sophie Holland","Jay Holland"] },
  { date: "2026-07-01", assignment: "Mayor Clayton's Surprise Birthday Bash", from: "6:30 PM", to: "8:45 PM", names: ["John William Connell","Bentley Watts","Alikah Henson","William Baucum","Cole Reese"] },

  // ── 7/2 ───────────────────────────────────────────────────────────────
  { date: "2026-07-02", assignment: "Cafe Clayton Breakfast", from: "7:30 AM", to: "10:30 AM", names: [
    "Abby Hammett","Malvin Sanders","William Baucum","Lisa Connell","Allie Shebs","Hayden Gurganus",
    "John William Connell","Cole Reese","Rachel Steed","Isaac Steed","Kailyn Steed","Paxton Lambert",
    "Baker Williams","Chloe Kwasneiwski","Michelle Whitaker","Sophie Holland","Stacey Holland","Claire Connell",
    "Peyton Judd","Jay Holland","Tracey Mullinax","Kara Kwasneiwski" ] },
  { date: "2026-07-02", assignment: "Cafe Clayton Greeter", from: "7:30 AM", to: "10:30 AM", names: ["Nathan Whitaker"] },
  { date: "2026-07-02", assignment: "Castle Attendant", from: "8:00 AM", to: "11:15 AM", names: ["Bentley Watts","Alikah Henson"] },
  { date: "2026-07-02", assignment: "Rockin' Spa Transformation Attendant", from: "4:30 PM", to: "9:15 PM", names: ["Chloe Kwasneiwski","Sophie Holland","Peyton Judd","Bentley Watts"] },
  { date: "2026-07-02", assignment: "Cafe Clayton Delivery", from: "5:30 PM", to: "9:30 PM", names: ["Stacey Holland","Jay Holland","Abby Hammett","Malvin Sanders"] },
  { date: "2026-07-02", assignment: "Cafe Clayton Dinner", from: "5:30 PM", to: "8:30 PM", names: ["Nathan Whitaker","Michelle Whitaker","Rachel Steed","Alikah Henson"] },
  { date: "2026-07-02", assignment: "Castle Attendant", from: "5:30 PM", to: "9:15 PM", names: ["Lisa Connell","John William Connell"] },
  { date: "2026-07-02", assignment: "Noah's Nook Attendant", from: "6:00 PM", to: "9:00 PM", names: ["Kara Kwasneiwski","Tracey Mullinax"] },
  { date: "2026-07-02", assignment: "Village Shuttle Driver", from: "6:00 PM", to: "9:00 PM", names: ["William Baucum"] },
  { date: "2026-07-02", assignment: "Winter Wonderland", from: "6:00 PM", to: "9:30 PM", names: ["Allie Shebs","Hayden Gurganus","Paxton Lambert","Baker Williams","Isaac Steed","Cole Reese","Kailyn Steed","Claire Connell"] },
];

function parseTimeToMinutes(t) {
  const m = String(t).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ap = m[3].toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

async function ensureSchema(query) {
  await query(`
    CREATE TABLE IF NOT EXISTS gktw_shifts (
      id SERIAL PRIMARY KEY,
      volunteer_name TEXT NOT NULL,
      shift_date DATE NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      start_minutes INT NOT NULL,
      end_minutes INT NOT NULL,
      assignment TEXT NOT NULL,
      age_requirement TEXT,
      where_to_go TEXT
    )
  `);
}

async function seedIfEmpty(query) {
  const { rows } = await query("SELECT COUNT(*)::int AS n FROM gktw_shifts");
  if (rows[0].n > 0) return;

  const flatRows = [];
  for (const s of SHIFTS) {
    const info = ASSIGNMENT_INFO[s.assignment] || { age: null, where: null };
    const startMin = parseTimeToMinutes(s.from);
    const endMin = parseTimeToMinutes(s.to);
    for (const name of s.names) {
      flatRows.push([name, s.date, s.from, s.to, startMin, endMin, s.assignment, info.age, info.where]);
    }
  }

  const values = [];
  const params = [];
  let i = 1;
  for (const r of flatRows) {
    values.push(`($${i++},$${i++},$${i++},$${i++},$${i++},$${i++},$${i++},$${i++},$${i++})`);
    params.push(...r);
  }
  await query(
    `INSERT INTO gktw_shifts
       (volunteer_name, shift_date, start_time, end_time, start_minutes, end_minutes, assignment, age_requirement, where_to_go)
     VALUES ${values.join(",")}`,
    params
  );
  console.log(`[gktw] seeded ${flatRows.length} shift rows`);
}

// ── Van planning ──────────────────────────────────────────────────────────────
// Computes 4 daily plans (morning out/back, evening out/back) from the same
// shift data — no separate input. Everyone returns to base after their
// morning shift(s) for lunch and departs again for the evening shift, so
// morning/evening are independent for every person, even those working both
// halves that day. Within each direction, shift-times within `tolerance_minutes`
// of each other merge into one "wave" (one set of van trips) to minimize
// trips; each wave's people are packed by assignment-group into vans of
// `van_capacity`, largest group first. A wave needing more than 2 vans means
// one of the two real vans is making a second trip — labeled Van 3, etc.
const ADMIN_PIN = "4277";
const NOON_MIN = 12 * 60;
const DEFAULT_TOLERANCE = 30;
const DEFAULT_CAPACITY = 15;
const LEAD_MINUTES = 30; // vans leave this many minutes before a shift start

// A van only moves when one of these designated drivers drives it, and the
// drivers are themselves volunteers with their own shifts — so a van can't run
// a trip while every driver is on shift. This gates which trips are even
// possible: departures can't happen after the drivers leave for their own
// shift (later groups fold into the drivers' trip), and pickups can't happen
// before a driver's shift ends (earlier finishers wait for a free driver).
// With two drivers there are two vans, so at most two simultaneous trips.
// NOTE: this list is duplicated in frontend/src/gktw/GktwTrip.jsx (VAN_DRIVERS)
// to keep the "Everyone Today" leaving times in sync — change both.
const VAN_DRIVERS = ["Malvin Sanders", "Jay Holland"];

async function ensureVanSchema(query) {
  await query(`
    CREATE TABLE IF NOT EXISTS gktw_van_settings (
      id INT PRIMARY KEY DEFAULT 1,
      tolerance_minutes INT NOT NULL DEFAULT ${DEFAULT_TOLERANCE},
      van_capacity INT NOT NULL DEFAULT ${DEFAULT_CAPACITY}
    )
  `);
  await query(
    `INSERT INTO gktw_van_settings (id, tolerance_minutes, van_capacity)
     VALUES (1, ${DEFAULT_TOLERANCE}, ${DEFAULT_CAPACITY}) ON CONFLICT (id) DO NOTHING`
  );
  await query(`
    CREATE TABLE IF NOT EXISTS gktw_van_overrides (
      id SERIAL PRIMARY KEY,
      shift_date DATE NOT NULL,
      period TEXT NOT NULL,
      direction TEXT NOT NULL,
      assignment TEXT NOT NULL,
      van_number INT NOT NULL,
      UNIQUE(shift_date, period, direction, assignment)
    )
  `);
  // Admin override of a wave's displayed leave/pickup time when the computed
  // one is wrong. Keyed by the wave's anchor time (stable while the shift data
  // and tolerance are unchanged); label_minutes is the corrected clock time.
  await query(`
    CREATE TABLE IF NOT EXISTS gktw_van_time_overrides (
      id SERIAL PRIMARY KEY,
      shift_date DATE NOT NULL,
      period TEXT NOT NULL,
      direction TEXT NOT NULL,
      anchor_minutes INT NOT NULL,
      label_minutes INT NOT NULL,
      UNIQUE(shift_date, period, direction, anchor_minutes)
    )
  `);
}

async function getVanSettings(query) {
  const { rows } = await query("SELECT tolerance_minutes, van_capacity FROM gktw_van_settings WHERE id=1");
  return rows[0] || { tolerance_minutes: DEFAULT_TOLERANCE, van_capacity: DEFAULT_CAPACITY };
}

function fmtClock(min) {
  if (min < 0) min += 24 * 60;
  let h = Math.floor(min / 60), m = min % 60;
  const ap = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12; else if (h > 12) h -= 12;
  return `${h}:${String(m).padStart(2, "0")} ${ap}`;
}

// Merge entries within `tolerance` minutes of a wave's earliest time.
function bucketWaves(entries, tolerance) {
  const sorted = [...entries].sort((a, b) => a.time - b.time);
  const waves = [];
  for (const e of sorted) {
    let wave = waves[waves.length - 1];
    if (!wave || e.time - wave.anchorTime > tolerance) {
      wave = { anchorTime: e.time, maxTime: e.time, entries: [] };
      waves.push(wave);
    }
    wave.entries.push(e);
    wave.maxTime = Math.max(wave.maxTime, e.time);
  }
  return waves;
}

// Pack a wave's people into numbered vans by assignment-group (largest
// group first), each group going whole into whichever van has the most room
// — only splitting a group if it alone exceeds one van's capacity.
// `startNumber` lets later waves in a section keep counting up (Van 1, 2, 3…)
// instead of restarting at 1. Each group also carries the shift time it's
// keyed on (earliest start for departures, latest end for pickups) so the UI
// can show "starts/ends" per assignment.
function packVans(entries, capacity, startNumber = 1, direction = "out") {
  const byAssignment = new Map();
  for (const e of entries) {
    if (!byAssignment.has(e.assignment)) byAssignment.set(e.assignment, { names: [], times: [] });
    const g = byAssignment.get(e.assignment);
    g.names.push(e.name);
    g.times.push(e.time);
  }
  const groups = [...byAssignment.entries()]
    .map(([assignment, g]) => ({
      assignment,
      names: g.names.sort(),
      time: direction === "out" ? Math.min(...g.times) : Math.max(...g.times),
    }))
    .sort((a, b) => b.names.length - a.names.length);

  const vans = [];
  const newVan = () => { const v = { number: startNumber + vans.length, load: 0, items: [] }; vans.push(v); return v; };

  for (const g of groups) {
    if (g.names.length > capacity) {
      let rest = g.names;
      while (rest.length) {
        const v = newVan();
        const take = rest.slice(0, capacity);
        rest = rest.slice(capacity);
        v.items.push({ assignment: g.assignment, names: take, time: g.time });
        v.load += take.length;
      }
      continue;
    }
    let best = null;
    for (const v of vans) {
      if (capacity - v.load >= g.names.length && (!best || (capacity - v.load) > (capacity - best.load))) best = v;
    }
    if (!best) best = newVan();
    best.items.push({ assignment: g.assignment, names: g.names, time: g.time });
    best.load += g.names.length;
  }
  return vans;
}

// Re-home any assignment-group with a manual override into its requested van.
// A group joins a target van ONLY if that van still has people — that's the
// "move into an existing van (any block), overbooking OK" case. If no populated
// van carries that number (it's free, e.g. after consolidating a block down to
// one van), the group just takes that number in its OWN block rather than
// jumping to wherever the number was originally minted. Empty vans/waves drop.
function applyOverridesToSection(waves, overrideMap) {
  if (!overrideMap || !overrideMap.size) return waves;
  // Pull every overridden group out of wherever it currently sits, remembering
  // the wave (block) it came from.
  const pulled = [];
  for (const w of waves) {
    for (const v of w.vans) {
      v.items = v.items.filter(it => {
        if (overrideMap.has(it.assignment)) { pulled.push({ it, homeWave: w }); return false; }
        return true;
      });
    }
  }
  // Only vans that STILL have riders are valid join targets (a group merges
  // into their block). A number with no riders is just a free label.
  const populatedByNumber = new Map();
  for (const w of waves) for (const v of w.vans) if (v.items.length) populatedByNumber.set(v.number, v);
  for (const { it, homeWave } of pulled) {
    const target = overrideMap.get(it.assignment);
    let v = populatedByNumber.get(target);
    if (!v) {
      // Free number → keep the group in its own block under that number,
      // reusing an empty slot there or creating one.
      v = homeWave.vans.find(x => x.number === target);
      if (!v) { v = { number: target, load: 0, items: [] }; homeWave.vans.push(v); }
      populatedByNumber.set(target, v);
    }
    v.items.push(it);
  }
  // Recompute loads, drop empty vans, then drop any wave left with no vans.
  for (const w of waves) {
    for (const v of w.vans) v.load = v.items.reduce((s, it) => s + it.names.length, 0);
    w.vans = w.vans.filter(v => v.items.length > 0).sort((a, b) => a.number - b.number);
    w.totalPeople = w.vans.reduce((s, v) => s + v.load, 0);
  }
  return waves.filter(w => w.vans.length > 0);
}

// Collapse waves that no driver can serve into the nearest one a driver can.
// `driverStarts` / `driverEnds` hold one value per driver for this period:
// a driver's earliest shift start / latest shift end, or ±Infinity when they
// have no shift that period (fully free to drive).
//   out  — a driver can drive a wave if they aren't due before it, i.e. their
//          shift start ≥ the wave's earliest start. Waves past the latest
//          driver's start can't run, so they fold back into the drivers' trip.
//   back — a driver can drive a wave if their shift has ended by pickup time.
//          Waves before the earliest driver is free fold forward to wait.
// Each kept wave is tagged with `driversFree` (the drivers who can drive it),
// which also caps how many vans can leave at once.
function mergeByDrivers(waves, direction, driverStarts, driverEnds) {
  const recompute = (w) => {
    w.anchorTime = Math.min(...w.entries.map(e => e.time));
    w.maxTime = Math.max(...w.entries.map(e => e.time));
  };
  let kept;
  if (direction === "out") {
    const latestStart = Math.max(...driverStarts); // Infinity if any driver is free all period
    let targetIdx = -1;
    for (let i = 0; i < waves.length; i++) if (waves[i].anchorTime <= latestStart) targetIdx = i;
    if (targetIdx < 0) targetIdx = 0; // nobody can serve any wave — fall back to the earliest
    const target = waves[targetIdx];
    for (let i = targetIdx + 1; i < waves.length; i++) target.entries.push(...waves[i].entries);
    kept = waves.slice(0, targetIdx + 1);
  } else {
    const earliestEnd = Math.min(...driverEnds); // -Infinity if any driver is free all period
    let targetIdx = -1;
    for (let i = 0; i < waves.length; i++) if (waves[i].maxTime >= earliestEnd) { targetIdx = i; break; }
    if (targetIdx < 0) targetIdx = waves.length - 1; // nobody free in time — fall back to the latest
    const target = waves[targetIdx];
    for (let i = 0; i < targetIdx; i++) target.entries.push(...waves[i].entries);
    kept = waves.slice(targetIdx);
  }
  for (const w of kept) {
    recompute(w);
    const free = [];
    for (let d = 0; d < VAN_DRIVERS.length; d++) {
      if (direction === "out" ? driverStarts[d] >= w.anchorTime : driverEnds[d] <= w.maxTime) free.push(VAN_DRIVERS[d]);
    }
    w.driversFree = free;
  }
  return kept;
}

async function computeVanPlan(query, date) {
  const settings = await getVanSettings(query);
  const tol = settings.tolerance_minutes;
  const cap = settings.van_capacity;

  const { rows } = await query(
    `SELECT volunteer_name, start_minutes, end_minutes, assignment
     FROM gktw_shifts WHERE shift_date = $1 ORDER BY start_minutes`,
    [date]
  );

  const byPerson = new Map();
  for (const r of rows) {
    if (!byPerson.has(r.volunteer_name)) byPerson.set(r.volunteer_name, []);
    byPerson.get(r.volunteer_name).push(r);
  }

  // Michelle & Nathan Whitaker get to the park on their own each morning and
  // leave on their own each night — skip them on the very first leg of the
  // day (morning departure) and the very last (evening return), but they
  // still ride the van for the midday round trip (morning return / evening
  // departure).
  const NO_MORNING_OUT_OR_EVENING_BACK = new Set(["Michelle Whitaker", "Nathan Whitaker"]);

  // Everyone returns to base after their morning shift(s) for lunch and
  // departs again for the evening shift — even people working both halves
  // that day. So morning/evening are independent for every person: anyone
  // with a morning shift gets a morning departure + return; anyone with an
  // evening shift gets an evening departure + return.
  const morningOutEntries = [], morningBackEntries = [], eveningOutEntries = [], eveningBackEntries = [];
  for (const [name, list] of byPerson) {
    const morning = list.filter(s => s.start_minutes < NOON_MIN).sort((a, b) => a.start_minutes - b.start_minutes);
    const evening = list.filter(s => s.start_minutes >= NOON_MIN).sort((a, b) => a.start_minutes - b.start_minutes);
    if (morning.length) {
      if (!NO_MORNING_OUT_OR_EVENING_BACK.has(name)) {
        morningOutEntries.push({ name, time: morning[0].start_minutes, assignment: morning[0].assignment });
      }
      const last = morning[morning.length - 1];
      morningBackEntries.push({ name, time: last.end_minutes, assignment: last.assignment });
    }
    if (evening.length) {
      eveningOutEntries.push({ name, time: evening[0].start_minutes, assignment: evening[0].assignment });
      const last = evening[evening.length - 1];
      if (!NO_MORNING_OUT_OR_EVENING_BACK.has(name)) {
        eveningBackEntries.push({ name, time: last.end_minutes, assignment: last.assignment });
      }
    }
  }

  // Each driver's own shift window per period (start to drive out before, free
  // to drive back after). ±Infinity means no shift that period → free to drive.
  const driverStarts = { morning: [], evening: [] };
  const driverEnds = { morning: [], evening: [] };
  for (const name of VAN_DRIVERS) {
    const list = byPerson.get(name) || [];
    for (const period of ["morning", "evening"]) {
      const ps = list.filter(s => period === "morning" ? s.start_minutes < NOON_MIN : s.start_minutes >= NOON_MIN);
      driverStarts[period].push(ps.length ? Math.min(...ps.map(s => s.start_minutes)) : Infinity);
      driverEnds[period].push(ps.length ? Math.max(...ps.map(s => s.end_minutes)) : -Infinity);
    }
  }

  // For departures the van leaves LEAD_MINUTES before the earliest shift start
  // in the wave; for pickups it comes at the LATEST shift end so nobody is
  // collected before their shift is over. Waves no driver can serve are first
  // folded into the nearest serviceable trip (see mergeByDrivers). Van numbers
  // keep counting up across a section's waves (Van 1, 2, 3…) rather than
  // restarting each wave, so a later trip reads as Van 3 instead of a second
  // "Van 1".
  const buildSection = (entries, direction, period) => {
    const waves = mergeByDrivers(bucketWaves(entries, tol), direction, driverStarts[period], driverEnds[period]);
    let vanStart = 1;
    return waves.map(w => {
      const vans = packVans(w.entries, cap, vanStart, direction);
      vanStart += vans.length;
      const timeMinutes = direction === "out" ? w.anchorTime - LEAD_MINUTES : w.maxTime;
      return {
        anchorTime: w.anchorTime,
        timeMinutes,
        label: fmtClock(timeMinutes),
        rangeLabel: w.maxTime > w.anchorTime ? `${fmtClock(w.anchorTime)}–${fmtClock(w.maxTime)}` : null,
        totalPeople: w.entries.length,
        driversFree: w.driversFree,
        vans,
      };
    });
  };

  const sections = {
    morningOut: buildSection(morningOutEntries, "out", "morning"),
    morningBack: buildSection(morningBackEntries, "back", "morning"),
    eveningOut: buildSection(eveningOutEntries, "out", "evening"),
    eveningBack: buildSection(eveningBackEntries, "back", "evening"),
  };

  const { rows: overrideRows } = await query(
    "SELECT period, direction, assignment, van_number FROM gktw_van_overrides WHERE shift_date = $1",
    [date]
  );
  const overridesByKey = {};
  for (const o of overrideRows) {
    const key = `${o.period}_${o.direction}`;
    if (!overridesByKey[key]) overridesByKey[key] = new Map();
    overridesByKey[key].set(o.assignment, o.van_number);
  }
  const sectionKeyMeta = {
    morningOut: "morning_out", morningBack: "morning_back",
    eveningOut: "evening_out", eveningBack: "evening_back",
  };
  for (const secKey of Object.keys(sections)) {
    const om = overridesByKey[sectionKeyMeta[secKey]];
    sections[secKey] = applyOverridesToSection(sections[secKey], om);
  }

  // Admin time overrides — replace a wave's displayed leave/pickup time when
  // the auto-computed one is wrong (e.g. a shift's real end differs from the
  // data). Keyed by the wave's anchor time within its section.
  const { rows: timeRows } = await query(
    "SELECT period, direction, anchor_minutes, label_minutes FROM gktw_van_time_overrides WHERE shift_date = $1",
    [date]
  );
  const timeByKey = {};
  for (const t of timeRows) timeByKey[`${t.period}_${t.direction}_${t.anchor_minutes}`] = t.label_minutes;
  const secMeta = {
    morningOut: { period: "morning", direction: "out" }, morningBack: { period: "morning", direction: "back" },
    eveningOut: { period: "evening", direction: "out" }, eveningBack: { period: "evening", direction: "back" },
  };
  for (const [secKey, waveList] of Object.entries(sections)) {
    const { period, direction } = secMeta[secKey];
    for (const w of waveList) {
      const lm = timeByKey[`${period}_${direction}_${w.anchorTime}`];
      if (lm != null) { w.timeMinutes = lm; w.label = fmtClock(lm); w.rangeLabel = null; w.timeEdited = true; }
    }
  }

  return { date, settings, sections };
}

module.exports = function registerGktw(app, query) {
  // Routes are registered immediately and are safe to hit right away — the
  // table just returns 0 rows until the schema/seed IIFE below finishes
  // (a fraction of a second after boot).
  app.get("/api/gktw/volunteers", async (req, res) => {
    try {
      const { rows } = await query("SELECT DISTINCT volunteer_name FROM gktw_shifts ORDER BY volunteer_name");
      res.json(rows.map(r => ({ name: r.volunteer_name, preferred: PREFERRED_NAMES[r.volunteer_name] || null, pin: PINS[r.volunteer_name] || null })));
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.get("/api/gktw/shifts", async (req, res) => {
    try {
      const { rows } = await query(
        `SELECT volunteer_name, to_char(shift_date,'YYYY-MM-DD') AS shift_date, start_time, end_time,
                start_minutes, end_minutes, assignment, age_requirement, where_to_go
         FROM gktw_shifts ORDER BY shift_date, start_minutes, volunteer_name`
      );
      res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.get("/api/gktw/meta", async (req, res) => {
    try {
      const { rows } = await query(
        "SELECT DISTINCT to_char(shift_date,'YYYY-MM-DD') AS d FROM gktw_shifts ORDER BY d"
      );
      const dates = rows.map(r => r.d);
      res.json({ dates, tripStart: dates[0] || null, tripEnd: dates[dates.length - 1] || null });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // ── Van planning — reads are open to everyone; writes require the admin PIN ──
  app.get("/api/gktw/van-plan", async (req, res) => {
    try {
      const date = req.query.date;
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: "date=YYYY-MM-DD required" });
      res.json(await computeVanPlan(query, date));
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.get("/api/gktw/van-settings", async (req, res) => {
    try { res.json(await getVanSettings(query)); }
    catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.post("/api/gktw/admin-check", (req, res) => {
    res.json({ ok: req.body?.pin === ADMIN_PIN });
  });

  app.post("/api/gktw/van-settings", async (req, res) => {
    try {
      if (req.body?.pin !== ADMIN_PIN) return res.status(403).json({ error: "Invalid PIN" });
      const tol = parseInt(req.body?.tolerance_minutes);
      const cap = parseInt(req.body?.van_capacity);
      if (!(tol > 0) || !(cap > 0)) return res.status(400).json({ error: "tolerance_minutes and van_capacity must be positive numbers" });
      await query("UPDATE gktw_van_settings SET tolerance_minutes=$1, van_capacity=$2 WHERE id=1", [tol, cap]);
      res.json({ tolerance_minutes: tol, van_capacity: cap });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.post("/api/gktw/van-override", async (req, res) => {
    try {
      if (req.body?.pin !== ADMIN_PIN) return res.status(403).json({ error: "Invalid PIN" });
      const { shift_date, period, direction, assignment, van_number } = req.body || {};
      if (!shift_date || !period || !direction || !assignment) {
        return res.status(400).json({ error: "shift_date, period, direction, assignment required" });
      }
      if (van_number == null) {
        await query(
          "DELETE FROM gktw_van_overrides WHERE shift_date=$1 AND period=$2 AND direction=$3 AND assignment=$4",
          [shift_date, period, direction, assignment]
        );
      } else {
        await query(
          `INSERT INTO gktw_van_overrides (shift_date, period, direction, assignment, van_number)
           VALUES ($1,$2,$3,$4,$5)
           ON CONFLICT (shift_date, period, direction, assignment) DO UPDATE SET van_number=EXCLUDED.van_number`,
          [shift_date, period, direction, assignment, parseInt(van_number)]
        );
      }
      res.json(await computeVanPlan(query, shift_date));
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Override (or clear, when label_minutes is null) a wave's displayed
  // leave/pickup time. anchor_minutes identifies the wave within its section.
  app.post("/api/gktw/van-time", async (req, res) => {
    try {
      if (req.body?.pin !== ADMIN_PIN) return res.status(403).json({ error: "Invalid PIN" });
      const { shift_date, period, direction } = req.body || {};
      const anchor = parseInt(req.body?.anchor_minutes);
      if (!shift_date || !period || !direction || !Number.isInteger(anchor)) {
        return res.status(400).json({ error: "shift_date, period, direction, anchor_minutes required" });
      }
      if (req.body?.label_minutes == null) {
        await query(
          "DELETE FROM gktw_van_time_overrides WHERE shift_date=$1 AND period=$2 AND direction=$3 AND anchor_minutes=$4",
          [shift_date, period, direction, anchor]
        );
      } else {
        const label = parseInt(req.body.label_minutes);
        if (!Number.isInteger(label) || label < 0 || label >= 24 * 60) return res.status(400).json({ error: "label_minutes must be 0–1439" });
        await query(
          `INSERT INTO gktw_van_time_overrides (shift_date, period, direction, anchor_minutes, label_minutes)
           VALUES ($1,$2,$3,$4,$5)
           ON CONFLICT (shift_date, period, direction, anchor_minutes) DO UPDATE SET label_minutes=EXCLUDED.label_minutes`,
          [shift_date, period, direction, anchor, label]
        );
      }
      res.json(await computeVanPlan(query, shift_date));
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  (async () => {
    try {
      await ensureSchema(query);
      await seedIfEmpty(query);
      await ensureVanSchema(query);
    } catch (e) {
      console.error("[gktw] setup error:", e.message);
    }
  })();
};
