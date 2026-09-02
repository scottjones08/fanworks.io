import assert from "node:assert/strict";
import test from "node:test";
import { applySecurityHeaders, securityHeaders } from "./securityHeaders.js";

test("sets the browser security baseline", () => {
  const headers = new Map();
  let continued = false;
  const response = { setHeader: (name, value) => headers.set(name, value) };

  securityHeaders()({}, response, () => {
    continued = true;
  });

  assert.equal(headers.get("Content-Security-Policy"), "frame-ancestors 'none'");
  assert.equal(headers.get("Permissions-Policy"), "camera=(), geolocation=(), microphone=(self), payment=(), usb=()");
  assert.equal(headers.get("Referrer-Policy"), "strict-origin-when-cross-origin");
  assert.equal(headers.get("X-Content-Type-Options"), "nosniff");
  assert.equal(headers.get("X-Frame-Options"), "DENY");
  assert.equal(headers.has("Strict-Transport-Security"), false);
  assert.equal(continued, true);
});

test("adds HSTS only for the production service", () => {
  const headers = new Map();
  const response = { setHeader: (name, value) => headers.set(name, value) };

  securityHeaders({ production: true })({}, response, () => {});

  assert.equal(headers.get("Strict-Transport-Security"), "max-age=31536000; includeSubDomains");
});

test("disables the Express signature and registers middleware", () => {
  const calls = [];
  const app = {
    disable: (name) => calls.push(["disable", name]),
    use: (middleware) => calls.push(["use", typeof middleware]),
  };

  applySecurityHeaders(app, { production: true });

  assert.deepEqual(calls, [
    ["disable", "x-powered-by"],
    ["use", "function"],
  ]);
});
