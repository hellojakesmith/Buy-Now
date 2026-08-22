# Landing Page Code Map

> Current-state inventory for the Landing Page implementation. This is the baseline for `PRODUCT_TASKS_LANDING_PAGE.md` and should be updated as the architecture changes.

## Frontend

### Application shell

- `buynow/src/app/App.tsx`
  - Owns the top-level `Screen` state and navigation.
  - Currently contains landing-page template definitions, landing draft types, creation UI, editor/preview behavior, and page-management behavior alongside the rest of the CRM application.
  - This is the primary extraction target for LP-T1.1; extraction must be incremental to avoid destabilizing the rest of the app.

### Shared API/data layer

- `buynow/src/app/lib/api.ts`
  - Central client-side API URL/request helpers used by application features.
  - Landing-page API operations should eventually be isolated behind a dedicated landing-page API module rather than embedded in the application shell.

- `buynow/src/app/lib/useAppData.ts`
  - Shared application data loading/state.
  - Landing-page page-list data should not become tightly coupled to unrelated CRM state.

### Current landing-page creation model

`App.tsx` currently contains:

- `LandingTemplateKey`
- `LandingThemeKey`
- `LandingTemplate`
- `LandingDraft`
- `LANDING_THEMES`
- `LANDING_TEMPLATES`
- Create-sheet navigation into `landing-templates`

This represents the legacy/template-first creation path. The target architecture is AI-first creation, with templates/strategies used internally as AI composition guidance rather than requiring users to choose a design template.

## Backend

### Canonical document validation

- `backend/src/schemas/conversionBuilder.ts`
  - Canonical versioned landing-page builder document.
  - `CONVERSION_BUILDER_SCHEMA_VERSION` is currently `1`.
  - Validates sections, blocks, actions, theme, references, AI metadata, and now structured AI design/conversion metadata.
  - `validateConversionBuilderDocument()` is the server-side validation entry point.
  - `migrateLegacySections()` provides a safe compatibility envelope for legacy section data.

### Schema tests

- `backend/src/schemas/conversionBuilder.test.ts`
  - Covers connected builder documents.
  - Covers invalid action references.
  - Covers legacy migration.
  - Covers AI-generated design specifications and responsive design constraints.

### Page persistence API

- `backend/src/routes/pages.ts`
  - `GET /api/pages` — paginated page list with status/type/search filters.
  - `POST /api/pages` — creates a page and persists `builderDocument` when supplied.
  - `GET /api/pages/:id` — loads a page for editing/preview.
  - `PATCH /api/pages/:id` — updates page data and builder document.
  - `POST /api/pages/:id/publish` — publishes a page.
  - `DELETE /api/pages/:id` — deletes a page.
  - Server-side validation is performed through `pageBodySchema` and `conversionBuilderDocumentSchema`.

### Public rendering data endpoint

- `backend/src/routes/public.ts`
  - `GET /api/public/pages/:slug` — returns a published page document.
  - The endpoint currently returns page JSON; a production public renderer must consume the same canonical builder document used by preview/editor rendering.

### Page model

- `backend/src/models/Page.ts`
  - Persistence model for page metadata, legacy sections, builder version, and builder document.
  - The versioned `builderDocument` should remain the source of truth for the new Landing Page builder.

## Media

- `backend/src/routes/media.ts`
- `backend/src/models/MediaAsset.ts`

These provide the existing media persistence/upload foundation. Landing Page work should build on this rather than introduce a second asset store.

## AI

The Landing Page implementation currently has AI-generated document behavior in the application flow, but the design intelligence needs to become an explicit structured contract.

The canonical document now reserves:

- `designSpec` — AI-generated visual/design system decisions.
- `conversionStrategy` — AI-generated conversion architecture decisions.
- `metadata.aiGenerated` — provenance.
- `metadata.aiPromptVersion` — prompt/version tracking.
- `metadata.designSpecVersion` — design specification version tracking.

The next implementation step is to move AI strategy/design generation behind a dedicated service and validate its output before it reaches the editor or persistence API.

## Current page lifecycle

```text
Create Sheet
  ↓
Landing Page creation flow
  ↓
Generate/assemble builder document
  ↓
POST /api/pages
  ↓
Page persisted as draft
  ↓
GET /api/pages/:id
  ↓
Editor / preview
  ↓
PATCH /api/pages/:id
  ↓
POST /api/pages/:id/publish
  ↓
GET /api/public/pages/:slug
```

## Known architectural gaps

1. Landing Page concerns are still concentrated in `App.tsx`.
2. Creation remains partially template-oriented.
3. AI strategy/design output is not yet a dedicated backend service.
4. Design specification is now validated but is not yet consumed by a complete design system renderer.
5. Preview and public rendering need a shared renderer contract.
6. Media composition needs first-class image-treatment behavior.
7. Section editing needs a dedicated mobile-first feature module.
8. Responsive layout decisions need to be represented and rendered consistently.
9. Automated visual regression coverage is not yet sufficient for the flagship Landing Page experience.

## Extraction rule

Do not rewrite `App.tsx` wholesale. Extract one domain boundary at a time, preserve behavior, add tests, and only then delete the old implementation.
