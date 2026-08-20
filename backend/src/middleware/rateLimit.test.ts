import assert from "node:assert/strict";
import { consumeRateLimit, resetRateLimitStore } from "./rateLimit.ts";
import { afterEach, test } from "node:test";

afterEach(() => {
  resetRateLimitStore();
});

test("allows requests under the max", () => {
  const first = consumeRateLimit("ip:1", 60_000, 2, 1_000);
  const second = consumeRateLimit("ip:1", 60_000, 2, 1_001);
  assert.equal(first.allowed, true);
  assert.equal(second.allowed, true);
  assert.equal(second.remaining, 0);
});

test("blocks requests over the max until the window resets", () => {
  consumeRateLimit("ip:2", 60_000, 1, 1_000);
  const blocked = consumeRateLimit("ip:2", 60_000, 1, 1_001);
  const afterReset = consumeRateLimit("ip:2", 60_000, 1, 61_001);
  assert.equal(blocked.allowed, false);
  assert.equal(afterReset.allowed, true);
});
