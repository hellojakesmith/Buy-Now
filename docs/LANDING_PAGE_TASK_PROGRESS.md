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

## What this enables

The backend can now persist a professional design specification alongside the existing builder document without requiring users to manually configure Figma-style foundations. The next implementation work can build an AI strategy/design service that produces this contract and a renderer that consumes it.

## Next recommended execution batch

1. LP-T2.2 — AI strategy generation service.
2. LP-T2.3 — AI design-spec generation with deterministic fallback.
3. LP-T1.1 — Extract the landing-page feature from `App.tsx` incrementally.
4. LP-T3.1–T3.4 — Build renderer primitives that consume the design specification.
5. LP-T9.1–T9.3 — Make preview/public rendering use the same canonical document and responsive rules.
