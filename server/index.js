import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { respondContact } from "./contact.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

const OPENAI_REALTIME_CLIENT_SECRETS_URL = "https://api.openai.com/v1/realtime/client_secrets";

app.use(express.json({ limit: "64kb" }));

function fanWorksInstructions() {
  return `You are the Fan Works Realtime host for a public landing page.

Purpose:
- Start a short, human conversation with someone considering Fan Works.
- Ask about their day, their work, what feels too complicated, and what they wish technology would stop making harder.
- Help them name a process before talking about software.
- Position Fan Works as human-centered consulting: understand the human rhythm first, then shape the technology around it.

Voice style:
- Calm, minimal, curious, and grounded.
- Sound like a thoughtful person in a sneaker shop or studio, not a sales chatbot.
- Start with one warm question, then listen.
- Keep responses under 12 seconds unless the visitor asks for depth.
- Do not over-explain AI, models, architecture, or implementation.
- Do not collect sensitive personal, financial, medical, legal, or account information.
- Do not claim you booked a meeting, saved information, or changed anything.
- If the visitor wants to continue, invite them to describe one workflow that drains energy and one human moment they want to protect.

Core idea:
Technology promised easier work, but many teams inherited more screens, more steps, and less human connection. Fan Works begins with the person and the process, then uses GPT-Realtime and modern systems to bring the human connection back into the work.`;
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/contact", (req, res) => {
  void respondContact(req, res, req.body || {});
});

app.post("/api/realtime-session", async (_req, res) => {
  const openAIKey = process.env.OPENAI_API_KEY;
  if (!openAIKey) {
    res.status(503).json({
      error: "Voice is not configured yet. Add OPENAI_API_KEY in Railway variables.",
    });
    return;
  }

  const model = process.env.OPENAI_REALTIME_MODEL || "gpt-realtime-2";
  const voice = process.env.OPENAI_REALTIME_VOICE || "marin";

  const sessionConfig = {
    session: {
      type: "realtime",
      model,
      instructions: fanWorksInstructions(),
      audio: {
        input: {
          noise_reduction: { type: "near_field" },
          turn_detection: {
            type: "server_vad",
            create_response: true,
            interrupt_response: false,
            prefix_padding_ms: 300,
            silence_duration_ms: 600,
          },
        },
        output: { voice },
      },
      tools: [],
      tool_choice: "none",
      ...(model === "gpt-realtime-2" ? { reasoning: { effort: "low" } } : {}),
    },
  };

  try {
    const response = await fetch(OPENAI_REALTIME_CLIENT_SECRETS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionConfig),
      signal: AbortSignal.timeout(10_000),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("[fanworks realtime] OpenAI client secret error", response.status, payload);
      res.status(502).json({ error: "Voice session could not start right now." });
      return;
    }

    res.json(payload);
  } catch (error) {
    console.error("[fanworks realtime] Session mint failed", error);
    res.status(502).json({ error: "Voice session could not start right now." });
  }
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

