import assert from "node:assert/strict";
import { test } from "node:test";
import { hashPassword, hashSessionToken, parseSessionCookie, verifyPassword } from "./auth.ts";

test("hashes and verifies passwords", () => {
  const stored = hashPassword("correct-horse-battery");
  assert.equal(verifyPassword("correct-horse-battery", stored), true);
  assert.equal(verifyPassword("wrong-password-value", stored), false);
});

test("parses the session cookie and hashes tokens", () => {
  const token = "abc123";
  assert.equal(parseSessionCookie(`other=1; buynow_session=${token}`), token);
  assert.equal(hashSessionToken(token).length, 64);
});
