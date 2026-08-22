import { useState, useEffect, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// GKTW mission-trip schedule — the whole UI. Standalone app (gktw.alpinepost.app):
// no shared components, no shared API helper, no theme. Mounted by src/main.jsx
// at the site root. No auth (see backend/gktw.js); the only gate is the admin
// PIN on van-plan writes.
// ─────────────────────────────────────────────────────────────────────────────

const LS_ME = "gktw_me_names"; // JSON array of selected volunteer names
const LS_ADMIN_PIN = "gktw_admin_pin"; // remembered admin PIN, re-sent + re-validated server-side on every write
const COLORS = ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#7c3aed"];

// The designated van drivers. Departures can't run after the drivers leave for
// their own shift, so a later group has to ride out with them — this list lets
// "Everyone Today" fold those leaving-times the same way the Vans tab does.
// NOTE: duplicated from backend/gktw.js (VAN_DRIVERS) — change both together.
const VAN_DRIVERS = ["Malvin Sanders", "Jay Holland"];
const GKTW_NOON = 12 * 60;

// Volgistics VicTouch volunteer sign-in/out kiosk link. Tapping the header
// icon opens this directly (new tab) — it lands on the Volunteer Sign-in
// Station PIN pad. See SignInLink.
const VICTOUCH_URL = "https://www.volgistics.com/victouch/qr-login/98044F92A6BD09EE9400D1B840DCCED1826B8A0492AB839E7C36DF4E";

const VAN_SECTION_META = {
  morningOut:  { period: "morning", direction: "out",  title: "☀️ Morning — Departure" },
  morningBack: { period: "morning", direction: "back", title: "☀️ Morning — Return" },
  eveningOut:  { period: "evening", direction: "out",  title: "🌙 Evening — Departure" },
  eveningBack: { period: "evening", direction: "back", title: "🌙 Evening — Return" },
};

// Non-shift days bookending/within the trip — no volunteer rows exist for
// these, so they're called out with a banner instead of an empty schedule.
const SPECIAL_DAYS = {
  "2026-06-26": { kind: "bus", emoji: "🚌", chipLabel: null, accent: "#f59e0b",
    title: "On the Road", body: "No volunteer shifts today — heading to GKTW!", departure: "6:00 AM" },
  "2026-06-30": { kind: "disney", emoji: "🏰", chipLabel: "Disney", accent: "#a855f7",
    title: "Disney Day!", body: "No volunteer shifts today — enjoy the parks! 🎉" },
  "2026-07-03": { kind: "bus", emoji: "🚌", chipLabel: null, accent: "#f59e0b",
    title: "On the Road", body: "No volunteer shifts today — heading home!" },
};

function fmtDateChip(iso) {
  const d = new Date(iso + "T12:00:00");
  const wd = d.toLocaleDateString("en-US", { weekday: "short" });
  const md = `${d.getMonth() + 1}/${d.getDate()}`;
  return `${wd} ${md}`;
}
function fmtDateLong(iso) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const withPin = (name, pin) => pin ? `${name} (${pin})` : name;

// Note: the GKTW PWA identity (manifest, icon, title, "Add to Home Screen"
// install behavior) is baked into the dedicated frontend/public/gktw.html
// shell that nginx serves for this path — see that file for why a runtime
// <head> swap here was unreliable (the browser reads the manifest at initial
// HTML parse, before any JS runs).

export default function GktwTrip() {
  const [volunteers, setVolunteers] = useState([]); // [{name, preferred, pin}]
  const [shifts, setShifts] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState("mine"); // 'mine' | 'everyone'
  const [selectedNames, setSelectedNames] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_ME)) || []; } catch { return []; }
  });
  const [addPick, setAddPick] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateReady, setUpdateReady] = useState(false);
  // Everyone Today: collapse the Morning section once it's already afternoon
  // (real wall-clock time, not the selected date) so evening shifts aren't
  // buried below a morning block nobody needs anymore. Manually toggleable
  // either way; this is just the starting state.
  const [collapsedSections, setCollapsedSections] = useState(() => ({
    morning: new Date().getHours() >= 12, evening: false,
  }));
  const toggleSection = (key) => setCollapsedSections(s => ({ ...s, [key]: !s[key] }));

  // Van planning state. adminPin is the remembered PIN (or "" if locked) —
  // it's re-sent and re-validated server-side on every write, never trusted
  // client-side alone.
  const [adminPin, setAdminPin] = useState(() => { try { return localStorage.getItem(LS_ADMIN_PIN) || ""; } catch { return ""; } });
  const [adminPinInput, setAdminPinInput] = useState("");
  const [adminError, setAdminError] = useState(null);
  const [vanPlan, setVanPlan] = useState(null);
  const [vanLoading, setVanLoading] = useState(false);
  const [vanSettings, setVanSettings] = useState(null);
  const isAdmin = !!adminPin;

  const loadVanPlan = (date) => {
    if (!date) return;
    setVanLoading(true);
    fetch(`/api/gktw/van-plan?date=${date}`, { cache: "no-store" }).then(r => r.json()).then(setVanPlan).catch(() => setVanPlan(null)).finally(() => setVanLoading(false));
  };
  useEffect(() => {
    if (view === "vans" && selectedDate && !SPECIAL_DAYS[selectedDate]) loadVanPlan(selectedDate);
  }, [view, selectedDate]);
  useEffect(() => {
    fetch("/api/gktw/van-settings", { cache: "no-store" }).then(r => r.json()).then(setVanSettings).catch(() => {});
  }, []);

  // Live propagation: admin edits (van moves, time overrides, settings) are
  // saved server-side, but everyone else's open instance/PWA won't see them
  // until it refetches. Poll while the tab is visible so changes reach everyone
  // within a few seconds, and refetch immediately when the app regains focus.
  useEffect(() => {
    let stopped = false;
    // Only swap state when the payload actually changed, so a viewer mid-tap
    // (or an admin mid-edit) isn't re-rendered every tick for no reason.
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    const refresh = () => {
      if (stopped || document.visibilityState !== "visible") return;
      fetch("/api/gktw/van-settings", { cache: "no-store" }).then(r => r.json()).then(s => { if (!stopped) setVanSettings(prev => same(prev, s) ? prev : s); }).catch(() => {});
      if (view === "vans" && selectedDate && !SPECIAL_DAYS[selectedDate]) {
        fetch(`/api/gktw/van-plan?date=${selectedDate}`, { cache: "no-store" }).then(r => r.json()).then(p => { if (!stopped) setVanPlan(prev => same(prev, p) ? prev : p); }).catch(() => {});
      }
    };
    const id = setInterval(refresh, 15000);
    const onVis = () => { if (document.visibilityState === "visible") refresh(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { stopped = true; clearInterval(id); document.removeEventListener("visibilitychange", onVis); };
  }, [view, selectedDate]);

  const unlockAdmin = () => {
    setAdminError(null);
    fetch("/api/gktw/admin-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin: adminPinInput }) })
      .then(r => r.json())
      .then(d => {
        if (d.ok) { setAdminPin(adminPinInput); try { localStorage.setItem(LS_ADMIN_PIN, adminPinInput); } catch {} setAdminPinInput(""); }
        else setAdminError("Wrong PIN");
      })
      .catch(() => setAdminError("Couldn't check PIN — try again"));
  };
  const lockAdmin = () => { setAdminPin(""); try { localStorage.removeItem(LS_ADMIN_PIN); } catch {} };

  const moveGroup = (period, direction, assignment, vanNumber) => {
    fetch("/api/gktw/van-override", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: adminPin, shift_date: selectedDate, period, direction, assignment, van_number: vanNumber }),
    }).then(r => {
      if (r.status === 403) { lockAdmin(); setAdminError("PIN no longer valid — re-enter to keep editing"); return null; }
      return r.json();
    }).then(plan => { if (plan) setVanPlan(plan); }).catch(() => {});
  };

  const setVanTime = (period, direction, anchorMinutes, labelMinutes) => {
    fetch("/api/gktw/van-time", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: adminPin, shift_date: selectedDate, period, direction, anchor_minutes: anchorMinutes, label_minutes: labelMinutes }),
    }).then(r => {
      if (r.status === 403) { lockAdmin(); setAdminError("PIN no longer valid — re-enter to keep editing"); return null; }
      return r.json();
    }).then(plan => { if (plan) setVanPlan(plan); }).catch(() => {});
  };

  const saveVanSettings = (tolerance_minutes, van_capacity) => {
    fetch("/api/gktw/van-settings", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: adminPin, tolerance_minutes, van_capacity }),
    }).then(r => {
      if (r.status === 403) { lockAdmin(); setAdminError("PIN no longer valid — re-enter to keep editing"); return null; }
      return r.json();
    }).then(s => { if (s) { setVanSettings(s); loadVanPlan(selectedDate); } }).catch(() => {});
  };

  // Update detection. Each build bakes in a unique __BUILD_ID__ (vite.config.js)
  // and emits a matching /version.json. Here we periodically re-fetch that file
  // (cache-busted, bypassing any HTTP/SW cache) and compare. When a new deploy
  // changes the id, surface an "Update" banner so installed PWAs / long-lived
  // tabs don't sit on a stale build. Replaces the old asset-manifest comparison.
  useEffect(() => {
    const current = __BUILD_ID__;
    let stopped = false;
    const check = () => {
      fetch(`/version.json?_=${Date.now()}`, { cache: "no-store" })
        .then(r => (r.ok ? r.json() : null))
        .then(m => {
          if (stopped || !m) return;
          if (m.version && m.version !== current) setUpdateReady(true);
        })
        .catch(() => {});
    };
    const id = setInterval(check, 5 * 60 * 1000);
    const onVis = () => { if (document.visibilityState === "visible") check(); };
    document.addEventListener("visibilitychange", onVis);
    check();
    return () => { stopped = true; clearInterval(id); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  // Apply the update: drop any service worker + cached shells, then hard reload
  // so the next navigation pulls the fresh bundle from the network.
  const applyUpdate = async () => {
    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
      if (window.caches) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    } catch {}
    window.location.reload();
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/gktw/volunteers").then(r => r.json()),
      fetch("/api/gktw/shifts").then(r => r.json()),
      fetch("/api/gktw/meta").then(r => r.json()),
    ]).then(([vols, shiftRows, meta]) => {
      setVolunteers(vols);
      setShifts(shiftRows);
      const allDates = [...new Set([...(meta.dates || []), ...Object.keys(SPECIAL_DAYS)])].sort();
      setDates(allDates);
      const today = todayISO();
      let def = allDates[0] || null;
      if (allDates.includes(today)) def = today;
      else if (allDates.length && today > allDates[allDates.length - 1]) def = allDates[allDates.length - 1];
      setSelectedDate(def);
      setLoading(false);
    }).catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const pinOf = useMemo(() => Object.fromEntries(volunteers.map(v => [v.name, v.pin])), [volunteers]);
  const persistNames = (names) => {
    setSelectedNames(names);
    try { localStorage.setItem(LS_ME, JSON.stringify(names)); } catch {}
  };

  const dayShifts = useMemo(() => shifts.filter(s => s.shift_date === selectedDate), [shifts, selectedDate]);
  const byPerson = useMemo(() => {
    const m = {};
    for (const name of selectedNames) m[name] = dayShifts.filter(s => s.volunteer_name === name).sort((a, b) => a.start_minutes - b.start_minutes);
    return m;
  }, [dayShifts, selectedNames]);

  // Everyone, grouped into "leave together" waves — shift starts within the
  // van tolerance window merge into one departure, mirroring the Van schedule
  // exactly (same buckets, same "leave 30 min before the earliest start" time,
  // and the same driver-availability fold) so the leaving times here line up
  // with the Vans tab.
  const departureGroups = useMemo(() => {
    const tol = vanSettings?.tolerance_minutes ?? 30;
    const sorted = [...dayShifts].sort((a, b) => a.start_minutes - b.start_minutes);
    const waves = [];
    for (const s of sorted) {
      let w = waves[waves.length - 1];
      if (!w || s.start_minutes - w.anchor > tol) {
        w = { anchor: s.start_minutes, leaveMinutes: s.start_minutes - 30, byAssignment: new Map() };
        waves.push(w);
      }
      if (!w.byAssignment.has(s.assignment)) w.byAssignment.set(s.assignment, { ...s, people: [] });
      w.byAssignment.get(s.assignment).people.push(s.volunteer_name);
    }

    // Latest a driver leaves for their own shift, per period (Infinity if a
    // driver has no shift that period → free to drive late). Waves after that
    // can't be driven, so they fold back into the drivers' departure.
    const latestStart = { morning: -Infinity, evening: -Infinity };
    for (const period of ["morning", "evening"]) {
      let max = -Infinity;
      for (const name of VAN_DRIVERS) {
        const starts = dayShifts
          .filter(s => s.volunteer_name === name && (period === "morning" ? s.start_minutes < GKTW_NOON : s.start_minutes >= GKTW_NOON))
          .map(s => s.start_minutes);
        max = Math.max(max, starts.length ? Math.min(...starts) : Infinity);
      }
      latestStart[period] = max;
    }
    const foldPeriod = (periodWaves, cutoff) => {
      let targetIdx = -1;
      for (let i = 0; i < periodWaves.length; i++) if (periodWaves[i].anchor <= cutoff) targetIdx = i;
      if (targetIdx < 0) return periodWaves;
      const target = periodWaves[targetIdx];
      for (let i = targetIdx + 1; i < periodWaves.length; i++) {
        for (const [asg, g] of periodWaves[i].byAssignment) {
          if (!target.byAssignment.has(asg)) target.byAssignment.set(asg, { ...g, people: [...g.people] });
          else target.byAssignment.get(asg).people.push(...g.people);
        }
      }
      return periodWaves.slice(0, targetIdx + 1);
    };
    const morning = foldPeriod(waves.filter(w => w.anchor < GKTW_NOON), latestStart.morning);
    const evening = foldPeriod(waves.filter(w => w.anchor >= GKTW_NOON), latestStart.evening);
    return [...morning, ...evening];
  }, [dayShifts, vanSettings]);

  // Overlapping busy windows between any two selected people, for the callout.
  const overlaps = useMemo(() => {
    if (selectedNames.length < 2) return [];
    const out = [];
    for (let i = 0; i < selectedNames.length; i++) {
      for (let j = i + 1; j < selectedNames.length; j++) {
        const a = byPerson[selectedNames[i]] || [], b = byPerson[selectedNames[j]] || [];
        for (const sa of a) for (const sb of b) {
          const start = Math.max(sa.start_minutes, sb.start_minutes);
          const end = Math.min(sa.end_minutes, sb.end_minutes);
          if (end > start) out.push({ a: selectedNames[i], b: selectedNames[j], start, end, sameAssignment: sa.assignment === sb.assignment, assignment: sa.assignment === sb.assignment ? sa.assignment : null });
        }
      }
    }
    return out;
  }, [byPerson, selectedNames]);

  const fmtMin = (min) => {
    let h = Math.floor(min / 60), m = min % 60;
    const ap = h >= 12 ? "PM" : "AM";
    if (h === 0) h = 12; else if (h > 12) h -= 12;
    return `${h}:${String(m).padStart(2, "0")} ${ap}`;
  };

  const availableToAdd = volunteers.filter(v => !selectedNames.includes(v.name));

  if (loading) return <Wrap><Center>Loading schedule…</Center></Wrap>;
  if (error) return <Wrap><Center style={{ color: "#dc2626" }}>Couldn't load the schedule: {error}</Center></Wrap>;

  return (
    <Wrap>
      {updateReady && <UpdateBanner onUpdate={applyUpdate} />}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "18px 14px 60px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 2px", color: "#0f172a" }}>GKTW Trip Schedule</h1>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 18px" }}>
              {dates.length ? `${fmtDateChip(dates[0])} – ${fmtDateChip(dates[dates.length - 1])}` : ""} · Give Kids The World Village
            </p>
          </div>
          <SignInLink />
        </div>

        {/* View toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[["mine", "My Schedule"], ["everyone", "Everyone Today"], ["vans", "Vans"]].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)}
              style={{ flex: 1, padding: "11px 8px", borderRadius: 11, border: `2px solid ${view === v ? "#0d9488" : "#e2e8f0"}`, background: view === v ? "#0d9488" : "#fff", color: view === v ? "#fff" : "#334155", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Date chips */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "2px 0 16px", WebkitOverflowScrolling: "touch" }}>
          {dates.map(d => {
            const special = SPECIAL_DAYS[d];
            const active = d === selectedDate;
            const past = d < todayISO();
            const accent = special ? special.accent : "#2563eb";
            // Past days are grayed out (but still tappable) so the focus lands
            // on today and what's ahead.
            return (
              <button key={d} onClick={() => setSelectedDate(d)}
                style={{ flexShrink: 0, padding: "9px 14px", borderRadius: 20, border: `2px solid ${active ? accent : past ? "#eef2f6" : "#e2e8f0"}`, background: active ? accent : past ? "#f8fafc" : "#fff", color: active ? "#fff" : past ? "#b6c0cc" : "#334155", fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5 }}>
                {special && <span style={{ opacity: past && !active ? 0.5 : 1 }}>{special.emoji}</span>}
                {fmtDateChip(d)}
                {special?.chipLabel && <span style={{ fontSize: 11, opacity: active ? 0.9 : 0.7 }}>· {special.chipLabel}</span>}
              </button>
            );
          })}
        </div>

        {SPECIAL_DAYS[selectedDate] ? (
          <SpecialDayBanner info={SPECIAL_DAYS[selectedDate]} dateLabel={fmtDateLong(selectedDate)} />
        ) : view === "mine" ? (
          <>
            {/* Name picker */}
            <section style={cardStyle}>
              <div style={{ fontSize: 11, letterSpacing: "0.06em", color: "#64748b", fontWeight: 700, marginBottom: 8 }}>WHOSE SCHEDULE?</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: selectedNames.length ? 10 : 0 }}>
                {selectedNames.map((name, i) => (
                  <span key={name} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: COLORS[i % COLORS.length] + "18", border: `1px solid ${COLORS[i % COLORS.length]}55`, color: COLORS[i % COLORS.length], borderRadius: 20, padding: "6px 10px 6px 12px", fontSize: 14, fontWeight: 600 }}>
                    {withPin(name, pinOf[name])}
                    <button onClick={() => persistNames(selectedNames.filter(n => n !== name))}
                      style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 15, lineHeight: 1, padding: 0 }}>✕</button>
                  </span>
                ))}
              </div>
              {availableToAdd.length > 0 && (
                <div style={{ display: "flex", gap: 8 }}>
                  <select value={addPick} onChange={e => setAddPick(e.target.value)}
                    style={{ flex: 1, padding: "10px 10px", borderRadius: 9, border: "1px solid #cbd5e1", fontSize: 15, background: "#fff", color: "#0f172a" }}>
                    <option value="">{selectedNames.length ? "+ Add someone to compare…" : "Pick your name…"}</option>
                    {availableToAdd.map(v => <option key={v.name} value={v.name}>{withPin(v.name, v.pin)}{v.preferred ? ` — ${v.preferred}` : ""}</option>)}
                  </select>
                  <button disabled={!addPick} onClick={() => { if (addPick) { persistNames([...selectedNames, addPick]); setAddPick(""); } }}
                    style={{ padding: "10px 16px", borderRadius: 9, border: "none", background: addPick ? "#2563eb" : "#cbd5e1", color: "#fff", fontWeight: 700, cursor: addPick ? "pointer" : "default", fontSize: 15 }}>Add</button>
                </div>
              )}
            </section>

            {/* Overlap callout */}
            {overlaps.length > 0 && (
              <div style={{ background: "#fffbeb", border: "1px solid #f59e0b55", borderRadius: 12, padding: "12px 14px", marginBottom: 16, fontSize: 14, color: "#92400e" }}>
                <strong>⏰ Overlapping busy times:</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 20 }}>
                  {overlaps.map((o, i) => (
                    <li key={i}>{fmtMin(o.start)}–{fmtMin(o.end)}: <strong>{o.a}</strong> &amp; <strong>{o.b}</strong>{o.sameAssignment ? ` — both on ${o.assignment}` : " — different shifts"}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Per-person cards */}
            {selectedNames.length === 0 && (
              <div style={{ ...cardStyle, textAlign: "center", color: "#64748b", padding: 30 }}>Pick your name above to see your schedule.</div>
            )}
            {selectedNames.map((name, i) => (
              <PersonCard key={name} name={name} pin={pinOf[name]} color={COLORS[i % COLORS.length]} shiftsForDay={byPerson[name] || []} />
            ))}
          </>
        ) : view === "everyone" ? (
          <EveryoneView dateLabel={selectedDate ? fmtDateLong(selectedDate) : ""} groups={departureGroups} pinOf={pinOf}
            collapsedSections={collapsedSections} onToggleSection={toggleSection} />
        ) : (
          <VansView
            plan={vanPlan} loading={vanLoading} settings={vanSettings}
            isAdmin={isAdmin} adminPinInput={adminPinInput} setAdminPinInput={setAdminPinInput}
            adminError={adminError} onUnlock={unlockAdmin} onLock={lockAdmin}
            onMoveGroup={moveGroup} onSaveSettings={saveVanSettings} onSetTime={setVanTime}
          />
        )}
      </div>
    </Wrap>
  );
}

// Top-right header link that opens the Volgistics VicTouch volunteer
// sign-in/out kiosk directly in a new tab. Rendered as a small QR-style icon
// + "Sign in/out" label so volunteers know what it's for. Shown on both
// mobile and desktop.
function SignInLink() {
  return (
    <a href={VICTOUCH_URL} target="_blank" rel="noopener noreferrer"
      aria-label="Volunteer sign in / out"
      style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 11px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", textDecoration: "none", color: "#0f172a", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#0d9488" aria-hidden="true">
        <rect x="1" y="1" width="8" height="8" />
        <rect x="3" y="3" width="4" height="4" fill="#fff" />
        <rect x="15" y="1" width="8" height="8" />
        <rect x="17" y="3" width="4" height="4" fill="#fff" />
        <rect x="1" y="15" width="8" height="8" />
        <rect x="3" y="17" width="4" height="4" fill="#fff" />
        <rect x="13" y="13" width="3" height="3" />
        <rect x="19" y="13" width="3" height="3" />
        <rect x="13" y="19" width="3" height="3" />
        <rect x="17" y="17" width="3" height="3" />
        <rect x="21" y="19" width="2" height="2" />
      </svg>
      <span style={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.1, whiteSpace: "nowrap" }}>Sign in/out</span>
    </a>
  );
}

function DayDivider({ label, count, collapsed, onClick }) {
  return (
    <button onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", margin: "14px 0 8px", padding: "6px 2px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
      <span style={{ fontSize: 13, fontWeight: 800, color: "#475569", whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
      {collapsed && count != null && <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{count} hidden</span>}
      <span style={{ fontSize: 12, color: "#94a3b8", transform: collapsed ? "rotate(-90deg)" : "none", display: "inline-block", transition: "transform 0.15s" }}>▾</span>
    </button>
  );
}

function SpecialDayBanner({ info, dateLabel }) {
  return (
    <section style={{ ...cardStyle, textAlign: "center", padding: "32px 20px", borderLeft: `5px solid ${info.accent}` }}>
      <div style={{ fontSize: 44, marginBottom: 8 }}>{info.emoji}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: info.accent, marginBottom: 4 }}>{info.title}</div>
      <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 10 }}>{dateLabel}</div>
      <div style={{ fontSize: 15, color: "#475569" }}>{info.body}</div>
      {info.departure && (
        <div style={{ marginTop: 16, display: "inline-block", background: info.accent + "18", border: `1px solid ${info.accent}55`, borderRadius: 12, padding: "10px 18px" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.06em", color: info.accent, fontWeight: 700 }}>BUS DEPARTS</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{info.departure}</div>
        </div>
      )}
    </section>
  );
}

function PersonCard({ name, pin, color, shiftsForDay }) {
  return (
    <section style={{ ...cardStyle, borderLeft: `5px solid ${color}` }}>
      <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>{withPin(name, pin)}</div>
      {shiftsForDay.length === 0 ? (
        <div style={{ color: "#94a3b8", fontSize: 14, fontStyle: "italic" }}>No shift scheduled — free day!</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {shiftsForDay.map((s, i) => (
            <div key={i} style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{s.start_time} – {s.end_time}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color, margin: "2px 0 4px" }}>{s.assignment}</div>
              {s.where_to_go && <div style={{ fontSize: 13, color: "#475569" }}>📍 {s.where_to_go}</div>}
              {s.age_requirement && <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Age: {s.age_requirement}</div>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// "Everyone today" grouped by departure (shift start) time — answers
// "who needs to leave together, and when" for travel coordination, while
// still showing each group's assignment(s) and where to meet.
function EveryoneView({ dateLabel, groups, pinOf, collapsedSections, onToggleSection }) {
  if (groups.length === 0) {
    return <div style={{ ...cardStyle, textAlign: "center", color: "#64748b", padding: 30 }}>No shifts scheduled for {dateLabel}.</div>;
  }
  const NOON = 12 * 60;
  const morning = groups.filter(g => g.anchor < NOON);
  const evening = groups.filter(g => g.anchor >= NOON);
  const countPeople = (gs) => gs.reduce((s, g) => s + [...g.byAssignment.values()].reduce((s2, a) => s2 + a.people.length, 0), 0);

  const renderGroup = (g, gi) => {
    const totalPeople = [...g.byAssignment.values()].reduce((s, a) => s + a.people.length, 0);
    return (
      <section key={gi} style={cardStyle}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#0d9488" }}>🚐 Leaving at {fmtMinutes(g.leaveMinutes)}</div>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{totalPeople} {totalPeople === 1 ? "person" : "people"}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[...g.byAssignment.values()].map((a, ai) => (
            <div key={ai}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#2563eb" }}>{a.assignment}</div>
              {a.start_time && a.end_time && (
                <div style={{ fontSize: 15, fontWeight: 700, color: "#dc2626", whiteSpace: "nowrap" }}>{a.start_time} to {a.end_time}</div>
              )}
              {a.where_to_go && <div style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>📍 {a.where_to_go}{a.age_requirement ? ` · Age: ${a.age_requirement}` : ""}</div>}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {a.people.sort().map(p => (
                  <span key={p} style={{ background: "#f1f5f9", borderRadius: 16, padding: "4px 10px", fontSize: 13, color: "#334155", fontWeight: 600 }}>
                    {withPin(p, pinOf[p])}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
      <div style={{ fontSize: 13, color: "#64748b", margin: "0 0 10px", fontWeight: 600 }}>{dateLabel}</div>
      {morning.length > 0 && (
        <>
          <DayDivider label="☀️ Morning" collapsed={collapsedSections.morning} count={countPeople(morning)} onClick={() => onToggleSection("morning")} />
          {!collapsedSections.morning && morning.map(renderGroup)}
        </>
      )}
      {evening.length > 0 && (
        <>
          <DayDivider label="🌙 Evening" collapsed={collapsedSections.evening} count={countPeople(evening)} onClick={() => onToggleSection("evening")} />
          {!collapsedSections.evening && evening.map(renderGroup)}
        </>
      )}
    </>
  );
}

// Four daily van plans (morning/evening × out/back), computed server-side
// from the same shift data. Anyone unlocked with the admin PIN can move an
// assignment-group to a different van — every move is re-validated
// server-side (the PIN, not just client state, gates the write).
function VansView({ plan, loading, settings, isAdmin, adminPinInput, setAdminPinInput, adminError, onUnlock, onLock, onMoveGroup, onSaveSettings, onSetTime }) {
  const [tolInput, setTolInput] = useState("");
  const [capInput, setCapInput] = useState("");
  // Admin PIN entry stays hidden behind a faint lock icon so it isn't obvious
  // to everyone; tapping the lock reveals the PIN field. An error (e.g. wrong
  // PIN) forces it open so the message is visible.
  const [pinOpen, setPinOpen] = useState(false);
  // Each section (Morning Departure, Pickup, etc.) is collapsible. Morning
  // groups start collapsed once it's afternoon so the evening plan is on top.
  const [collapsedSecs, setCollapsedSecs] = useState(() => {
    const pm = new Date().getHours() >= 12;
    return { morningOut: pm, morningBack: pm, eveningOut: false, eveningBack: false };
  });
  const toggleSec = (k) => setCollapsedSecs(s => ({ ...s, [k]: !s[k] }));
  useEffect(() => {
    if (settings) { setTolInput(String(settings.tolerance_minutes)); setCapInput(String(settings.van_capacity)); }
  }, [settings]);

  return (
    <>
      {/* Admin unlock / lock — collapsed to a lock icon until tapped */}
      {isAdmin ? (
        <section style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>🔓 Admin mode — tap a group below to move it between vans</span>
            <button onClick={onLock} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", color: "#64748b", fontSize: 13, cursor: "pointer" }}>Lock</button>
          </div>
        </section>
      ) : (pinOpen || adminError) ? (
        <section style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>🔒 Admin PIN to edit van assignments:</span>
            <input type="password" inputMode="numeric" value={adminPinInput} onChange={e => setAdminPinInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") onUnlock(); }} autoFocus
              style={{ width: 90, padding: "6px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }} />
            <button onClick={onUnlock} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Unlock</button>
            <button onClick={() => setPinOpen(false)} style={{ padding: "6px 10px", borderRadius: 8, border: "none", background: "none", color: "#94a3b8", fontSize: 13, cursor: "pointer" }}>✕</button>
            {adminError && <span style={{ fontSize: 12, color: "#dc2626" }}>{adminError}</span>}
          </div>
        </section>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
          <button onClick={() => setPinOpen(true)} aria-label="Admin sign-in" title="Admin"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#cbd5e1", padding: 4, lineHeight: 1 }}>🔒</button>
        </div>
      )}

      {/* Settings (admin only) */}
      {isAdmin && settings && (
        <section style={cardStyle}>
          <div style={{ fontSize: 11, letterSpacing: "0.06em", color: "#64748b", fontWeight: 700, marginBottom: 8 }}>VAN SETTINGS</div>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
            <label style={{ fontSize: 13, color: "#334155" }}>
              Merge tolerance (min)<br />
              <input type="number" value={tolInput} onChange={e => setTolInput(e.target.value)} style={{ width: 70, padding: "6px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, marginTop: 4 }} />
            </label>
            <label style={{ fontSize: 13, color: "#334155" }}>
              Van capacity<br />
              <input type="number" value={capInput} onChange={e => setCapInput(e.target.value)} style={{ width: 70, padding: "6px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, marginTop: 4 }} />
            </label>
            <button onClick={() => onSaveSettings(parseInt(tolInput), parseInt(capInput))}
              style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#0d9488", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Save</button>
          </div>
        </section>
      )}

      {loading && <div style={{ ...cardStyle, textAlign: "center", color: "#64748b" }}>Loading van plan…</div>}

      {!loading && plan && Object.entries(VAN_SECTION_META).map(([secKey, meta]) => {
        const waves = plan.sections?.[secKey] || [];
        const collapsed = collapsedSecs[secKey];
        const people = waves.reduce((s, w) => s + w.totalPeople, 0);
        // Highest van number anywhere in this section — admins can move a group
        // into any existing van (any block/wave) or one new van beyond that.
        const sectionMaxVan = Math.max(0, ...waves.flatMap(w => w.vans.map(v => v.number)));
        return (
          <div key={secKey} style={{ marginBottom: 4 }}>
            <button onClick={() => toggleSec(secKey)}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", margin: "14px 0 8px", padding: "6px 2px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 12, color: "#94a3b8", transform: collapsed ? "rotate(-90deg)" : "none", display: "inline-block", transition: "transform 0.15s" }}>▾</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#475569" }}>{meta.title}</span>
              {people > 0 && <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>· {people} {people === 1 ? "person" : "people"}</span>}
            </button>
            {!collapsed && (waves.length === 0 ? (
              <div style={{ ...cardStyle, color: "#94a3b8", fontStyle: "italic", fontSize: 14 }}>Nobody in this group today.</div>
            ) : waves.map((wave, wi) => (
              <WaveCard key={wi} wave={wave} meta={meta} isAdmin={isAdmin} sectionMaxVan={sectionMaxVan}
                onMoveGroup={(assignment, vanNumber) => onMoveGroup(meta.period, meta.direction, assignment, vanNumber)}
                onSetTime={(labelMinutes) => onSetTime(meta.period, meta.direction, wave.anchorTime, labelMinutes)} />
            )))}
          </div>
        );
      })}
    </>
  );
}

function WaveCard({ wave, meta, isAdmin, onMoveGroup, onSetTime, sectionMaxVan = 0 }) {
  // Admin can move a group into ANY van across this whole section (any block),
  // or into one brand-new van beyond the highest number — overbooking allowed.
  const topVan = Math.max(sectionMaxVan, ...wave.vans.map(v => v.number));
  const moveOptions = Array.from({ length: topVan + 1 }, (_, i) => i + 1);
  const verb = meta.direction === "out" ? "Vans leave at" : "Pickup ~";
  const timeLabel = meta.direction === "out" ? "Starts" : "Ends";
  // How many vans can run this trip at once = drivers free for it (2 when both
  // are; fewer if one's still on/already off shift). A van beyond that count is
  // a driver doubling back for a second load.
  const driversFree = wave.driversFree || [];
  const seats = driversFree.length || 2;
  const secondTrip = wave.vans.length > seats;
  // Names hidden by default — each van is its own disclosure, tap to reveal
  // the assignment breakdown + names (and the admin move-control, if unlocked).
  const [expanded, setExpanded] = useState(() => new Set());
  const toggleVan = (n) => setExpanded(s => { const next = new Set(s); next.has(n) ? next.delete(n) : next.add(n); return next; });

  // Admin time-edit: correct a wrong auto-computed leave/pickup time.
  const toHHMM = (m) => `${String(Math.floor(((m % 1440) + 1440) % 1440 / 60)).padStart(2, "0")}:${String(((m % 60) + 60) % 60).padStart(2, "0")}`;
  const [editingTime, setEditingTime] = useState(false);
  const [timeInput, setTimeInput] = useState("");
  const openTimeEdit = () => { setTimeInput(toHHMM(wave.timeMinutes ?? 0)); setEditingTime(true); };
  const saveTime = () => {
    const [h, m] = timeInput.split(":").map(Number);
    if (Number.isInteger(h) && Number.isInteger(m)) onSetTime(h * 60 + m);
    setEditingTime(false);
  };

  return (
    <section style={cardStyle}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 4 }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#0d9488", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          🚐 {verb} {wave.label}{wave.rangeLabel ? ` (${wave.rangeLabel})` : ""}
          {wave.timeEdited && <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>· edited</span>}
          {isAdmin && !editingTime && (
            <button onClick={openTimeEdit} title="Edit time"
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: "0 2px", color: "#94a3b8" }}>✎</button>
          )}
        </div>
        <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{wave.totalPeople} {wave.totalPeople === 1 ? "person" : "people"}</div>
      </div>
      {isAdmin && editingTime && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: "#64748b" }}>{meta.direction === "out" ? "Leave time:" : "Pickup time:"}</span>
          <input type="time" value={timeInput} onChange={e => setTimeInput(e.target.value)}
            style={{ padding: "4px 6px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }} />
          <button onClick={saveTime} style={{ padding: "4px 12px", borderRadius: 6, border: "none", background: "#0d9488", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Save</button>
          {wave.timeEdited && <button onClick={() => { onSetTime(null); setEditingTime(false); }} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#fff", color: "#64748b", fontSize: 12, cursor: "pointer" }}>Reset</button>}
          <button onClick={() => setEditingTime(false)} style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: "none", color: "#94a3b8", fontSize: 12, cursor: "pointer" }}>Cancel</button>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {wave.vans.map((van, vi) => {
          const isOpen = expanded.has(van.number);
          const extra = vi >= seats; // beyond the free-driver count → a doubling-back trip
          return (
            <div key={van.number}>
              <button onClick={() => toggleVan(van.number)}
                style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none", border: "none", padding: "2px 0", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: 12, color: "#94a3b8", transform: isOpen ? "none" : "rotate(-90deg)", display: "inline-block", transition: "transform 0.15s" }}>▾</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: extra ? "#d97706" : "#334155" }}>
                  Van {van.number} <span style={{ color: "#94a3b8", fontWeight: 600 }}>({van.load})</span>
                </span>
              </button>
              {isOpen && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
                  {van.items.map((it, ii) => (
                    <div key={ii} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, background: "#f8fafc", borderRadius: 8, padding: "6px 10px", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
                          {it.assignment} <span style={{ color: "#94a3b8", fontWeight: 500 }}>({it.names.length})</span>
                          {it.time != null && <span style={{ color: "#0d9488", fontWeight: 600 }}> · {timeLabel} {fmtMinutes(it.time)}</span>}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>{it.names.join(", ")}</div>
                      </div>
                      {isAdmin && (
                        <select value={van.number} onChange={e => onMoveGroup(it.assignment, parseInt(e.target.value))}
                          style={{ fontSize: 12, padding: "4px 6px", borderRadius: 6, border: "1px solid #cbd5e1" }}>
                          {moveOptions.map(n => (
                            <option key={n} value={n}>Van {n}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {secondTrip && (
        <div style={{ marginTop: 10, fontSize: 11, color: "#d97706" }}>
          More vans than free drivers ({seats}) — a van has to double back for a second load.
        </div>
      )}
    </section>
  );
}

// Shown when a newer build is detected — tapping clears the SW/caches and reloads.
function UpdateBanner({ onUpdate }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap", background: "#0d9488", color: "#fff", padding: "10px 14px", fontSize: 14, fontWeight: 600, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
      <span>🔄 A new version is available</span>
      <button onClick={onUpdate}
        style={{ background: "#fff", color: "#0d9488", border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
        Update
      </button>
    </div>
  );
}

// Format an absolute minutes-since-midnight value as "h:mm AM/PM".
function fmtMinutes(min) {
  if (min < 0) min += 24 * 60;
  let h = Math.floor(min / 60), m = min % 60;
  const ap = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12; else if (h > 12) h -= 12;
  return `${h}:${String(m).padStart(2, "0")} ${ap}`;
}

const cardStyle = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "16px 16px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" };

function Wrap({ children }) {
  return <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" }}>{children}</div>;
}
function Center({ children, style }) {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontSize: 16, color: "#475569", ...style }}>{children}</div>;
}
