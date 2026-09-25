import test from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword, newToken, tokenHash, getCookie } from "./auth.js";

test("passwords use a salted hash and reject wrong credentials", async () => {
  const first = await hashPassword("a sufficiently long secret");
  const second = await hashPassword("a sufficiently long secret");
  assert.notEqual(first, second);
  assert.equal(await verifyPassword("a sufficiently long secret", first), true);
  assert.equal(await verifyPassword("not the same password", first), false);
  await assert.rejects(hashPassword("short"));
});

test("session tokens are opaque and only their hash is persisted", () => {
  const token = newToken();
  assert.notEqual(token, tokenHash(token));
  assert.equal(getCookie({ headers: { cookie: `other=x; fw_workspace_session=${token}` } }), token);
});
