import assert from "node:assert/strict";
import { test } from "node:test";
import { validateContact } from "./contact.js";

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
