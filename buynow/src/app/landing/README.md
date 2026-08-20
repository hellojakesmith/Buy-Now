# Landing Page Builder

The landing builder uses the versioned conversion-builder document already persisted by the `Page` model.

## Files

- `LandingPageBuilderScreen.tsx` — mobile-first editor surface.
- `LandingPageRenderer.tsx` — preview/public rendering contract.
- `landingBuilder.ts` — template document factory.

## Design contract

The editor does not own a second page schema. It edits the same `schemaVersion: 1` document persisted by `Page.builderDocument`.

The editor is intentionally section-based:

1. Select a section.
2. Edit the section's content.
3. Add/reorder/hide sections.
4. Connect real domain references.
5. Preview.
6. Save/publish.

Future AI generation must produce this same structured document and pass the backend Zod schema before persistence.
