import assert from "node:assert/strict";
import test from "node:test";
import {
  createSlidingWindowLimiter,
  realtimeAllowedOrigins,
  realtimePublicEnabled,
  respondRealtimeSession,
} from "./realtime.js";

function responseRecorder() {
  return {
    code: null,
    headers: {},
    payload: null,
    set(name, value) {
      this.headers[name] = value;
      return this;
    },
    status(code) {
      this.code = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
}

function request(origin = "https://fanworks.io") {
  return {
    headers: { origin, "x-forwarded-for": "203.0.113.10" },
    get(name) {
      return this.headers[name.toLowerCase()];
    },
    socket: {},
  };
}

const enabledEnv = {
  REALTIME_PUBLIC_ENABLED: "true",
  REALTIME_ALLOWED_ORIGINS: "https://fanworks.io, https://www.fanworks.io",
  OPENAI_API_KEY: "test-key",
};

test("realtime remains disabled unless explicitly enabled", async () => {
  assert.equal(realtimePublicEnabled({}), false);
  assert.equal(realtimePublicEnabled({ REALTIME_PUBLIC_ENABLED: "TRUE" }), false);

  const res = responseRecorder();
  await respondRealtimeSession(request(), res, { env: {}, fetchImpl: () => assert.fail() });
  assert.equal(res.code, 404);
});

test("parses a strict allowed-origin list", () => {
  assert.deepEqual(realtimeAllowedOrigins(enabledEnv), [
    "https://fanworks.io",
    "https://www.fanworks.io",
  ]);
  assert.deepEqual(realtimeAllowedOrigins({}), []);
});

test("rejects missing or unapproved origins without contacting OpenAI", async () => {
  for (const origin of ["", "https://evil.example", "https://fanworks.io.evil.example"]) {
    const res = responseRecorder();
    await respondRealtimeSession(request(origin), res, {
      env: enabledEnv,
      fetchImpl: () => assert.fail("OpenAI must not be contacted"),
    });
    assert.equal(res.code, 403);
  }
});

test("rate limiter rejects requests beyond the configured window", () => {
  const allow = createSlidingWindowLimiter({ max: 2, windowMs: 1000 });
  assert.equal(allow("ip", 1000), true);
  assert.equal(allow("ip", 1100), true);
  assert.equal(allow("ip", 1200), false);
  assert.equal(allow("ip", 2101), true);
});

test("does not mint a session when the approved request is rate limited", async () => {
  const res = responseRecorder();
  await respondRealtimeSession(request(), res, {
    env: enabledEnv,
    allowRequest: () => false,
    fetchImpl: () => assert.fail("OpenAI must not be contacted"),
  });
  assert.equal(res.code, 429);
});

test("mints a session only after feature, origin, rate, and key checks pass", async () => {
  const res = responseRecorder();
  let requestBody;
  await respondRealtimeSession(request(), res, {
    env: enabledEnv,
    allowRequest: () => true,
    fetchImpl: async (_url, options) => {
      requestBody = JSON.parse(options.body);
      assert.equal(options.headers.Authorization, "Bearer test-key");
      return {
        ok: true,
        status: 200,
        json: async () => ({ value: "ephemeral-client-secret" }),
      };
    },
  });

  assert.equal(res.code, 200);
  assert.equal(res.headers["Cache-Control"], "no-store");
  assert.deepEqual(res.payload, { value: "ephemeral-client-secret" });
  assert.equal(requestBody.session.tools.length, 0);
  assert.match(requestBody.session.instructions, /Do not collect sensitive/);
});

test("upstream error details are not returned to the caller", async () => {
  const res = responseRecorder();
  await respondRealtimeSession(request(), res, {
    env: enabledEnv,
    allowRequest: () => true,
    fetchImpl: async () => ({
      ok: false,
      status: 429,
      json: async () => ({ error: { message: "sensitive provider detail" } }),
    }),
  });

  assert.equal(res.code, 502);
  assert.deepEqual(res.payload, { error: "Voice session could not start right now." });
});
