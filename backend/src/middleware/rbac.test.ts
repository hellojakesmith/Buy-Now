import assert from "node:assert/strict";
import { test } from "node:test";
import { hasAtLeastRole, roleRank } from "./rbac.ts";

test("ranks owner above admin above member", () => {
  assert.ok(roleRank("owner") > roleRank("admin"));
  assert.ok(roleRank("admin") > roleRank("member"));
  assert.equal(roleRank("unknown"), 0);
});

test("admin satisfies admin and member checks but not owner", () => {
  assert.equal(hasAtLeastRole("admin", "member"), true);
  assert.equal(hasAtLeastRole("admin", "admin"), true);
  assert.equal(hasAtLeastRole("admin", "owner"), false);
});
