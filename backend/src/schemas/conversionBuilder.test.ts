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

test("accepts an AI-generated landing page design specification", () => {
  const document = validateConversionBuilderDocument({
    schemaVersion: 1,
    sections: [{
      id: "hero",
      type: "hero",
      visible: true,
      blocks: [{ type: "text", text: "Find Your Spark" }],
      settings: {},
      imageTreatment: {
        mode: "editorial",
        fit: "cover",
        focalPoint: { x: 0.5, y: 0.35 },
        aspectRatio: "4:5",
      },
    }],
    theme: { colors: {}, typography: {}, buttons: {}, spacing: {}, radius: {} },
    designSpec: {
      version: 1,
      visualDirection: "Premium editorial fitness coaching",
      typography: {
        fontFamily: "Inter, system-ui, sans-serif",
        displayFontFamily: "Inter, system-ui, sans-serif",
        headingWeight: 800,
        bodyWeight: 400,
        scale: "expressive",
        headingLineHeight: 1.05,
        bodyLineHeight: 1.5,
      },
      colors: {
        primary: "#111111",
        secondary: "#E11D48",
        background: "#FFFFFF",
        surface: "#F7F7F5",
        text: "#111111",
        mutedText: "#6B7280",
        inverseText: "#FFFFFF",
      },
      layout: {
        contentWidth: "wide",
        sectionSpacing: "airy",
        density: "balanced",
        alignment: "mixed",
        grid: "editorial",
        mobileStack: true,
      },
      responsive: {
        typography: {
          displaySize: { mobile: "48px", tablet: "64px", desktop: "88px" },
          headingSize: { mobile: "32px", tablet: "40px", desktop: "52px" },
          bodySize: { mobile: "17px", tablet: "18px", desktop: "19px" },
        },
        spacing: {
          section: { mobile: "48px", tablet: "72px", desktop: "112px" },
          container: { mobile: "20px", tablet: "32px", desktop: "48px" },
        },
        columns: { mobile: 1, tablet: 2, desktop: 3 },
        hero: "split",
        cta: "full-width",
      },
      defaultImageTreatment: {
        mode: "editorial",
        fit: "cover",
        aspectRatio: "4:5",
      },
      radius: "soft",
      shadows: "subtle",
      buttonStyle: "solid",
    },
    conversionStrategy: {
      objective: "application",
      trafficSource: "instagram",
      trafficTemperature: "cold",
      primaryCta: "Apply for coaching",
      messageMatch: "Continue the six-week challenge promise from the Instagram ad.",
      trustRequirements: ["Before/after results", "Client testimonials"],
    },
    references: [],
    metadata: { aiGenerated: true, aiPromptVersion: "design-v1", designSpecVersion: 1 },
  });

  assert.equal(document.designSpec?.responsive.columns.mobile, 1);
  assert.equal(document.designSpec?.layout.contentWidth, "wide");
  assert.equal(document.conversionStrategy?.objective, "application");
});

test("rejects invalid design specification values", () => {
  assert.throws(() => validateConversionBuilderDocument({
    schemaVersion: 1,
    sections: [],
    theme: {},
    designSpec: {
      version: 1,
      typography: { fontFamily: "Inter" },
      colors: {
        primary: "#111111",
        background: "#FFFFFF",
        surface: "#FFFFFF",
        text: "#111111",
        mutedText: "#666666",
      },
      layout: {},
      responsive: { columns: { mobile: 4, tablet: 2, desktop: 3 } },
      defaultImageTreatment: {},
      radius: "soft",
      shadows: "subtle",
      buttonStyle: "solid",
    },
  }));
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