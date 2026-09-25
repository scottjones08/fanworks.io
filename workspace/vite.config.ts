import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "workspace",
  plugins: [react()],
  server: { port: 5173, proxy: { "/api": "http://localhost:4174", "/health": "http://localhost:4174" } },
  build: { outDir: "dist", emptyOutDir: true },
});
