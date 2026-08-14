import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function contactApi(): Plugin {
  return {
    name: "fanworks-contact-api",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split("?")[0];
        if (path !== "/api/contact" || req.method !== "POST") {
          next();
          return;
        }
        import("./server/contact.js")
          .then(({ handleContactRaw }) => handleContactRaw(req, res))
          .catch(next);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), contactApi()],
  server: {
    port: 8080,
  },
});
