# Product Roadmap Implementation Status

Last updated: 2026-08-20

This file tracks implementation completed against `PRODUCT_ROADMAP.md`. Items are only marked complete when the corresponding repository change has actually been made.

## Conversion Builder Suite — Current Pass

### CB-1 Shared Conversion Builder Architecture

- [x] Define a versioned builder document envelope (`schemaVersion`).
- [x] Define shared section primitives and supported block types.
- [x] Define shared CTA/action model for URLs, forms, products, and Buy Now pages.
- [x] Define shared theme/design-token model.
- [x] Define explicit references to canonical forms/products/pages rather than duplicating business data.
- [x] Add server-side structured-output validation with Zod.
- [x] Persist a versioned builder document on Page while retaining legacy `sections` for incremental migration.
- [x] Add a legacy-section migration boundary that preserves unknown legacy content instead of guessing its semantics.
- [x] Add automated schema validation and migration tests.
- [x] Validate versioned builder documents at the Page API boundary.

### CB-2 Lead Forms

- [x] Advanced field schema foundation merged in PR #11.
- [x] Server-side validation for advanced field types and constraints.
- [x] Mobile field editor improvements.
- [x] Public renderer support for advanced fields and conditional visibility.
- [x] Automated form schema tests.
- [ ] Form autosave/draft recovery.
- [ ] Form templates.
- [ ] AI form generation.
- [ ] Form analytics.

### Next Implementation Target

**CB-3 Landing Pages:** build the shared section-based mobile editor on top of the versioned builder document. Reuse the existing `Page` domain/API and migrate the current `sections` renderer incrementally; do not create a second page-builder data model.

After CB-3, continue with Products → Buy Now Pages → AI Build orchestration → Conversion Intelligence.

## Existing Platform Status

The previous roadmap work remains authoritative in the main product roadmap. The conversion-builder work is intentionally additive and preserves existing authentication, CRM, form, page, product, order, media, and public-rendering foundations.
