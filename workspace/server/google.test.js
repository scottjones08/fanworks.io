import test from "node:test";
import assert from "node:assert/strict";
import { googleConfig, readStateCookie, startGoogleLogin, validateClaims } from "./google.js";

const config = { clientId: "client-123", clientSecret: "secret", domain: "fanworks.io", autoProvision: true };
const good = { iss: "https://accounts.google.com", aud: "client-123", exp: Date.now() / 1000 + 300, nonce: "n1", email: "Scott@fanworks.io", email_verified: true, hd: "fanworks.io", sub: "1234", name: "Scott Jones" };
const opts = { clientId: "client-123", domain: "fanworks.io", nonce: "n1" };

test("Google sign-in stays off until client ID, secret, and domain are all set", () => {
  assert.equal(googleConfig({ GOOGLE_CLIENT_ID: "a", GOOGLE_CLIENT_SECRET: "b" }), null);
  assert.deepEqual(googleConfig({ GOOGLE_CLIENT_ID: "a", GOOGLE_CLIENT_SECRET: "b", GOOGLE_WORKSPACE_DOMAIN: "FanWorks.io" }), { clientId: "a", clientSecret: "b", domain: "fanworks.io", autoProvision: true });
  assert.equal(googleConfig({ GOOGLE_CLIENT_ID: "a", GOOGLE_CLIENT_SECRET: "b", GOOGLE_WORKSPACE_DOMAIN: "x.io", GOOGLE_AUTO_PROVISION: "false" }).autoProvision, false);
});

test("the consent URL pins the Workspace domain and uses PKCE, state, and nonce", () => {
  const { url, cookie } = startGoogleLogin(config, "https://app.fanworks.io");
  const params = new URL(url).searchParams, saved = readStateCookie(cookie);
  assert.equal(params.get("hd"), "fanworks.io");
  assert.equal(params.get("redirect_uri"), "https://app.fanworks.io/auth/google/callback");
  assert.equal(params.get("code_challenge_method"), "S256");
  assert.equal(params.get("state"), saved.state);
  assert.equal(params.get("nonce"), saved.nonce);
  assert.notEqual(params.get("code_challenge"), saved.verifier);
});

test("valid Workspace claims produce a normalized identity", () => {
  assert.deepEqual(validateClaims(good, opts), { sub: "1234", email: "scott@fanworks.io", name: "Scott Jones" });
});

test("claims from other domains, apps, requests, or unverified emails are rejected", () => {
  assert.throws(() => validateClaims({ ...good, hd: undefined, email: "scott@gmail.com" }, opts), /@fanworks\.io/);
  assert.throws(() => validateClaims({ ...good, hd: "fanworks.io", email: "scott@evil.com" }, opts), /@fanworks\.io/);
  assert.throws(() => validateClaims({ ...good, aud: "other-app" }, opts), /another app/);
  assert.throws(() => validateClaims({ ...good, iss: "https://evil.example" }, opts), /issuer/);
  assert.throws(() => validateClaims({ ...good, nonce: "replayed" }, opts), /did not match/);
  assert.throws(() => validateClaims({ ...good, exp: Date.now() / 1000 - 5 }, opts), /expired/);
  assert.throws(() => validateClaims({ ...good, email_verified: false }, opts), /not verified/);
});
