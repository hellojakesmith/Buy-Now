import assert from "node:assert/strict";
import { test } from "node:test";
import { migrateLegacySections, validateConversionBuilderDocument } from "./conversionBuilder.ts";

test("accepts a connected mobile builder document", () => {
  const document = validateConversionBuilderDocument({
    schemaVersion: 1,
    sections: [{
      id: "hero",
      type: "hero",
      visible: true,
      blocks: [
        { type: "text", text: "Build your audience" },
        { type: "button", label: "Get the guide", action: { type: "form", formId: "form-123" } },
      ],
      settings: {},
    }],
    theme: { colors: { primary: "#111111" }, typography: {}, buttons: {}, spacing: {}, radius: {} },
    references: [{ type: "form", id: "form-123" }, { type: "product", id: "product-123" }],
    metadata: { aiGenerated: true, aiPromptVersion: "v1" },
  });

  assert.equal(document.sections[0].blocks.length, 2);
  assert.equal(document.metadata.aiGenerated, true);
});

test("rejects an invalid action reference", () => {
  assert.throws(() => validateConversionBuilderDocument({
    schemaVersion: 1,
    sections: [{
      id: "cta",
      type: "cta",
      visible: true,
      blocks: [{ type: "button", label: "Buy", action: { type: "product", productId: "" } }],
      settings: {},
    }],
    theme: {},
  }));
});

test("migrates legacy sections into a versioned safe envelope", () => {
  const migrated = migrateLegacySections([{ id: "old-hero", headline: "Hello" }, { legacy: true }]);
  assert.equal(migrated.schemaVersion, 1);
  assert.equal(migrated.sections.length, 2);
  assert.equal(migrated.sections[0].id, "old-hero");
  assert.deepEqual(migrated.sections[0].settings.legacy, { id: "old-hero", headline: "Hello" });
});
