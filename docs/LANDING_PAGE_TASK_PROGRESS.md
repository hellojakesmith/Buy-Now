# Landing Page Task Progress

This file records completed implementation tasks from `PRODUCT_TASKS_LANDING_PAGE.md` while the larger backlog remains the source of truth.

## Completed in `feat/landing-page-task-phase-0-schema`

### LP-T0.1 — Establish the landing-page code map

- [x] Identify landing-page screens and the current application-shell location.
- [x] Identify landing-page-specific types and legacy template definitions.
- [x] Identify page persistence/API paths.
- [x] Identify preview/public rendering boundaries.
- [x] Identify media infrastructure used by landing pages.
- [x] Identify the current AI/document-generation boundary.
- [x] Document the current create → save → open → edit → preview → publish lifecycle.
- [x] Document known legacy/template-first behavior.

See `docs/LANDING_PAGE_CODE_MAP.md` for the implementation map.

### LP-T0.2 — Define canonical landing-page document contract

- [x] Review the current conversion-builder schema against the page API.
- [x] Preserve the existing version-1 contract for backward compatibility.
- [x] Add a typed AI design specification contract.
- [x] Add responsive typography/layout rules to the design specification.
- [x] Add typed image-treatment rules.
- [x] Add conversion-strategy metadata for objective, traffic source, temperature, CTA, message match, and trust requirements.
- [x] Add design-specification version metadata.
- [x] Keep all new fields optional so existing version-1 documents remain valid.
- [x] Add schema validation coverage for a representative fitness landing page.
- [x] Add rejection coverage for invalid responsive/design values.

## Completed in `feat/landing-page-ai-strategy-design-generation`

### LP-T2.2 — AI strategy generation

- [x] Create structured landing-page strategy output.
- [x] Determine conversion objective from explicit input or offer context.
- [x] Determine traffic source from explicit input or prompt context.
- [x] Determine traffic temperature from explicit input or prompt context.
- [x] Determine recommended architecture and section sequence.
- [x] Determine CTA strategy.
- [x] Determine trust strategy.
- [x] Determine visual direction.
- [x] Determine required/optional content through structured strategy metadata.
- [x] Preserve authoritative user-provided facts.
- [x] Encode no-invention rules into the provider prompt and deterministic strategy.

### LP-T2.3 — AI design specification

- [x] Generate visual direction.
- [x] Generate color palette.
- [x] Generate typography hierarchy.
- [x] Generate spacing/rhythm rules.
- [x] Generate radius/shadow rules.
- [x] Generate content width/grid behavior.
- [x] Generate section layout variants.
- [x] Generate image treatments.
- [x] Generate CTA treatment.
- [x] Generate responsive rules.
- [x] Store design specification in the versioned page document.
- [x] Validate provider output with Zod.
- [x] Add deterministic fallback when provider generation fails or is unavailable.
- [x] Add automated tests for fitness, purchase, explicit overrides, and schema-valid fallback generation.

### Implementation notes

`backend/src/services/landingPageDesign.ts` is now the canonical deterministic strategy/design layer. `backend/src/routes/ai.ts` uses it both to guide the configured AI provider and to produce a complete fallback document. The frontend does not need to know or configure the underlying design-system decisions.

The AI provider receives structured business context, the selected conversion strategy, section plan, trust requirements, and design direction instead of only a free-form prompt. Provider output is validated and enriched with missing design intelligence before it is returned.

## What this enables

Buy Now now has a backend design-intelligence layer capable of deciding the conversion architecture and generating a professional design specification without requiring users to manually configure Figma-style foundations. The next work should consume this specification in the renderer and progressively extract the landing-page feature from `App.tsx`.

## Next recommended execution batch

1. LP-T1.1 — Extract the landing-page feature from `App.tsx` incrementally.
2. LP-T3.1–T3.4 — Build renderer primitives that consume the design specification.
3. LP-T4.1–T4.6 — Build professional section variants, beginning with the fitness-coach flagship.
4. LP-T7.1–T7.3 — Add AI-aware media composition and image treatment.
5. LP-T9.1–T9.3 — Make preview/public rendering use the same canonical document and responsive rules.
