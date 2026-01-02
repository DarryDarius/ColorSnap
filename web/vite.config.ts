import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Make built assets work on GitHub Pages / any subpath (relative URLs).
  base: "./",
  plugins: [react()],
  server: {
    /**
     * Local dev convenience:
     * - Run the API server on http://localhost:3000
     * - Run Vite on http://localhost:5173
     * - Any /api/* calls from the React app will be proxied to the API server.
     */
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/healthz": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
