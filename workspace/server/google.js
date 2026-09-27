import { createHash, randomBytes } from "node:crypto";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const ISSUERS = new Set(["https://accounts.google.com", "accounts.google.com"]);
export const STATE_COOKIE = "fw_google_state";
export const STATE_AGE_MS = 10 * 60_000;

/** Google sign-in is on when a client ID, secret, and Workspace domain are all configured. */
export function googleConfig(env = process.env) {
  const clientId = env.GOOGLE_CLIENT_ID?.trim(), clientSecret = env.GOOGLE_CLIENT_SECRET?.trim();
  const domain = env.GOOGLE_WORKSPACE_DOMAIN?.trim().toLowerCase();
  if (!clientId || !clientSecret || !domain) return null;
  return { clientId, clientSecret, domain, autoProvision: env.GOOGLE_AUTO_PROVISION !== "false" };
}

export const redirectUri = (origin) => `${origin}/auth/google/callback`;

/** Returns the Google consent URL plus the state/nonce/PKCE values to keep in a short-lived cookie. */
export function startGoogleLogin(config, origin) {
  const state = randomBytes(24).toString("base64url"), nonce = randomBytes(24).toString("base64url"), verifier = randomBytes(48).toString("base64url");
  const url = new URL(AUTH_URL);
  url.search = new URLSearchParams({
    client_id: config.clientId, redirect_uri: redirectUri(origin), response_type: "code", scope: "openid email profile",
    state, nonce, hd: config.domain, prompt: "select_account",
    code_challenge: createHash("sha256").update(verifier).digest("base64url"), code_challenge_method: "S256",
  }).toString();
  return { url: url.toString(), cookie: `${state}.${nonce}.${verifier}` };
}

export function readStateCookie(value) {
  const [state, nonce, verifier] = (value || "").split(".");
  return state && nonce && verifier ? { state, nonce, verifier } : null;
}

/** Exchanges the authorization code server-to-server and returns the ID token's claims. */
export async function exchangeCode(config, origin, code, verifier, fetchImpl = fetch) {
  const response = await fetchImpl(TOKEN_URL, {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: config.clientId, client_secret: config.clientSecret, redirect_uri: redirectUri(origin), grant_type: "authorization_code", code_verifier: verifier }),
  });
  if (!response.ok) throw new Error(`Google token exchange failed (${response.status})`);
  const { id_token: idToken } = await response.json();
  const payload = typeof idToken === "string" ? idToken.split(".")[1] : null;
  if (!payload) throw new Error("Google returned no ID token");
  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
}

/**
 * The ID token comes straight from Google's token endpoint over TLS, so its claims are checked here
 * (OpenID Connect Core 3.1.3.7) rather than its signature. Returns the identity or throws.
 */
export function validateClaims(claims, { clientId, domain, nonce, now = Date.now() }) {
  const audience = Array.isArray(claims?.aud) ? claims.aud : [claims?.aud];
  if (!ISSUERS.has(claims?.iss)) throw new Error("Unexpected token issuer");
  if (!audience.includes(clientId)) throw new Error("Token was issued for another app");
  if (typeof claims.exp !== "number" || claims.exp * 1000 < now) throw new Error("Token has expired");
  if (claims.nonce !== nonce) throw new Error("Sign-in request did not match");
  const email = typeof claims.email === "string" ? claims.email.toLowerCase() : "";
  if (claims.email_verified !== true || !email) throw new Error("Google account email is not verified");
  if (claims.hd?.toLowerCase() !== domain || !email.endsWith(`@${domain}`)) throw new Error(`Use your @${domain} Google Workspace account`);
  if (typeof claims.sub !== "string" || !claims.sub) throw new Error("Google account ID missing");
  return { sub: claims.sub, email, name: typeof claims.name === "string" && claims.name.trim() ? claims.name.trim().slice(0, 100) : email.split("@")[0] };
}
