import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contactStatus, respondContact } from "./contact.js";
import { respondRealtimeSession } from "./realtime.js";
import { applySecurityHeaders } from "./securityHeaders.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

applySecurityHeaders(app, { production: process.env.NODE_ENV === "production" });

app.use(express.json({ limit: "64kb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/contact", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.json(contactStatus());
});

app.post("/api/contact", (req, res) => {
  void respondContact(req, res, req.body || {});
});

app.post("/api/realtime-session", async (req, res) => {
  await respondRealtimeSession(req, res);
});

const distDir = path.join(__dirname, "..", "dist");
const indexFile = path.join(distDir, "index.html");

// Which build is actually serving. Railway injects the git metadata; hit
// /version to confirm a deploy landed instead of guessing from the page.
const buildInfo = {
  commit: process.env.RAILWAY_GIT_COMMIT_SHA || "unknown",
  branch: process.env.RAILWAY_GIT_BRANCH || "unknown",
  deploymentId: process.env.RAILWAY_DEPLOYMENT_ID || "unknown",
  startedAt: new Date().toISOString(),
};

app.get("/version", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.json(buildInfo);
});

// Vite fingerprints everything under /assets, so those are safe to cache
// forever. Everything else keeps a short TTL and revalidates.
app.use(
  "/assets",
  express.static(path.join(distDir, "assets"), { immutable: true, maxAge: "1y" }),
);

app.use(
  express.static(distDir, {
    maxAge: "1h",
    setHeaders: (res, filePath) => {
      if (filePath === indexFile) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  }),
);

// index.html must always revalidate, otherwise a browser or CDN can pin an
// old build's asset hashes and the new deploy never shows up.
app.get("*", (_req, res) => {
  res.set("Cache-Control", "no-cache");
  res.sendFile(indexFile);
});

app.listen(port, () => {
  console.log(`Fan Works listening on ${port}`);
});
