import { clientIp } from "./contact.js";

const OPENAI_REALTIME_CLIENT_SECRETS_URL = "https://api.openai.com/v1/realtime/client_secrets";
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 3;

export function realtimeAllowedOrigins(env = process.env) {
  return String(env.REALTIME_ALLOWED_ORIGINS || "")
    .split(/[,;\n]+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

export function realtimePublicEnabled(env = process.env) {
  return env.REALTIME_PUBLIC_ENABLED === "true";
}

export function createSlidingWindowLimiter({ max = RATE_MAX, windowMs = RATE_WINDOW_MS } = {}) {
  const hits = new Map();

  return (key, now = Date.now()) => {
    const recent = (hits.get(key) || []).filter((time) => now - time < windowMs);
    if (recent.length >= max) {
      hits.set(key, recent);
      return false;
    }
    recent.push(now);
    hits.set(key, recent);
    return true;
  };
}

const allowRealtimeRequest = createSlidingWindowLimiter();

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

export function realtimeSessionConfig(env = process.env) {
  const model = env.OPENAI_REALTIME_MODEL || "gpt-realtime-2";
  const voice = env.OPENAI_REALTIME_VOICE || "marin";

  return {
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
}

function sendJson(res, status, payload) {
  res.status(status).json(payload);
}

export async function respondRealtimeSession(
  req,
  res,
  { env = process.env, fetchImpl = fetch, allowRequest = allowRealtimeRequest } = {},
) {
  res.set?.("Cache-Control", "no-store");

  if (!realtimePublicEnabled(env)) {
    sendJson(res, 404, { error: "Voice is not available." });
    return;
  }

  const allowedOrigins = realtimeAllowedOrigins(env);
  const origin = String(req.get?.("origin") || req.headers?.origin || "");
  if (!origin || !allowedOrigins.includes(origin)) {
    sendJson(res, 403, { error: "Voice session origin is not allowed." });
    return;
  }

  if (!allowRequest(clientIp(req))) {
    sendJson(res, 429, { error: "Please wait before starting another voice session." });
    return;
  }

  const openAIKey = env.OPENAI_API_KEY;
  if (!openAIKey) {
    sendJson(res, 503, { error: "Voice is not configured yet." });
    return;
  }

  try {
    const response = await fetchImpl(OPENAI_REALTIME_CLIENT_SECRETS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(realtimeSessionConfig(env)),
      signal: AbortSignal.timeout(10_000),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("[fanworks realtime] OpenAI client secret request failed", response.status);
      sendJson(res, 502, { error: "Voice session could not start right now." });
      return;
    }

    sendJson(res, 200, payload);
  } catch {
    console.error("[fanworks realtime] Session mint failed");
    sendJson(res, 502, { error: "Voice session could not start right now." });
  }
}
