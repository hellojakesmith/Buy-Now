# Buy Now — Landing Page Design & Development Roadmap

> Design and engineering execution plan for the flagship landing-page experience.
>
> This roadmap exists because the current builder is functionally usable but the rendered result still looks like a stack of UI cards rather than a professionally art-directed conversion page. The goal is not to add arbitrary visual effects. The goal is to establish a real design system, responsive composition model, reusable section variants, and AI design orchestration that can consistently produce professional pages from a phone.

## 0. Current State — Reviewed Against `main`

Current `main` includes the post-create preview flow from PR #32 and the document-safety fixes from PR #31.

The current implementation already provides:

- AI-generated landing-page creation.
- A saved canonical `builderDocument`.
- Document normalization before preview/editing.
- Preview-first creation flow.
- Mobile/tablet/desktop preview modes.
- Section-based mobile editor.
- Section add/edit/reorder/hide/delete behavior.
- VSL support.
- Image replacement through starter media or URL.
- Curated template media.
- Autosave/save state foundations.
- Shared renderer used by preview.

The current visual implementation is intentionally simple and is now the limiting factor. The renderer currently uses a narrow `max-w-2xl` single-column composition, fixed section shells, limited template-level variants, mostly fixed typography sizes, fixed image heights, and card-like containers. The editor is a section list with focused editors rather than a true visual composition system. This is a useful foundation, but it does not yet provide the design quality bar we want.

## 1. Design North Star

A user should be able to upload real content and say:

> "Build me a landing page for my business."

and receive a page that looks like it was professionally designed in Figma and implemented by an experienced frontend designer.

### Quality bar

- Strong visual hierarchy.
- Intentional typography.
- Professional spacing rhythm.
- Distinctive but controlled art direction.
- High-quality image composition.
- Clear conversion narrative.
- Responsive behavior designed intentionally, not merely shrunk.
- Consistent components and tokens.
- Real connected forms/products/CTAs.
- Accessible and fast.
- Easy to edit from a phone.

### Design principle

**AI chooses from a controlled design system; AI does not invent arbitrary HTML/CSS.**

The generation pipeline should be:

`Business context → page strategy → design system → section architecture → section variants → content → assets → responsive rules → renderer`

---

# DESIGN ROADMAP

## D1 — Figma Foundations & Design Tokens

**Goal:** Establish the visual language before rebuilding page sections.

### Figma deliverables

- [ ] Create a dedicated Buy Now Landing Page Design System file/page.
- [ ] Define 390px mobile frame as the primary design reference.
- [ ] Define tablet reference frame.
- [ ] Define 1440px desktop reference frame.
- [ ] Define content max-widths.
- [ ] Define mobile/tablet/desktop grid rules.
- [ ] Define horizontal page padding tokens.
- [ ] Define section spacing scale.
- [ ] Define component spacing scale.
- [ ] Define typography scale.
- [ ] Define heading/body/label styles.
- [ ] Define font-weight rules.
- [ ] Define letter-spacing rules.
- [ ] Define color roles rather than page-specific colors.
- [ ] Define surface/background/elevated surface roles.
- [ ] Define border and divider roles.
- [ ] Define button radius/height/padding tokens.
- [ ] Define card radius tokens.
- [ ] Define shadow/elevation tokens.
- [ ] Define image radius/crop tokens.
- [ ] Define accessibility contrast rules.

### Engineering mapping

- [ ] Create a versioned design-token schema.
- [ ] Map Figma tokens to renderer CSS variables/classes.
- [ ] Remove hard-coded visual values from shared renderers where a token applies.
- [ ] Add schema versioning for design tokens.
- [ ] Define safe defaults for older saved documents.

### Exit gate

The same token names and values can be referenced by Figma designs, generated page specifications, and the React renderer.

---

## D2 — Core Component Library

**Goal:** Build a Figma component system that maps directly to reusable frontend components.

### Components

- [ ] Navigation/header.
- [ ] Announcement bar.
- [ ] Eyebrow/kicker.
- [ ] Display heading.
- [ ] Body copy.
- [ ] Primary button.
- [ ] Secondary button.
- [ ] Text/link button.
- [ ] Icon button.
- [ ] Badge.
- [ ] Stat.
- [ ] Trust signal.
- [ ] Image frame.
- [ ] Video frame.
- [ ] Testimonial card.
- [ ] Before/after card.
- [ ] Benefit card.
- [ ] Feature card.
- [ ] Offer card.
- [ ] Pricing block.
- [ ] FAQ item.
- [ ] Form CTA.
- [ ] Product card.
- [ ] Guarantee/trust block.
- [ ] Social link group.
- [ ] Footer.

### Variants

- [ ] Button: primary/secondary/outline/ghost.
- [ ] Button: small/medium/large.
- [ ] Button: icon/no-icon.
- [ ] Image: portrait/landscape/square/full-bleed.
- [ ] Card: bordered/elevated/flat.
- [ ] FAQ: compact/large.
- [ ] Testimonial: quote/result/before-after.
- [ ] Section content: left/center/right alignment.

### Exit gate

Every major visual primitive used by a landing page has a Figma component and a corresponding renderer component/variant.

---

## D3 — Section Composition System

**Goal:** Stop rendering every section as a generic card and introduce intentional page composition.

### Hero variants

- [ ] Editorial split.
- [ ] Full-bleed image.
- [ ] Image background.
- [ ] Dark/high-contrast.
- [ ] Minimal text-first.
- [ ] Product/offer hero.
- [ ] Fitness transformation hero.

### Social proof variants

- [ ] Logo strip.
- [ ] Stat strip.
- [ ] Quote cards.
- [ ] Before/after.
- [ ] Results grid.
- [ ] Testimonial carousel-ready model.

### Benefits variants

- [ ] Three-card grid.
- [ ] Four-card grid.
- [ ] Icon/value grid.
- [ ] Editorial alternating layout.
- [ ] Numbered outcomes.

### VSL variants

- [ ] Large cinematic video.
- [ ] Video + supporting copy.
- [ ] Video + benefits.
- [ ] Video + CTA.

### Offer variants

- [ ] Simple offer.
- [ ] Premium offer.
- [ ] Pricing card.
- [ ] Product offer.
- [ ] Coaching offer.

### CTA variants

- [ ] Full-width conversion block.
- [ ] Split CTA.
- [ ] Dark CTA.
- [ ] Image-backed CTA.
- [ ] Minimal CTA.

### Exit gate

A page can use different section variants without changing the canonical section schema or introducing page-specific renderer hacks.

---

## D4 — Image Art Direction System

**Goal:** Make uploaded and starter images look intentionally designed rather than simply inserted into rectangles.

### Image treatments

- [ ] Full bleed.
- [ ] Editorial crop.
- [ ] Portrait crop.
- [ ] Rounded frame.
- [ ] Asymmetric collage.
- [ ] Overlapping image composition.
- [ ] Background image with readable overlay.
- [ ] Before/after comparison.
- [ ] Image + text split.
- [ ] Floating image/card treatment.

### Editing controls

- [ ] Upload from device.
- [ ] Use URL.
- [ ] Choose starter image.
- [ ] Replace image.
- [ ] Crop/focal point.
- [ ] Choose image treatment.
- [ ] Set alt text.
- [ ] Remove image.
- [ ] Reuse uploaded asset.
- [ ] Preview optimized crop.

### AI behavior

- [ ] Classify image role.
- [ ] Recommend hero image.
- [ ] Detect likely before/after pairs.
- [ ] Recommend portrait vs landscape treatment.
- [ ] Recommend focal point.
- [ ] Detect low-quality/mismatched assets.
- [ ] Warn when an image conflicts with the selected design direction.

### Exit gate

A creator can upload six arbitrary photos and the system can place them into coherent hero, supporting, and proof treatments without manual resizing.

---

## D5 — Responsive Design System

**Goal:** Design mobile first while preserving high-quality tablet and desktop compositions.

### Mobile

- [ ] 390px reference layout.
- [ ] One-handed editing controls.
- [ ] 20px-ish content gutters tokenized.
- [ ] Large touch targets.
- [ ] Sticky primary editor actions.
- [ ] Intentional mobile typography.
- [ ] Mobile image crops.
- [ ] Mobile section ordering rules.
- [ ] Mobile-safe video embeds.

### Tablet

- [ ] 768px reference.
- [ ] Two-column opportunities where useful.
- [ ] Tablet typography scale.
- [ ] Tablet image treatments.

### Desktop

- [ ] 1200–1280px content system.
- [ ] 12-column grid.
- [ ] Split hero layouts.
- [ ] Editorial asymmetry.
- [ ] Larger typography.
- [ ] Wider video and proof sections.
- [ ] Desktop navigation where appropriate.

### Engineering

- [ ] Replace fixed section widths with responsive layout primitives.
- [ ] Add section-level responsive configuration only where necessary.
- [ ] Avoid storing arbitrary CSS values in page documents.
- [ ] Add renderer tests at 390px, 768px, and 1440px.

### Exit gate

The same page feels intentionally designed at all three reference widths rather than looking like a mobile card stack enlarged on desktop.

---

## D6 — Gold-Standard Fitness Coach Page

**Goal:** Prove the system with the highest-priority fitness coaching use case.

### Figma page structure

- [ ] Announcement/navigation.
- [ ] Hero.
- [ ] Trust/stat strip.
- [ ] VSL.
- [ ] Problem/solution narrative.
- [ ] Benefits.
- [ ] Before/after results.
- [ ] Program contents.
- [ ] Offer/pricing.
- [ ] Guarantee/trust.
- [ ] FAQ.
- [ ] Final CTA.
- [ ] Footer.

### Content requirements

- [ ] Title.
- [ ] Subtitle.
- [ ] VSL.
- [ ] Form CTA.
- [ ] Before/after images.
- [ ] Testimonials.
- [ ] Benefits.
- [ ] Offer details.
- [ ] FAQ.
- [ ] Strong final CTA.

### Exit gate

The 390px Figma version looks like a premium fitness coaching sales page and can be reproduced by the production renderer without one-off CSS.

---

# DEVELOPMENT ROADMAP

## V1 — Design Token Runtime

**Goal:** Make design decisions data-driven.

- [ ] Define `DesignSystem`/theme schema.
- [ ] Add token version.
- [ ] Add color roles.
- [ ] Add typography roles.
- [ ] Add spacing scale.
- [ ] Add radius scale.
- [ ] Add shadow scale.
- [ ] Add button variants.
- [ ] Add container/grid tokens.
- [ ] Normalize legacy documents into tokenized defaults.
- [ ] Add schema tests.

**Acceptance:** Existing pages render unchanged or better after token migration.

---

## V2 — Renderer Composition Engine

**Goal:** Replace generic card stacking with reusable layout primitives.

- [ ] Create container primitive.
- [ ] Create stack/cluster/grid primitives.
- [ ] Create split layout primitive.
- [ ] Create editorial overlap primitive.
- [ ] Create full-bleed primitive.
- [ ] Create media frame primitive.
- [ ] Create responsive typography helpers.
- [ ] Create section spacing helpers.
- [ ] Create section variant registry.
- [ ] Create component/variant validation.
- [ ] Preserve canonical `builderDocument` structure.

**Acceptance:** New section designs can be composed from existing primitives without writing page-specific layout code.

---

## V3 — Premium Section Renderer

**Goal:** Implement the Figma section library in React.

- [ ] Premium Hero renderer.
- [ ] Trust strip renderer.
- [ ] Benefits variants.
- [ ] VSL variants.
- [ ] Before/after renderer.
- [ ] Testimonial renderer.
- [ ] Offer renderer.
- [ ] Pricing renderer.
- [ ] Guarantee renderer.
- [ ] FAQ renderer.
- [ ] CTA variants.
- [ ] Footer renderer.

**Acceptance:** Fitness gold-standard page renders without generic section cards.

---

## V4 — Mobile Editor UX 2.0

**Goal:** Make editing feel like a mobile design tool without becoming Figma-on-a-phone.

### Primary editing model

- [ ] Tap section to open focused editor.
- [ ] Show live preview of selected section.
- [ ] Edit text inline or in focused controls.
- [ ] Replace image from device.
- [ ] Choose starter image.
- [ ] Paste image URL.
- [ ] Crop/focal point.
- [ ] Change section variant.
- [ ] Change alignment.
- [ ] Change theme preset.
- [ ] Duplicate section.
- [ ] Reorder sections.
- [ ] Hide/show section.
- [ ] Delete section with confirmation.
- [ ] Undo/redo.
- [ ] Autosave.
- [ ] Save/recovery state.

### Mobile interaction rules

- [ ] Bottom sheets for focused configuration.
- [ ] No dense desktop sidebars.
- [ ] Minimum 44px touch targets.
- [ ] Sticky primary action.
- [ ] Keyboard-safe editing.
- [ ] Unsaved-change protection.

**Acceptance:** A new user can edit hero copy, replace a photo, change a section variant, reorder a section, and preview the result without leaving the mobile workflow.

---

## V5 — Preview / Published Parity

**Goal:** Make preview trustworthy.

- [ ] Preview uses the exact published renderer.
- [ ] Mobile/tablet/desktop previews use the same schema.
- [ ] Preview reflects uploaded assets.
- [ ] Preview reflects connected forms/products.
- [ ] Preview handles invalid/missing optional data gracefully.
- [ ] Add visual regression snapshots for golden pages.
- [ ] Add published-page smoke tests.

**Acceptance:** What the creator approves in preview is materially the same experience a visitor receives.

---

## V6 — AI Design Director

**Goal:** Make AI responsible for design decisions, not just copy generation.

### Inputs

- [ ] Business description.
- [ ] Audience.
- [ ] Offer.
- [ ] Conversion goal.
- [ ] Uploaded images.
- [ ] Existing brand colors/logo where available.
- [ ] Connected form/product.

### AI outputs

- [ ] Page strategy.
- [ ] Recommended visual direction.
- [ ] Design token preset.
- [ ] Section architecture.
- [ ] Section variants.
- [ ] Image roles.
- [ ] Copy hierarchy.
- [ ] CTA strategy.
- [ ] Proof strategy.
- [ ] SEO metadata.

### AI actions

- [ ] Generate first draft.
- [ ] “Make it more premium.”
- [ ] “Make it more modern.”
- [ ] “Make it feel more athletic.”
- [ ] “Make the CTA stronger.”
- [ ] “Improve the hierarchy.”
- [ ] “Use my photos better.”
- [ ] “Make mobile better.”
- [ ] “Make this look more expensive.”
- [ ] “Simplify this page.”

### Guardrails

- [ ] Structured output only.
- [ ] Validate against page/design schemas.
- [ ] Never generate executable code.
- [ ] Never invent testimonials or results presented as real.
- [ ] Never alter authoritative prices silently.
- [ ] Preview changes before persistence.
- [ ] Keep generated assumptions visible.

**Acceptance:** AI can redesign a page using the design system without producing invalid renderer documents or arbitrary CSS.

---

## V7 — Conversion-Aware Design QA

**Goal:** Automatically inspect generated pages before users publish them.

- [ ] Check headline hierarchy.
- [ ] Check CTA presence.
- [ ] Check CTA visibility.
- [ ] Check excessive section density.
- [ ] Check text length.
- [ ] Check image quality/aspect ratio.
- [ ] Check mobile overflow.
- [ ] Check contrast.
- [ ] Check missing form/product connection.
- [ ] Check missing trust elements where relevant.
- [ ] Check missing offer details.
- [ ] Check FAQ/objection coverage.
- [ ] Check page loading weight.
- [ ] Produce actionable AI recommendations.

**Acceptance:** Before publish, Buy Now can identify common design/conversion problems and let the user fix them with one tap or AI assistance.

---

## V8 — Analytics + Experimentation Hooks

**Goal:** Connect design decisions to measurable outcomes.

- [ ] Section impression events where useful.
- [ ] CTA click events.
- [ ] VSL interaction events.
- [ ] Form start/submission events.
- [ ] Product view events.
- [ ] Checkout start events.
- [ ] Purchase events.
- [ ] Device-level performance breakdown.
- [ ] Section-level performance where privacy/volume permits.
- [ ] A/B variant metadata.
- [ ] Experiment assignment model.
- [ ] AI recommendation → result tracking.

**Acceptance:** The system can connect a design/section variant to measurable funnel outcomes.

---

# 2. Recommended Implementation Order

Do not build all visual features at once.

### Phase 1 — Design foundation

`D1 → D2`

Deliver Figma tokens and components first.

### Phase 2 — Layout engine

`D3 → D4 → D5` + `V1 → V2`

Translate the design system into renderer primitives.

### Phase 3 — Gold-standard page

`D6 + V3`

Build the fitness coach page as the first proof of quality.

### Phase 4 — Mobile editing

`V4 → V5`

Make the page easy to edit and trustworthy to preview.

### Phase 5 — AI design system

`V6 → V7`

Let AI choose design directions and perform quality checks.

### Phase 6 — Optimization

`V8`

Connect design choices to conversion outcomes.

---

# 3. Definition of Done — Landing Page Quality

A landing-page release is not complete because the renderer works.

It is complete when:

- [ ] A designer can approve the 390px Figma composition.
- [ ] The design maps to reusable tokens/components.
- [ ] The renderer reproduces the approved design.
- [ ] The page works at 390px, 768px, and desktop widths.
- [ ] Images can be uploaded/replaced easily.
- [ ] Sections can be edited/reordered without technical knowledge.
- [ ] Preview and published output share the same renderer rules.
- [ ] Connected CTAs actually work.
- [ ] Forms/products are real domain objects.
- [ ] Loading/error/empty/success states are handled.
- [ ] Accessibility basics pass.
- [ ] Visual regression tests exist for golden pages.
- [ ] AI output is schema-validated.
- [ ] AI never invents real-world proof/results.
- [ ] Page performance is acceptable on mobile.
- [ ] Analytics events support conversion measurement.
- [ ] Roadmap status is updated only after verification.

# 4. Gold-Standard Acceptance Test

A new creator should be able to complete this entirely from a phone:

`Describe offer → Upload 6 photos → Add VSL → Connect form → AI builds page → Review preview → Edit hero → Replace image → Edit results → Change design direction → Preview mobile → Preview desktop → Publish`

Target outcome:

**The final page should look professionally designed, not AI-assembled.**
