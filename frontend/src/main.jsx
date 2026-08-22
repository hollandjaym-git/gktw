import React from "react";
import ReactDOM from "react-dom/client";
import GktwTrip from "./gktw/GktwTrip";

// Standalone GKTW app root. No service worker: the schedule is small and the
// update banner (see GktwTrip: __BUILD_ID__ vs /version.json) already covers
// "a newer build is live" without the complexity/staleness of a SW cache. The
// old SW-unregister self-heal that lived here existed only because GKTW used to
// share an origin with Options Desk — irrelevant now that it owns its origin.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GktwTrip />
  </React.StrictMode>
);
