import test from "node:test";
import assert from "node:assert/strict";
import pg from "pg";
import "./db.js";

test("DATE columns are parsed as plain YYYY-MM-DD strings", () => {
  const parse = pg.types.getTypeParser(pg.types.builtins.DATE);
  assert.equal(parse("2026-09-29"), "2026-09-29");
});
