import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// A unique id per build. Baked into the bundle as __BUILD_ID__ and also written
// to version.json; the running app polls version.json and, when the ids differ,
// shows an "update available" banner. SOURCE_COMMIT is set at build time in
// Docker; falls back to a timestamp for local builds.
const BUILD_ID = process.env.SOURCE_COMMIT || String(Date.now());

// Emit version.json into the build output alongside index.html.
function emitVersion() {
  return {
    name: "emit-version-json",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "version.json",
        source: JSON.stringify({ version: BUILD_ID }),
      });
    },
  };
}

export default defineConfig({
  base: "/",
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  plugins: [react(), emitVersion()],
  build: { outDir: "dist" },
  server: {
    host: true,
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.VITE_DEV_API_TARGET || "http://localhost:3103",
        changeOrigin: true,
      },
    },
  },
});
