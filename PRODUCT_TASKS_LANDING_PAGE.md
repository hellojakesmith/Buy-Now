# Buy Now — Landing Page Implementation Task List

> Execution backlog for `PRODUCT_ROADMAP_LANDING_PAGE_DESIGN.md`.
>
> This document translates the product/design roadmap into concrete engineering tasks based on the current `main` implementation. Check items off only when the implementation is actually complete, tested, and usable from the mobile-first product flow.

## Current-state assessment

The current application has a useful foundation, but Landing Pages are still too dependent on legacy/prototype behavior. The frontend landing-page surface is concentrated in the large `buynow/src/app/App.tsx`, while the backend already has a versioned conversion-builder document and page persistence. The current schema supports a limited set of section/block types and the page API persists the builder document, but the product still needs a substantially richer AI-driven design system, editing experience, media composition system, responsive renderer, and production QA layer.

The implementation should extend the existing architecture rather than replace working foundations. The repository's agent instructions explicitly favor mobile-first section editing, structured AI output, real persistence, server validation, and preview/published parity. See `AGENTS.md`.

---

# Phase 0 — Baseline, inventory & architecture

## LP-T0.1 — Establish the landing-page code map

- [ ] Identify every landing-page screen/component in `buynow/src/app/App.tsx`.
- [ ] Identify all landing-page-specific types currently embedded in `App.tsx`.
- [ ] Identify all landing-page API calls and persistence paths.
- [ ] Identify all preview renderers and public renderers.
- [ ] Identify all media upload/replacement paths.
- [ ] Identify all AI generation paths.
- [ ] Identify all landing-page-specific CSS/styling primitives.
- [ ] Document the current page lifecycle: create → save → open → edit → preview → publish.
- [ ] Document known legacy compatibility behavior.

**Done when:** there is a clear map of the existing landing-page implementation and no new abstraction is introduced without understanding the existing one.

## LP-T0.2 — Define canonical landing-page document contract

- [ ] Review `backend/src/schemas/conversionBuilder.ts` against all current frontend output.
- [ ] Identify unsupported section types.
- [ ] Identify unsupported block types.
- [ ] Identify settings that are currently free-form but need typed schemas.
- [ ] Define schema version migration strategy.
- [ ] Define design-specification schema.
- [ ] Define responsive layout schema.
- [ ] Define image-treatment schema.
- [ ] Define AI metadata schema.
- [ ] Define conversion/CTA metadata schema.
- [ ] Define backward-compatible defaults.
- [ ] Add schema fixtures for representative landing pages.

**Done when:** a single versioned document can represent every supported landing-page feature without relying on undocumented frontend assumptions.

---

# Phase 1 — Extract the landing-page experience from the legacy app shell

## LP-T1.1 — Landing Page domain module

- [ ] Create a dedicated landing-page feature directory.
- [ ] Move landing-page types out of `App.tsx`.
- [ ] Move landing-page creation logic out of `App.tsx`.
- [ ] Move landing-page editor logic out of `App.tsx`.
- [ ] Move landing-page preview logic out of `App.tsx`.
- [ ] Move landing-page API helpers into dedicated modules.
- [ ] Preserve existing navigation behavior while extracting code.
- [ ] Add tests before/after extraction to prevent regressions.

**Do not:** rewrite `App.tsx` wholesale. Extract incrementally.

## LP-T1.2 — Page state model

- [ ] Define explicit page states: loading, creating, draft, saving, saved, publishing, published, error, recovery.
- [ ] Separate server document from transient editor state.
- [ ] Track dirty state.
- [ ] Track save status.
- [ ] Handle concurrent/late save responses safely.
- [ ] Recover from refresh.
- [ ] Recover from malformed legacy documents.
- [ ] Preserve last known good document after failed mutations.

## LP-T1.3 — Page list / management

- [ ] Load real pages from `/api/pages`.
- [ ] Display landing-page status.
- [ ] Display last updated information.
- [ ] Open page directly into preview/edit state.
- [ ] Rename page.
- [ ] Duplicate page.
- [ ] Delete page with confirmation.
- [ ] Publish/unpublish state.
- [ ] Search/filter pages.
- [ ] Show useful page thumbnail/preview.
- [ ] Avoid placeholder/sample pages being treated as production data.

---

# Phase 2 — AI-first landing-page creation

## LP-T2.1 — Replace template-first creation with AI-first creation

- [ ] Make "Build a page" the primary landing-page creation path.
- [ ] Ask for offer/business description.
- [ ] Ask for target audience.
- [ ] Ask for desired result/outcome.
- [ ] Ask for primary CTA.
- [ ] Ask for conversion goal.
- [ ] Ask for traffic source when useful.
- [ ] Ask for traffic temperature when useful.
- [ ] Allow optional ad copy/creative input.
- [ ] Allow optional brand/voice input.
- [ ] Allow optional form connection.
- [ ] Allow optional VSL.
- [ ] Allow optional product/Buy Now connection.
- [ ] Allow assets to be uploaded during creation.
- [ ] Keep the minimum required input small.

## LP-T2.2 — AI strategy generation

- [ ] Create structured landing-page strategy output.
- [ ] Determine conversion objective.
- [ ] Determine recommended architecture.
- [ ] Determine section sequence.
- [ ] Determine CTA strategy.
- [ ] Determine trust strategy.
- [ ] Determine visual direction.
- [ ] Determine required/optional content.
- [ ] Preserve authoritative user-provided facts.
- [ ] Mark assumptions instead of inventing facts.

## LP-T2.3 — AI design specification

- [ ] Generate visual direction.
- [ ] Generate color palette.
- [ ] Generate typography hierarchy.
- [ ] Generate spacing/rhythm rules.
- [ ] Generate radius/shadow rules.
- [ ] Generate content width/grid behavior.
- [ ] Generate section layout variants.
- [ ] Generate image treatments.
- [ ] Generate CTA treatment.
- [ ] Generate responsive rules.
- [ ] Store design specification in the versioned page document.
- [ ] Validate AI output with Zod.
- [ ] Add deterministic fallback when AI generation fails.

**Critical requirement:** users do not manually configure any of these design-system foundations.

---

# Phase 3 — Professional design primitives

## LP-T3.1 — Typography system

- [ ] Add typed heading/display/body/caption styles.
- [ ] Add responsive type scale.
- [ ] Add line-height rules.
- [ ] Add weight rules.
- [ ] Add letter-spacing rules.
- [ ] Add readable text-width constraints.
- [ ] Add long-headline safeguards.
- [ ] Ensure typography choices remain accessible.

## LP-T3.2 — Color system

- [ ] Add primary/secondary/accent roles.
- [ ] Add background/surface roles.
- [ ] Add text/muted roles.
- [ ] Add success/warning/error roles where required.
- [ ] Validate contrast.
- [ ] Generate palette from brand assets where possible.
- [ ] Provide deterministic fallback palettes.

## LP-T3.3 — Layout system

- [ ] Typed page container widths.
- [ ] Typed content widths.
- [ ] Responsive grids.
- [ ] Section spacing scale.
- [ ] Card spacing.
- [ ] Alignment rules.
- [ ] Vertical rhythm.
- [ ] Full-bleed behavior.
- [ ] Safe-area handling.
- [ ] Overflow protection.

## LP-T3.4 — Surface/component system

- [ ] Buttons.
- [ ] Links.
- [ ] Badges.
- [ ] Cards.
- [ ] Media frames.
- [ ] Dividers.
- [ ] Testimonial cards.
- [ ] Before/after cards.
- [ ] Pricing/offer cards.
- [ ] FAQ rows.
- [ ] Navigation.
- [ ] Footer.

**Done when:** AI composes professional pages from controlled primitives rather than generating arbitrary styling.

---

# Phase 4 — Section architecture & variants

## LP-T4.1 — Hero

- [ ] Editorial split.
- [ ] Full-bleed image.
- [ ] Image-background hero.
- [ ] Centered hero.
- [ ] Product/offer hero.
- [ ] Video-led hero.
- [ ] Mobile-specific composition rules.
- [ ] CTA hierarchy.
- [ ] Trust/credibility support.

## LP-T4.2 — Content / benefits / features

- [ ] Editorial content.
- [ ] Three-card benefits.
- [ ] Four-card benefits.
- [ ] Icon grid.
- [ ] Numbered benefits.
- [ ] Feature comparison.
- [ ] Mobile stacking rules.

## LP-T4.3 — Social proof

- [ ] Quote.
- [ ] Testimonial cards.
- [ ] Results grid.
- [ ] Metrics.
- [ ] Before/after.
- [ ] Logo strip.
- [ ] User-supplied proof only.
- [ ] Mobile carousel/stack behavior where appropriate.

## LP-T4.4 — VSL

- [ ] First-class VSL section.
- [ ] Supported URL validation.
- [ ] Thumbnail/poster behavior.
- [ ] Aspect-ratio handling.
- [ ] Play interaction.
- [ ] Loading/error state.
- [ ] Post-video CTA.
- [ ] Analytics event.
- [ ] Mobile-first presentation.

## LP-T4.5 — Offer / pricing

- [ ] Offer summary.
- [ ] Price presentation.
- [ ] Benefits.
- [ ] Guarantee when supplied.
- [ ] CTA connection.
- [ ] Product connection.
- [ ] Form/application connection.
- [ ] Server-authoritative price references.

## LP-T4.6 — FAQ / CTA / footer

- [ ] FAQ accordion.
- [ ] Accessible disclosure behavior.
- [ ] AI-generated FAQ from known facts.
- [ ] CTA variants.
- [ ] Final CTA.
- [ ] Footer/social links.
- [ ] Legal links where required.

---

# Phase 5 — Fitness Coach flagship design

## LP-T5.1 — Fitness strategy profile

- [ ] Fitness coach/challenge strategy profile.
- [ ] 6-week challenge architecture.
- [ ] Coaching/application architecture.
- [ ] Before/after proof architecture.
- [ ] VSL-first architecture.
- [ ] Strong mobile CTA architecture.

## LP-T5.2 — Fitness page inputs

- [ ] Title.
- [ ] Subtitle.
- [ ] Coach/brand identity.
- [ ] VSL.
- [ ] Form URL/reference.
- [ ] Before photos.
- [ ] After photos.
- [ ] Testimonials.
- [ ] Program details.
- [ ] Offer/pricing where supplied.
- [ ] Trust/credentials where supplied.

## LP-T5.3 — Fitness art direction

- [ ] High-impact hero.
- [ ] Premium fitness visual treatment.
- [ ] Strong image composition.
- [ ] Before/after composition.
- [ ] Testimonial treatment.
- [ ] VSL presentation.
- [ ] CTA repetition based on conversion strategy.
- [ ] Mobile sticky/floating CTA where appropriate.

**Acceptance test:** a fitness coach can provide their offer and assets and receive a polished, professional challenge page without selecting or configuring a design system.

---

# Phase 6 — Media & image intelligence

## LP-T6.1 — Media library integration

- [ ] Upload from device.
- [ ] Paste URL.
- [ ] Browse existing media.
- [ ] Replace media.
- [ ] Remove media.
- [ ] Reuse media.
- [ ] Upload progress.
- [ ] Upload error/retry.
- [ ] Alt text.
- [ ] Image metadata.

## LP-T6.2 — Image editing

- [ ] Crop.
- [ ] Focal point.
- [ ] Fit/fill.
- [ ] Position.
- [ ] Aspect ratio.
- [ ] Background image.
- [ ] Overlay.
- [ ] Gradient.
- [ ] Mobile crop override when required.

## LP-T6.3 — AI image placement

- [ ] Score images for hero suitability.
- [ ] Detect portrait/landscape suitability.
- [ ] Choose crop/focal point.
- [ ] Choose foreground/background treatment.
- [ ] Avoid repetitive image use.
- [ ] Build before/after layouts.
- [ ] Build editorial/offset compositions.
- [ ] Preserve user control to replace any choice.

---

# Phase 7 — Mobile editing experience

## LP-T7.1 — Direct section editing

- [ ] Tap visible section to select it.
- [ ] Make selected state obvious.
- [ ] Open focused editor sheet.
- [ ] Return to page without losing context.
- [ ] Edit section text.
- [ ] Edit images.
- [ ] Edit buttons/links.
- [ ] Edit VSL.
- [ ] Edit forms.
- [ ] Edit product connection.

## LP-T7.2 — Section management

- [ ] Add section.
- [ ] Duplicate.
- [ ] Reorder.
- [ ] Hide/show.
- [ ] Delete.
- [ ] Restore deleted section.
- [ ] Section preview thumbnails.

## LP-T7.3 — Mobile editor interaction

- [ ] Bottom sheets.
- [ ] Full-screen focused editors where useful.
- [ ] Thumb-reachable primary actions.
- [ ] Large touch targets.
- [ ] Keyboard-safe layout.
- [ ] Sticky save/publish controls where appropriate.
- [ ] Clear autosave state.
- [ ] No desktop property panel as primary interaction.

---

# Phase 8 — AI-assisted editing

## LP-T8.1 — One-tap AI improvements

- [ ] Make it more premium.
- [ ] Improve conversion.
- [ ] Improve mobile.
- [ ] Improve copy.
- [ ] Improve image placement.
- [ ] Change visual direction.
- [ ] Strengthen CTA.
- [ ] Simplify page.
- [ ] Improve trust.
- [ ] Replace weak section.

## LP-T8.2 — Section AI

- [ ] Rewrite section.
- [ ] Generate alternative section.
- [ ] Change section layout.
- [ ] Suggest image treatment.
- [ ] Suggest CTA.
- [ ] Generate FAQ.
- [ ] Improve headline.
- [ ] Generate benefits.

## LP-T8.3 — AI safety

- [ ] Preview mutations where appropriate.
- [ ] Validate generated document.
- [ ] Preserve authoritative user data.
- [ ] Never invent results/testimonials/pricing/guarantees.
- [ ] Undo AI changes.
- [ ] Record AI operation metadata.

---

# Phase 9 — Responsive rendering & preview parity

## LP-T9.1 — Responsive renderer

- [ ] Mobile-first composition.
- [ ] Tablet composition.
- [ ] Desktop composition.
- [ ] Responsive typography.
- [ ] Responsive spacing.
- [ ] Grid behavior.
- [ ] Image crop behavior.
- [ ] VSL sizing.
- [ ] Button wrapping.
- [ ] Long-content safeguards.
- [ ] Overflow detection.

## LP-T9.2 — Preview

- [ ] Immediate preview after creation.
- [ ] Mobile preview.
- [ ] Tablet preview.
- [ ] Desktop preview.
- [ ] Edit from preview.
- [ ] Return to preview.
- [ ] Refresh recovery.
- [ ] Error boundary.
- [ ] No blank white screen.
- [ ] No "saved but editor failed" state without recovery details.

## LP-T9.3 — Published parity

- [ ] Same versioned document drives preview/public rendering.
- [ ] Published revision isolation.
- [ ] Verify media URLs.
- [ ] Verify public page after refresh.
- [ ] Verify old published revision is not changed by draft edits.
- [ ] Add automated parity tests.

---

# Phase 10 — Conversion connections

## LP-T10.1 — Forms

- [ ] Select existing form.
- [ ] Create form from landing-page flow.
- [ ] Render real form block.
- [ ] Validate form reference.
- [ ] Track form CTA clicks.
- [ ] Track form starts.
- [ ] Track submissions.

## LP-T10.2 — Products / Buy Now

- [ ] Select existing product.
- [ ] Create product from page flow where appropriate.
- [ ] Render real product block.
- [ ] Connect CTA to Buy Now page.
- [ ] Validate product reference.
- [ ] Preserve server-authoritative pricing.
- [ ] Track product view/checkout/purchase funnel.

## LP-T10.3 — CTA/action system

- [ ] URL action.
- [ ] Form action.
- [ ] Product action.
- [ ] Buy Now action.
- [ ] Validate links.
- [ ] Prevent dead/fake CTA buttons.
- [ ] Support contextual CTA labels.

---

# Phase 11 — SEO, sharing & public production

## LP-T11.1 — SEO

- [ ] SEO title.
- [ ] Meta description.
- [ ] Canonical URL.
- [ ] Structured page metadata where appropriate.
- [ ] Semantic headings.
- [ ] Indexing controls.

## LP-T11.2 — Sharing

- [ ] Open Graph title.
- [ ] Open Graph description.
- [ ] Open Graph image.
- [ ] Social preview.
- [ ] Favicon/brand image.
- [ ] Share URL.

## LP-T11.3 — Production performance

- [ ] Image optimization.
- [ ] Responsive images.
- [ ] Lazy loading.
- [ ] Video loading strategy.
- [ ] Font loading strategy.
- [ ] Avoid layout shift.
- [ ] Public bundle optimization.
- [ ] Core Web Vitals baseline.

---

# Phase 12 — Analytics & CRO feedback loop

## LP-T12.1 — Landing-page events

- [ ] Page view.
- [ ] Section view where useful.
- [ ] CTA click.
- [ ] VSL play.
- [ ] Form start.
- [ ] Form submission.
- [ ] Product view.
- [ ] Checkout start.
- [ ] Purchase/conversion.

## LP-T12.2 — Attribution

- [ ] UTM capture.
- [ ] Source.
- [ ] Medium.
- [ ] Campaign.
- [ ] Content.
- [ ] Landing-page attribution.
- [ ] Conversion attribution.

## LP-T12.3 — AI optimization

- [ ] Identify weak conversion points from real data.
- [ ] Recommend CTA changes.
- [ ] Recommend section changes.
- [ ] Recommend copy changes.
- [ ] Recommend image changes.
- [ ] Recommend mobile improvements.
- [ ] Generate A/B test ideas.
- [ ] Never fabricate analytics conclusions when data is insufficient.

---

# Phase 13 — Accessibility & quality

## LP-T13.1 — Accessibility

- [ ] Semantic heading hierarchy.
- [ ] Keyboard navigation.
- [ ] Focus states.
- [ ] Accessible buttons/links.
- [ ] Alt text.
- [ ] Video accessibility.
- [ ] Color contrast.
- [ ] Reduced-motion support.
- [ ] Form accessibility.

## LP-T13.2 — Error/recovery states

- [ ] Creation error.
- [ ] AI generation failure.
- [ ] AI timeout.
- [ ] Media upload failure.
- [ ] Invalid media URL.
- [ ] Missing form.
- [ ] Missing product.
- [ ] Invalid builder document.
- [ ] Failed autosave.
- [ ] Failed publish.
- [ ] Missing page.
- [ ] Malformed legacy page.
- [ ] Recovery to last saved document.

## LP-T13.3 — Visual regression

- [ ] Gold-standard fitness page snapshot.
- [ ] Mobile screenshot baseline.
- [ ] Tablet screenshot baseline.
- [ ] Desktop screenshot baseline.
- [ ] Long headline fixture.
- [ ] Long-copy fixture.
- [ ] Missing-media fixture.
- [ ] VSL fixture.
- [ ] Before/after fixture.
- [ ] Form fixture.
- [ ] Product fixture.
- [ ] Preview/public parity fixture.

---

# Phase 14 — Design intelligence evaluation

## LP-T14.1 — Automated design audit

- [ ] Visual hierarchy score.
- [ ] Typography score.
- [ ] Spacing/rhythm score.
- [ ] Image composition score.
- [ ] Brand consistency score.
- [ ] Mobile usability score.
- [ ] Conversion-path score.
- [ ] Trust score.
- [ ] Ad/message-match score.
- [ ] Accessibility score.
- [ ] Performance score.

## LP-T14.2 — Golden examples

- [ ] Maintain professional reference pages.
- [ ] Maintain good/bad design examples.
- [ ] Compare generated documents against approved patterns.
- [ ] Track recurring AI design failures.
- [ ] Improve deterministic rules/components.
- [ ] Add regression fixtures for every discovered failure mode.

---

# Phase 15 — Launch readiness

## LP-T15.1 — End-to-end acceptance test

A first-time entrepreneur must be able to complete this flow from a mobile device:

`Create → Describe offer → Add audience/goal → Upload photos → Add VSL → Connect form/product → AI generates design → Preview → Tap section → Edit → Replace image → AI improve → Preview → Publish → Open public URL`

- [ ] Complete flow works without desktop-only interaction.
- [ ] No manual Figma/design-system work.
- [ ] No template selection required for the AI path.
- [ ] All data persists after refresh.
- [ ] Preview works immediately after generation.
- [ ] Public URL renders correctly.
- [ ] Form/product connections work.
- [ ] Analytics events fire.
- [ ] Error recovery works.

## LP-T15.2 — 15-minute test

- [ ] New user can reach a publishable page in approximately 15 minutes.
- [ ] User understands every step without design terminology.
- [ ] User can replace any important asset.
- [ ] User can edit every visible section.
- [ ] User can request AI improvements without losing work.
- [ ] Result looks professionally designed rather than template-assembled.

## LP-T15.3 — Production gate

- [ ] TypeScript/build passes.
- [ ] Backend tests pass.
- [ ] Frontend tests pass.
- [ ] Schema tests pass.
- [ ] AI validation tests pass.
- [ ] Public rendering tests pass.
- [ ] Visual regression tests pass.
- [ ] Accessibility checks pass.
- [ ] Performance baseline passes.
- [ ] No known blank-screen/editor-crash path remains.

---

# Execution order

### Sprint 1 — Stabilize the foundation

`T0 → T1 → T2`

Get the current landing-page implementation understood, modularized, persistent, and AI-first.

### Sprint 2 — Build the design engine

`T3 → T4`

Create the professional design primitives and section variants that AI can safely compose.

### Sprint 3 — Build the flagship

`T5 → T6`

Make the fitness coach / 6-week challenge page the gold-standard reference and make media handling excellent.

### Sprint 4 — Make mobile editing excellent

`T7 → T8`

Users can directly edit anything and ask AI to improve anything without learning design tools.

### Sprint 5 — Make rendering production-grade

`T9 → T11`

Responsive behavior, preview parity, real form/product connections, SEO, sharing, and public performance.

### Sprint 6 — Close the conversion loop

`T12 → T14`

Analytics, CRO recommendations, accessibility, visual regression, and automated design evaluation.

### Sprint 7 — Launch gate

`T15`

Run the complete entrepreneur journey and fix every failure before calling the Landing Page Builder production-ready.

---

# Definition of Done

The landing-page system is ready for serious production use when:

- [ ] AI does the design work instead of the entrepreneur.
- [ ] Figma knowledge has been encoded into product behavior rather than exposed as a workflow.
- [ ] The creation flow starts from the user's business/offer and can generate a complete page without template hunting.
- [ ] Pages are beautiful on mobile first and intentionally responsive on larger screens.
- [ ] Users can tap and edit every meaningful section.
- [ ] Users can upload or replace images anywhere.
- [ ] AI can generate, rewrite, critique, and improve the page.
- [ ] VSL, forms, products, and Buy Now actions are real connections.
- [ ] Preview and public rendering are consistent.
- [ ] Drafts survive refresh and failures.
- [ ] Pages are accessible, fast, SEO-ready, and shareable.
- [ ] Conversion events are measurable.
- [ ] AI can use real conversion data to recommend improvements.
- [ ] Visual regression protects the design quality.
- [ ] The complete journey works from a mobile device.
- [ ] A non-designer can publish a professional ad landing page in roughly 15 minutes.
