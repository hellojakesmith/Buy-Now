import test from "node:test";
import assert from "node:assert/strict";
import { buildDesignSpec, buildFallbackLandingPage, buildLandingPageStrategy } from "./landingPageDesign.js";


test("fitness campaign strategy selects the fitness architecture", () => {
  const strategy = buildLandingPageStrategy({
    prompt: "Create a landing page for my 6 week fitness challenge from Instagram ads",
    offer: "6 Week Challenge",
    audience: "Women 30+",
    outcome: "Feel stronger and more confident",
    trafficSource: "instagram",
    trafficTemperature: "cold",
  });

  assert.equal(strategy.templateKey, "fitness-coach");
  assert.equal(strategy.strategy.objective, "lead");
  assert.equal(strategy.strategy.trafficSource, "instagram");
  assert.equal(strategy.strategy.trafficTemperature, "cold");
  assert.ok(strategy.sectionPlan.includes("hero"));
  assert.ok(strategy.sectionPlan.includes("social-proof"));
  assert.ok(strategy.sectionPlan.includes("form"));
  assert.match(strategy.designDirection, /fitness/i);
});

test("purchase strategy creates a commerce-oriented design", () => {
  const strategy = buildLandingPageStrategy({
    prompt: "Sell my premium skincare product from Facebook ads",
    offer: "Daily Renewal Serum",
    objective: "purchase",
    trafficSource: "facebook",
  });

  const spec = buildDesignSpec(strategy);
  assert.equal(strategy.strategy.objective, "purchase");
  assert.equal(strategy.templateKey, "product-offer");
  assert.ok(strategy.sectionPlan.includes("offer"));
  assert.ok(strategy.sectionPlan.includes("product"));
  assert.equal(spec.layout.contentWidth, "standard");
});

test("fallback is schema-valid and contains design intelligence", () => {
  const { document } = buildFallbackLandingPage({
    prompt: "Build a coaching application page",
    offer: "Executive coaching",
    audience: "Founders",
    outcome: "Make better decisions",
    objective: "application",
  });

  assert.equal(document.schemaVersion, 1);
  assert.ok(document.designSpec);
  assert.ok(document.conversionStrategy);
  assert.equal(document.metadata.aiGenerated, true);
  assert.equal(document.metadata.aiPromptVersion, "ai-landing-v2");
  assert.ok(document.sections.length >= 5);
  assert.ok(document.sections.every((section) => section.id.length > 0));
});

test("explicit strategy inputs override inference", () => {
  const strategy = buildLandingPageStrategy({
    prompt: "Create a fitness coaching page",
    objective: "call",
    trafficSource: "google",
    trafficTemperature: "warm",
    primaryCta: "Book my strategy call",
  });

  assert.equal(strategy.strategy.objective, "call");
  assert.equal(strategy.strategy.trafficSource, "google");
  assert.equal(strategy.strategy.trafficTemperature, "warm");
  assert.equal(strategy.strategy.primaryCta, "Book my strategy call");
});
