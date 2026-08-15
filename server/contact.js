const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 6;
const hits = new Map();

export const DEFAULT_CONTACT_TO = [
  "scottjones08@gmail.com",
  "scott@fanworks.io",
  "mike@fanworks.io",
  "brant@fanworks.io",
];

export function contactRecipients() {
  const raw = process.env.CONTACT_TO;
  if (!raw || !String(raw).trim()) return [...DEFAULT_CONTACT_TO];
  return String(raw)
    .split(/[,;\n]+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

export function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

export function allowRequest(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

export function validateContact(input = {}) {
  const honeypot = String(input.company ?? "").trim();
  if (honeypot) return { ok: true, spam: true };

  const name = String(input.name ?? "")
    .replace(/\s+/g, " ")
    .trim();
  const email = String(input.email ?? "").trim();
  const message = String(input.message ?? "").trim();

  if (name.length < 2 || name.length > 120) {
    return { ok: false, error: "Please add your name." };
  }
  if (!EMAIL_RE.test(email) || email.length > 160) {
    return { ok: false, error: "Please add a valid email." };
  }
  if (message.length < 8 || message.length > 4000) {
    return { ok: false, error: "Please tell us a bit more about the work." };
  }

  return { ok: true, payload: { name, email, message } };
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  if (typeof res.status === "function") {
    res.status(status).json(payload);
    return;
  }
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(body);
}

async function sendResend({ to, name, email, text }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "FanWorks <beth.t@example.com>";
  const recipients = Array.isArray(to) ? to : [to];
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: recipients,
      reply_to: email,
      subject: `FanWorks conversation: ${name}`,
      text,
    }),
    signal: AbortSignal.timeout(12_000),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error("resend_failed");
    error.detail = payload;
    throw error;
  }
}

async function sendWebhook({ name, email, message, text }) {
  const url = process.env.CONTACT_WEBHOOK_URL;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      name,
      email,
      message,
      source: "fanworks.io",
    }),
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) {
    throw new Error("webhook_failed");
  }
}

export async function deliverContact({ name, email, message }) {
  const to = contactRecipients();
  const text = `New FanWorks inquiry\n\nName: ${name}\nEmail: ${email}\n\n${message}\n`;
  const jobs = [];

  if (process.env.RESEND_API_KEY) {
    jobs.push(sendResend({ to, name, email, text }));
  }
  if (process.env.CONTACT_WEBHOOK_URL) {
    jobs.push(sendWebhook({ name, email, message, text }));
  }

  if (!jobs.length) {
    const error = new Error("not_configured");
    error.code = "not_configured";
    throw error;
  }

  const results = await Promise.allSettled(jobs);
  if (results.every((result) => result.status === "rejected")) {
    console.error(
      "[fanworks contact] delivery failed",
      results.map((result) => result.reason?.message || result.reason),
    );
    throw new Error("delivery_failed");
  }
}

export async function respondContact(req, res, body) {
  if (!allowRequest(clientIp(req))) {
    sendJson(res, 429, { error: "Please wait a bit before sending another note." });
    return;
  }

  const parsed = validateContact(body);
  if (parsed.spam) {
    sendJson(res, 200, { ok: true });
    return;
  }
  if (!parsed.ok) {
    sendJson(res, 400, { error: parsed.error });
    return;
  }

  try {
    await deliverContact(parsed.payload);
    sendJson(res, 200, { ok: true });
  } catch (error) {
    if (error.code === "not_configured") {
      console.error("[fanworks contact] Add RESEND_API_KEY or CONTACT_WEBHOOK_URL");
      sendJson(res, 503, { error: "Contact is not configured yet. Email hello@fanworks.io." });
      return;
    }
    sendJson(res, 502, { error: "Could not send that just now. Email hello@fanworks.io." });
  }
}

export async function handleContactRaw(req, res) {
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8");
    const body = raw ? JSON.parse(raw) : {};
    await respondContact(req, res, body);
  } catch {
    sendJson(res, 400, { error: "Invalid request." });
  }
}
