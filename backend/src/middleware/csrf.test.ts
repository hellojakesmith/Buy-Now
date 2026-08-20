import assert from "node:assert/strict";
import { test } from "node:test";
import { isAllowedOrigin } from "./csrf.ts";

test("accepts an origin listed in CORS_ORIGIN", () => {
  assert.equal(isAllowedOrigin("https://app.buynow.test", "api.buynow.test", "https://app.buynow.test", "production"), true);
});

test("rejects a foreign origin in production", () => {
  assert.equal(isAllowedOrigin("https://evil.test", "api.buynow.test", "https://app.buynow.test", "production"), false);
});

test("allows same-host origin when CORS_ORIGIN is wildcard", () => {
  assert.equal(isAllowedOrigin("https://api.buynow.test", "api.buynow.test", "*", "production"), true);
});
