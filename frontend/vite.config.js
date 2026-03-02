import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // SPA mode — all unknown routes fall back to index.html for React Router
  appType: "spa",

  server: {
    port: 3000,
    proxy: {
      // ── POST only → FastAPI, GET → React Router ──

      "/patient/login": {
        target: "http://localhost:8000",
        changeOrigin: true,
        bypass(req) {
          if (req.method === "GET") return req.url;
        },
      },

      "/patient/signup": {
        target: "http://localhost:8000",
        changeOrigin: true,
        bypass(req) {
          if (req.method === "GET") return req.url;
        },
      },

      // ── All other /patient/* routes ──
      // API calls that go to FastAPI:
      //   GET  /patient/:id/dashboard   → FastAPI
      //   POST /patient/:id/query       → FastAPI
      //   POST /patient/:id/appointment → FastAPI
      //
      // Page navigations that stay in React:
      //   GET  /patient/:id/query       → React Router
      //   GET  /patient/:id/appointment → React Router
      "/patient": {
        target: "http://localhost:8000",
        changeOrigin: true,
        bypass(req) {
          const isPageNav =
            req.method === "GET" &&
            (req.url.includes("/query") ||
             req.url.includes("/appointment") ||
             !req.url.includes("/dashboard"));
          if (isPageNav) return req.url;
        },
      },
    },
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
