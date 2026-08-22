# Buy Now — Landing Page Design & Development Roadmap

> **North star:** Buy Now should take an entrepreneur's offer, audience, ad traffic, VSL, forms/products, and photos and automatically turn them into a beautiful, conversion-focused landing page. The entrepreneur should not have to know how to design a website.

This roadmap complements `PRODUCT_ROADMAP_CONVERSION_BUILDER.md` and is specifically focused on making Landing Pages the flagship Buy Now experience.

## Product principle: AI is the designer

The user should **never** have to manually create a Figma foundation, design system, grid, typography scale, spacing scale, breakpoint system, or component library.

Figma and professional design references are **internal inputs** for our team. We encode the knowledge behind those designs into Buy Now's AI, design tokens, layout primitives, components, and validation rules.

The intended flow is:

`Describe offer → Audience/goal → Upload assets → Add VSL/form/product → AI designs page → Preview → Edit → Improve with AI → Publish → Measure`

The entrepreneur supplies the business knowledge. **Buy Now supplies the design knowledge.**

### Core principles

- **AI-designed:** AI makes typography, color, layout, imagery, spacing, hierarchy, and responsive decisions.
- **Ad-first:** the landing page continues the promise, audience, and creative direction of the ad.
- **Mobile-first:** design the mobile experience first; desktop is composed from the same design intent.
- **Conversion-first:** every section has a purpose in the conversion journey.
- **Asset-first:** photos, video, testimonials, logos, and brand assets are first-class inputs.
- **Simple editing:** users edit content and sections without learning web design.
- **Structured output:** AI produces validated page data, never arbitrary executable frontend code.
- **Preview equals reality:** preview and published output share the same rendering contract.
- **Safe AI:** AI never invents customer results, pricing, guarantees, testimonials, analytics, or business facts.
- **15-minute launch:** a first-time entrepreneur should be able to reach a publishable page quickly.

---

# EPIC LP-1 — Ad & Conversion Strategy Engine

**Goal:** Determine what the page should accomplish before deciding how it should look.

### Inputs

- [ ] Offer/business description.
- [ ] Target audience.
- [ ] Desired outcome/promise.
- [ ] Primary CTA.
- [ ] Price, when applicable.
- [ ] Conversion objective: lead, application, call, product sale, course, event, waitlist, etc.
- [ ] Traffic source: Instagram, Facebook, TikTok, Google, other.
- [ ] Traffic temperature: cold, warm, existing audience.
- [ ] Ad copy/creative, when available.
- [ ] Brand voice.
- [ ] Photos/video.
- [ ] VSL.
- [ ] Form URL.
- [ ] Product/checkout connection.

### AI decisions

- [ ] Analyze audience.
- [ ] Analyze offer.
- [ ] Analyze ad promise.
- [ ] Determine conversion objective.
- [ ] Determine traffic temperature.
- [ ] Determine trust requirements.
- [ ] Choose page architecture.
- [ ] Choose section sequence.
- [ ] Determine CTA frequency.
- [ ] Determine visual direction.
- [ ] Preserve ad-to-page message match.

### Acceptance criteria

- AI can create a complete page without requiring the user to select a template first.
- Different offers/objectives produce different page architectures.
- The page's hero immediately reinforces the ad/offer promise.

---

# EPIC LP-2 — AI Design Intelligence System

**Goal:** Give Buy Now the knowledge of a professional product designer, brand designer, responsive web designer, and conversion designer.

### Design knowledge to encode

- [ ] Typography hierarchy.
- [ ] Font pairing.
- [ ] Display/headline/body sizing.
- [ ] Line height.
- [ ] Letter spacing.
- [ ] Color theory.
- [ ] Palette generation.
- [ ] Contrast/accessibility.
- [ ] Surface/background relationships.
- [ ] Spacing and visual rhythm.
- [ ] Grid/layout principles.
- [ ] Responsive composition.
- [ ] Image composition.
- [ ] Visual hierarchy.
- [ ] White space.
- [ ] CTA design.
- [ ] Trust-building patterns.
- [ ] Conversion UX.
- [ ] Above-the-fold optimization.
- [ ] Mobile interaction patterns.
- [ ] Ad-to-page continuity.
- [ ] Content-density rules.
- [ ] Section sequencing.

### AI-generated design specification

The AI should automatically produce a structured internal design specification containing:

- [ ] Visual direction.
- [ ] Color palette.
- [ ] Typography system.
- [ ] Spacing system.
- [ ] Radius/shadow system.
- [ ] Content width.
- [ ] Grid behavior.
- [ ] Section layouts.
- [ ] Image treatments.
- [ ] CTA treatment.
- [ ] Responsive rules.
- [ ] Motion/interaction guidance where supported.

The user should **not** need to configure these values manually.

### Figma's role

- [ ] Use Figma to create internal gold-standard references.
- [ ] Extract design principles from those references.
- [ ] Encode principles as Buy Now design rules.
- [ ] Encode approved layouts as application primitives.
- [ ] Use Figma for visual validation, not user configuration.

### Acceptance criteria

A user can provide an offer, audience, objective, and assets and Buy Now automatically determines the design system required for that page.

---

# EPIC LP-3 — Gold-Standard Fitness Coach Landing Page

**Goal:** Establish the first premium benchmark for generated pages.

### Fitness Coach / 6-Week Challenge

- [ ] 390px mobile reference.
- [ ] 768px tablet reference.
- [ ] 1440px desktop reference.
- [ ] Brand/navigation.
- [ ] High-impact hero.
- [ ] Title.
- [ ] Subtitle.
- [ ] Primary CTA.
- [ ] Credibility/trust strip.
- [ ] Problem → solution.
- [ ] VSL.
- [ ] Benefits.
- [ ] Before/after results.
- [ ] Testimonials.
- [ ] Program details.
- [ ] Offer/pricing/application.
- [ ] Objection handling.
- [ ] FAQ.
- [ ] Final CTA.
- [ ] Footer.

### Acceptance criteria

The result must look like a premium marketing page created by a professional designer—not a generic stack of cards. Mobile, tablet, and desktop must each feel intentionally composed.

---

# EPIC LP-4 — AI Design Primitives & Section Variants

**Goal:** Convert design intelligence into reliable primitives that AI can compose.

### Components

- [ ] Typography.
- [ ] Buttons.
- [ ] Links.
- [ ] Badges.
- [ ] Icon rows.
- [ ] Cards.
- [ ] Dividers.
- [ ] Media frames.
- [ ] Video/VSL frames.
- [ ] Testimonial cards.
- [ ] Before/after cards.
- [ ] Offer/pricing cards.
- [ ] FAQ rows.
- [ ] Navigation.
- [ ] Footer.

### Hero variants

- [ ] Editorial split.
- [ ] Full-bleed image.
- [ ] Image background.
- [ ] Centered minimal.
- [ ] Product/offer hero.
- [ ] Video-led hero.

### Benefits variants

- [ ] Three-card.
- [ ] Four-card.
- [ ] Icon grid.
- [ ] Editorial.
- [ ] Numbered.

### Social proof variants

- [ ] Quote.
- [ ] Testimonial cards.
- [ ] Results grid.
- [ ] Before/after.
- [ ] Metrics.
- [ ] Logo strip.

### Offer/CTA variants

- [ ] Lead CTA.
- [ ] Application CTA.
- [ ] Product CTA.
- [ ] Pricing card.
- [ ] Full-width CTA.

### Acceptance criteria

- AI selects variants through structured page data.
- Existing page documents remain renderable.
- Every variant has intentional mobile and desktop behavior.
- Users never need to understand the underlying token/variant system.

---

# EPIC LP-5 — AI Art Direction & Full-Page Generation

**Goal:** Make AI capable of acting as the page's art director and designer.

### AI decides

- [ ] Page architecture.
- [ ] Conversion objective.
- [ ] Section sequence.
- [ ] Visual direction.
- [ ] Theme.
- [ ] Typography pairing.
- [ ] Layout variants.
- [ ] Image treatment.
- [ ] CTA placement.
- [ ] Trust elements.
- [ ] Content hierarchy.
- [ ] Mobile composition.
- [ ] Brand expression.

### AI generation

- [ ] Full-page generation.
- [ ] Section generation.
- [ ] Headlines.
- [ ] Subtitles.
- [ ] Benefits.
- [ ] Problem/solution copy.
- [ ] Objection handling.
- [ ] FAQ.
- [ ] Offer copy.
- [ ] CTA copy.
- [ ] SEO metadata.

### Guardrails

- [ ] Structured JSON output.
- [ ] Schema validation.
- [ ] Deterministic normalization.
- [ ] Fallback generation.
- [ ] No executable frontend code.
- [ ] No invented customer results.
- [ ] No invented testimonials.
- [ ] No invented pricing or guarantees.
- [ ] Preserve authoritative form/product data.
- [ ] Preserve user-provided facts.

---

# EPIC LP-6 — Mobile-First Creation & Editing UX

**Goal:** Make the professional result easy to create and edit from a phone.

### Creation

- [ ] AI-first creation flow.
- [ ] Minimal offer intake.
- [ ] Audience input.
- [ ] Conversion objective.
- [ ] Traffic source/temperature.
- [ ] Optional ad-copy input.
- [ ] Asset upload.
- [ ] VSL connection.
- [ ] Form connection.
- [ ] Product connection.
- [ ] Generate page.
- [ ] Immediate preview.
- [ ] Preview → Edit transition.

### Editing

- [ ] Tap any visible section to edit.
- [ ] Inline text editing.
- [ ] Image replacement.
- [ ] Upload from device.
- [ ] Paste image URL.
- [ ] Media library.
- [ ] VSL URL editing.
- [ ] CTA editing.
- [ ] Add section.
- [ ] Duplicate section.
- [ ] Reorder section.
- [ ] Hide/show section.
- [ ] Delete section.
- [ ] Undo/redo.
- [ ] Autosave.
- [ ] Draft recovery.

### AI-assisted editing

- [ ] ✨ Improve section.
- [ ] Rewrite copy.
- [ ] Make it more premium.
- [ ] Improve conversion.
- [ ] Improve mobile.
- [ ] Change visual direction.
- [ ] Improve image placement.
- [ ] Strengthen CTA.
- [ ] Simplify page.
- [ ] Improve trust.
- [ ] Replace section with a better variant.
- [ ] Rebalance layout automatically.

### Mobile interaction model

- [ ] Bottom sheets.
- [ ] Focused full-screen editors.
- [ ] Sticky primary action.
- [ ] Large touch targets.
- [ ] Keyboard-safe editing.
- [ ] Clear save state.
- [ ] No desktop-style property panel as the primary mobile workflow.

---

# EPIC LP-7 — Media & Image Composition Intelligence

**Goal:** Make photography a core design ingredient rather than an afterthought.

### Media

- [ ] Upload from device.
- [ ] Paste URL.
- [ ] Media library.
- [ ] Upload progress.
- [ ] Retry failures.
- [ ] Replace/remove.
- [ ] Reuse asset.
- [ ] Image optimization.
- [ ] Responsive variants.

### Image editing

- [ ] Crop.
- [ ] Focal point.
- [ ] Fit/fill.
- [ ] Position.
- [ ] Aspect ratio.
- [ ] Background image.
- [ ] Overlay/gradient.
- [ ] Alt text.

### AI image decisions

- [ ] Choose best image for each section.
- [ ] Detect portrait vs. landscape suitability.
- [ ] Select crop/focal point.
- [ ] Select image treatment.
- [ ] Select background vs. foreground usage.
- [ ] Create before/after composition.
- [ ] Create editorial/offset composition.
- [ ] Avoid repetitive image usage.

### Design treatments

- [ ] Full bleed.
- [ ] Editorial portrait.
- [ ] Landscape.
- [ ] Floating image.
- [ ] Collage.
- [ ] Before/after.
- [ ] Image background.
- [ ] Overlapping/offset composition.

---

# EPIC LP-8 — Responsive Renderer & Preview/Published Parity

**Goal:** Automatically produce intentional layouts at every viewport.

- [ ] Mobile-first renderer.
- [ ] Tablet layout rules.
- [ ] Desktop layout rules.
- [ ] Container/grid system.
- [ ] Responsive typography.
- [ ] Responsive spacing.
- [ ] Image focal-point/crop behavior.
- [ ] Long headline handling.
- [ ] Long-copy handling.
- [ ] Button wrapping.
- [ ] VSL aspect-ratio handling.
- [ ] Safe-area support.
- [ ] Overflow protection.
- [ ] Preview/published renderer parity.
- [ ] Published revision isolation.

### AI responsive design

- [ ] Generate mobile composition rules.
- [ ] Generate tablet composition rules.
- [ ] Generate desktop composition rules.
- [ ] Detect layout breakage.
- [ ] Adjust typography for content length.
- [ ] Adjust spacing for content density.
- [ ] Preserve visual hierarchy across breakpoints.

### Acceptance criteria

A desktop design must never simply be squeezed onto a phone. The hierarchy, imagery, CTA, and content remain intentionally composed at mobile, tablet, and desktop sizes.

---

# EPIC LP-9 — Conversion Architecture, Trust & Analytics

**Goal:** Beautiful pages must also convert.

### Core sections

- [ ] Promise-driven hero.
- [ ] Credibility strip.
- [ ] Problem/solution.
- [ ] VSL.
- [ ] Benefits.
- [ ] Features.
- [ ] Testimonials.
- [ ] Before/after.
- [ ] Metrics.
- [ ] Objection handling.
- [ ] Offer breakdown.
- [ ] Pricing.
- [ ] User-provided guarantee.
- [ ] FAQ.
- [ ] Lead capture.
- [ ] Product purchase.
- [ ] Application.
- [ ] Final CTA.

### CTA strategy

- [ ] Hero CTA.
- [ ] Post-VSL CTA.
- [ ] Post-proof CTA.
- [ ] Offer CTA.
- [ ] Final CTA.
- [ ] Context-aware CTA copy.
- [ ] Real form/product connections.

### Analytics

- [ ] Page view.
- [ ] CTA click.
- [ ] Video play.
- [ ] Form start.
- [ ] Form submission.
- [ ] Product view.
- [ ] Checkout start.
- [ ] Conversion.

---

# EPIC LP-10 — AI Design Critique & Continuous Improvement

**Goal:** Let users improve professional quality without knowing why a design is good or bad.

### One-tap AI actions

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

### AI design audit

- [ ] Weak headline.
- [ ] Weak CTA.
- [ ] Poor hierarchy.
- [ ] Excessive/insufficient spacing.
- [ ] Poor image treatment.
- [ ] Missing social proof.
- [ ] Missing offer information.
- [ ] Weak conversion path.
- [ ] Mobile overflow.
- [ ] Broken links.
- [ ] Missing trust signals.
- [ ] Poor ad/message match.

### Quality scoring

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

### Safety

- [ ] Preserve user content.
- [ ] Preserve authoritative business data.
- [ ] Undo AI changes.
- [ ] Show proposed changes when destructive mutations require confirmation.

---

# EPIC LP-11 — Preview, Publish & Production Quality

**Goal:** Make the complete lifecycle reliable.

- [ ] Preview immediately after creation.
- [ ] Mobile/tablet/desktop preview.
- [ ] Edit directly from preview.
- [ ] Return to preview without losing changes.
- [ ] Publish validation.
- [ ] Draft/published revisions.
- [ ] Public URL.
- [ ] Share.
- [ ] Open Graph preview.
- [ ] SEO metadata.
- [ ] Favicon/brand image.
- [ ] Loading states.
- [ ] Empty states.
- [ ] Error states.
- [ ] Malformed/legacy document recovery.
- [ ] Editor error boundary.
- [ ] No blank-screen failures.

### Acceptance criteria

`Create → Preview → Edit → Preview → Publish → Open public URL` works reliably after refresh and on supported mobile/desktop viewports.

---

# EPIC LP-12 — Accessibility, Performance & Visual Regression

**Goal:** Every generated page must be production-grade.

### Accessibility

- [ ] Semantic headings.
- [ ] Keyboard navigation.
- [ ] Focus states.
- [ ] Accessible links/buttons.
- [ ] Image alt text.
- [ ] Video accessibility.
- [ ] Color contrast.
- [ ] Reduced motion.
- [ ] Form accessibility.

### Performance

- [ ] Image compression.
- [ ] Responsive image delivery.
- [ ] Lazy loading.
- [ ] Video loading strategy.
- [ ] Font loading strategy.
- [ ] Avoid layout shift.
- [ ] Public-page bundle optimization.
- [ ] Core Web Vitals baseline.

### Visual QA

- [ ] Mobile screenshots.
- [ ] Tablet screenshots.
- [ ] Desktop screenshots.
- [ ] Visual regression tests.
- [ ] Golden fitness page snapshot.
- [ ] Long-copy regression.
- [ ] Missing-media regression.
- [ ] VSL regression.
- [ ] Before/after regression.
- [ ] Preview/published parity regression.

---

# EPIC LP-13 — Entrepreneur Page Strategies

**Goal:** Give the AI proven starting architectures for common entrepreneur offers. These are internal strategy profiles, not templates the user must manually select.

Priority:

1. [ ] Fitness coach / challenge.
2. [ ] Lead generation.
3. [ ] Coaching/application.
4. [ ] Book a call.
5. [ ] Digital product.
6. [ ] Course.
7. [ ] Service business.
8. [ ] Creator/personal brand.
9. [ ] Webinar/event.
10. [ ] Product sale.
11. [ ] Waitlist.

Each strategy defines:

- [ ] Recommended traffic temperature.
- [ ] Conversion objective.
- [ ] Section architecture.
- [ ] CTA strategy.
- [ ] Trust strategy.
- [ ] Mobile composition.
- [ ] Desktop composition.
- [ ] Design variants.
- [ ] Media treatments.
- [ ] Required/optional inputs.

---

# EPIC LP-14 — Design Intelligence Evaluation & Learning Loop

**Goal:** Continuously improve the AI designer toward professional design quality.

### Internal benchmark

- [ ] Maintain gold-standard reference pages.
- [ ] Compare generated pages against approved patterns.
- [ ] Capture visual regression screenshots.
- [ ] Identify recurring weak design patterns.
- [ ] Improve rules/components.
- [ ] Add new high-quality reference examples.
- [ ] Maintain known-good/known-bad evaluation examples.
- [ ] Measure AI-generated page quality over time.

### Acceptance criteria

Buy Now can identify common design problems automatically and recommend or perform improvements without requiring the entrepreneur to understand the underlying design principles.

---

# Recommended Implementation Sequence

## Phase 1 — Teach Buy Now how to design

**LP-1 → LP-2 → LP-3**

Build the strategy engine, encode professional design intelligence, and establish the premium fitness landing page as the internal visual benchmark.

## Phase 2 — Give AI reliable building blocks

**LP-4 → LP-7 → LP-8**

Build the controlled primitives, intelligent media system, and responsive renderer.

## Phase 3 — Build the AI designer

**LP-5 → LP-10**

Generate pages, art-direct them, critique them, and improve them automatically.

## Phase 4 — Make pages convert

**LP-9**

Implement conversion architecture, trust, CTA strategy, forms, products, and analytics.

## Phase 5 — Make the product production-grade

**LP-6 → LP-11 → LP-12**

Harden mobile editing, preview, publishing, accessibility, performance, and visual QA.

## Phase 6 — Scale the intelligence

**LP-13 → LP-14**

Expand to additional entrepreneur strategies and continuously improve AI design quality.

---

# Definition of Done — AI Landing Page Builder

Landing Pages are flagship-ready when:

- [ ] The entrepreneur never needs to build a Figma foundation or design system.
- [ ] The entrepreneur never needs to understand grids, breakpoints, typography scales, spacing tokens, or component variants.
- [ ] Buy Now automatically chooses professional typography, colors, spacing, layouts, imagery, and responsive behavior.
- [ ] A user can provide their offer, audience, ad, assets, VSL, form, or product and receive a complete page.
- [ ] AI selects conversion architecture based on traffic source, temperature, audience, and objective.
- [ ] AI maintains ad-to-page message and visual continuity.
- [ ] Users can easily edit content and sections from mobile.
- [ ] Users can replace images from device, URL, or media library.
- [ ] Every visible section is directly editable.
- [ ] Preview works immediately after creation.
- [ ] Preview and published output are visually consistent.
- [ ] Mobile, tablet, and desktop layouts are intentional without manual breakpoint work.
- [ ] Real forms/products/Buy Now actions can be connected.
- [ ] Pages have SEO, accessibility, performance, and analytics foundations.
- [ ] AI can critique and improve a page without destroying user content or authoritative business data.
- [ ] Visual regression tests protect the gold-standard designs.
- [ ] The resulting page looks like a professional designer built it specifically for the entrepreneur's ad traffic.

## North-star test

> **Can an entrepreneur with zero design/CRO experience provide their offer, ad, photos, VSL, and links and receive a page that looks like they paid a professional designer to build it?**

If not, the Landing Page Builder is not finished.