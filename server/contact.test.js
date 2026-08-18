import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  contactRecipients,
  contactStatus,
  DEFAULT_CONTACT_TO,
  deliverContact,
  ONBOARDING_FROM,
  resendFromAddress,
  resendRecipients,
  resendUsesOnboarding,
  validateContact,
} from "./contact.js";

describe("contact", { concurrency: false }, () => {
test("defaults to the FanWorks inbox list", () => {
  const previous = process.env.CONTACT_TO;
  delete process.env.CONTACT_TO;
  try {
    assert.deepEqual(contactRecipients(), DEFAULT_CONTACT_TO);
  } finally {
    if (previous === undefined) delete process.env.CONTACT_TO;
    else process.env.CONTACT_TO = previous;
  }
});

test("parses comma-separated CONTACT_TO", () => {
  const previous = process.env.CONTACT_TO;
  process.env.CONTACT_TO = "scott@fanworks.io, mike@fanworks.io";
  try {
    assert.deepEqual(contactRecipients(), ["scott@fanworks.io", "mike@fanworks.io"]);
  } finally {
    if (previous === undefined) delete process.env.CONTACT_TO;
    else process.env.CONTACT_TO = previous;
  }
});

test("rejects empty fields", () => {
  const result = validateContact({ name: "", email: "", message: "" });
  assert.equal(result.ok, false);
});

test("rejects invalid email", () => {
  const result = validateContact({
    name: "Scott",
    email: "not-an-email",
    message: "The day is grinding on intake.",
  });
  assert.equal(result.ok, false);
  assert.match(result.error, /email/i);
});

test("accepts a real inquiry", () => {
  const result = validateContact({
    name: "  Scott Jones  ",
    email: "scott@example.com",
    message: "Orders are retyped three times before they hit the floor.",
  });
  assert.equal(result.ok, true);
  assert.equal(result.payload.name, "Scott Jones");
});

test("uses the Resend onboarding sender until a domain from-address is set", () => {
  const previous = process.env.RESEND_FROM;
  delete process.env.RESEND_FROM;
  try {
    assert.equal(resendFromAddress(), ONBOARDING_FROM);
    assert.equal(resendUsesOnboarding(), true);
    assert.deepEqual(resendRecipients(DEFAULT_CONTACT_TO), [DEFAULT_CONTACT_TO[0]]);
  } finally {
    if (previous === undefined) delete process.env.RESEND_FROM;
    else process.env.RESEND_FROM = previous;
  }
});

test("keeps every recipient when sending from a verified domain", () => {
  const previous = process.env.RESEND_FROM;
  process.env.RESEND_FROM = "FanWorks <hello@fanworks.io>";
  try {
    assert.equal(resendUsesOnboarding(), false);
    assert.deepEqual(resendRecipients(DEFAULT_CONTACT_TO), DEFAULT_CONTACT_TO);
  } finally {
    if (previous === undefined) delete process.env.RESEND_FROM;
    else process.env.RESEND_FROM = previous;
  }
});

test("reports contact as unconfigured without a Resend key", () => {
  const previousKey = process.env.RESEND_API_KEY;
  const previousHook = process.env.CONTACT_WEBHOOK_URL;
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_WEBHOOK_URL;
  try {
    const status = contactStatus();
    assert.equal(status.configured, false);
    assert.equal(status.resend, false);
  } finally {
    if (previousKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousKey;
    if (previousHook === undefined) delete process.env.CONTACT_WEBHOOK_URL;
    else process.env.CONTACT_WEBHOOK_URL = previousHook;
  }
});

test("posts a Resend email when the API key is set", async () => {
  const previousKey = process.env.RESEND_API_KEY;
  const previousFrom = process.env.RESEND_FROM;
  const previousTo = process.env.CONTACT_TO;
  process.env.RESEND_API_KEY = "re_test_key";
  delete process.env.RESEND_FROM;
  delete process.env.CONTACT_TO;
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      status: 200,
      json: async () => ({ id: "email_test" }),
    };
  };
  try {
    await deliverContact({
      name: "Scott Jones",
      email: "visitor@example.com",
      message: "The floor is still running on paper tickets.",
    });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://api.resend.com/emails");
    assert.match(calls[0].options.headers.Authorization, /re_test_key/);
    const body = JSON.parse(calls[0].options.body);
    assert.equal(body.from, ONBOARDING_FROM);
    assert.deepEqual(body.to, [DEFAULT_CONTACT_TO[0]]);
    assert.deepEqual(body.reply_to, ["visitor@example.com"]);
    assert.match(body.subject, /Scott Jones/);
    assert.match(body.text, /paper tickets/);
    assert.match(body.html, /paper tickets/);
  } finally {
    globalThis.fetch = originalFetch;
    if (previousKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousKey;
    if (previousFrom === undefined) delete process.env.RESEND_FROM;
    else process.env.RESEND_FROM = previousFrom;
    if (previousTo === undefined) delete process.env.CONTACT_TO;
    else process.env.CONTACT_TO = previousTo;
  }
});

test("treats honeypot as silent spam", () => {
  const result = validateContact({
    name: "Bot",
    email: "bot@example.com",
    message: "spam ".repeat(10),
    company: "Acme Widgets",
  });
  assert.equal(result.ok, true);
  assert.equal(result.spam, true);
});
});
