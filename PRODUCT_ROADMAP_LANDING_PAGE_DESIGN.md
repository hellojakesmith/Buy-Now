# Buy Now — Landing Page Design & Development Roadmap

> Dedicated execution roadmap for making Landing Pages the flagship design and creation experience in Buy Now.
>
> This roadmap complements `PRODUCT_ROADMAP_CONVERSION_BUILDER.md`. The conversion-builder roadmap defines the broader product suite; this document defines the focused design and engineering work required to make generated landing pages feel professionally designed, mobile-first, conversion-focused, and easy to edit.

## 1. Product vision

Buy Now should let a creator, coach, consultant, or small business owner provide an offer, a few assets, and a goal and receive a landing page that feels like a professional designer built it.

The target is **not** a generic collection of rounded cards. The target is controlled, responsive art direction with strong hierarchy, typography, imagery, spacing, conversion flow, and brand consistency.

### North-star flow

`Describe offer → AI/design system → Generate → Preview → Edit → Improve → Publish → Measure`

### Core constraints

- Mobile-first: design the 390px-ish experience first.
- One-handed editing: no desktop-style configuration panels as the primary mobile interaction.
- 15-minute first-launch goal.
- Structured page specifications, not arbitrary AI-generated code.
- Preview and published output should share the same rendering contract.
- User media must be easy to upload, replace, crop, reposition, and reuse.
- AI should remove design work rather than create another complicated workflow.

---

# 2. EPIC LP-1 — Figma Design System & Visual Foundation

**Goal:** Establish a professional visual system before expanding templates and section implementations.

## Design deliverables

- [ ] Create a Figma **Buy Now Landing Page Design System**.
- [ ] Define mobile-first 390px foundations.
- [ ] Define tablet and desktop breakpoints.
- [ ] Define 12-column desktop grid.
- [ ] Define mobile spacing grid.
- [ ] Define content max-widths.
- [ ] Define spacing scale.
- [ ] Define typography scale.
- [ ] Define heading/body/display styles.
- [ ] Define letter-spacing and line-height rules.
- [ ] Define color tokens.
- [ ] Define surface/background tokens.
- [ ] Define border, radius, and shadow tokens.
- [ ] Define button height/touch-target rules.
- [ ] Define icon sizing rules.
- [ ] Define image aspect-ratio rules.

## Brand themes

- [ ] Neutral/minimal.
- [ ] High-energy fitness.
- [ ] Luxury/editorial.
- [ ] Creator/personal brand.
- [ ] Service/business.
- [ ] Dark/high-contrast.

## Acceptance criteria

- A designer can build a new landing page without inventing new spacing, typography, button, or card rules.
- The design tokens can be represented directly in the page schema.
- Mobile is the source of truth rather than a desktop layout scaled down afterward.

---

# 3. EPIC LP-2 — Gold-Standard Fitness Landing Page

**Goal:** Create one complete professional reference design before expanding the template library.

## Figma pages

- [ ] 390px mobile.
- [ ] 768px tablet.
- [ ] 1440px desktop.
- [ ] Editor/preview states.
- [ ] Empty/placeholder media states.
- [ ] Long-copy states.
- [ ] Error/fallback states.

## Page architecture

- [ ] Navigation/brand header.
- [ ] Hero.
- [ ] Credibility/social-proof strip.
- [ ] VSL.
- [ ] Problem → solution.
- [ ] Benefits/features.
- [ ] Before/after results.
- [ ] Testimonials.
- [ ] Program/offer.
- [ ] Pricing/CTA.
- [ ] FAQ.
- [ ] Final CTA.
- [ ] Footer.

## Fitness requirements

- [ ] Title.
- [ ] Subtitle.
- [ ] VSL/video.
- [ ] Form CTA/link.
- [ ] Before/after images.
- [ ] Testimonial content.
- [ ] Offer details.
- [ ] Trust/credibility elements.

## Acceptance criteria

- The reference page looks like a professionally art-directed marketing site, not an assembled prototype.
- The same design can be rendered at mobile, tablet, and desktop widths without losing hierarchy.

---

# 4. EPIC LP-3 — Reusable Design Components & Section Variants

**Goal:** Translate the Figma system into controlled, reusable UI primitives and page sections.

## Components

- [ ] Typography primitives.
- [ ] Buttons.
- [ ] Links.
- [ ] Badges.
- [ ] Icon rows.
- [ ] Cards.
- [ ] Dividers.
- [ ] Media frames.
- [ ] Video frames.
- [ ] Testimonial cards.
- [ ] Before/after cards.
- [ ] Pricing/offer cards.
- [ ] FAQ rows.
- [ ] Navigation.
- [ ] Footer.

## Component variants

### Buttons

- [ ] Primary.
- [ ] Secondary.
- [ ] Outline.
- [ ] Ghost.
- [ ] Dark.
- [ ] Icon/arrow.
- [ ] Small/medium/large.

### Hero

- [ ] Editorial split.
- [ ] Full-bleed image.
- [ ] Image background.
- [ ] Centered minimal.
- [ ] Product/offer hero.

### Benefits

- [ ] Three-card.
- [ ] Four-card.
- [ ] Icon grid.
- [ ] Editorial.
- [ ] Numbered.

### Social proof

- [ ] Logo strip.
- [ ] Quote.
- [ ] Testimonial cards.
- [ ] Results grid.
- [ ] Before/after.
- [ ] Metrics.

### CTA/offer

- [ ] Simple CTA.
- [ ] Lead-form CTA.
- [ ] Product CTA.
- [ ] Pricing card.
- [ ] Full-width conversion block.

## Acceptance criteria

- Variants are data-driven and selected through the page schema.
- Existing pages remain renderable when new variants are introduced.
- Components have mobile and desktop behavior defined rather than relying on accidental CSS wrapping.

---

# 5. EPIC LP-4 — Mobile Landing Page Editor UX

**Goal:** Make editing a page from a phone feel simple rather than like using desktop Figma on a small screen.

## Creation flow

- [ ] AI-first creation.
- [ ] Minimal business/offer intake.
- [ ] Asset upload during creation.
- [ ] AI-generated first draft.
- [ ] Immediate preview after creation.
- [ ] Explicit transition from preview → edit.

## Section editing

- [ ] Section list.
- [ ] Tap section to edit.
- [ ] Inline text editing.
- [ ] Image replacement.
- [ ] Upload from device.
- [ ] Paste image URL.
- [ ] Media library selection.
- [ ] Video/VSL URL editing.
- [ ] CTA editing.
- [ ] Section visibility.
- [ ] Duplicate section.
- [ ] Reorder section.
- [ ] Delete section.
- [ ] Add section.

## Mobile interaction model

- [ ] Bottom-sheet controls.
- [ ] Full-screen focused editors where appropriate.
- [ ] Sticky primary action.
- [ ] Large touch targets.
- [ ] Keyboard-safe editing.
- [ ] Autosave.
- [ ] Save-state indicator.
- [ ] Undo/redo.
- [ ] Draft recovery.
- [ ] Unsaved-change protection.

## Acceptance criteria

A new user can tap any visible section, understand what can be changed, make the change, return to the page, and preview the result without hunting through menus.

---

# 6. EPIC LP-5 — Responsive Renderer & Visual Parity

**Goal:** Make the preview and published page look intentional at every supported viewport.

- [ ] Mobile-first renderer.
- [ ] Tablet layout rules.
- [ ] Desktop layout rules.
- [ ] Container/grid rules.
- [ ] Typography scaling.
- [ ] Section spacing scaling.
- [ ] Image crop/focal-point behavior.
- [ ] Overflow protection.
- [ ] Long headline handling.
- [ ] Long-copy handling.
- [ ] Button wrapping rules.
- [ ] Video aspect ratio handling.
- [ ] Safe-area handling.
- [ ] Published revision isolation.
- [ ] Preview/published renderer parity.

## Acceptance criteria

No section should look like a desktop card squeezed onto a phone. The renderer must preserve the intended visual hierarchy at 390px, tablet, and desktop widths.

---

# 7. EPIC LP-6 — Media & Image Composition System

**Goal:** Make user-provided photography a first-class design asset.

## Upload

- [ ] Upload from device.
- [ ] Paste URL.
- [ ] Media library.
- [ ] Upload progress.
- [ ] Retry failed uploads.
- [ ] Remove/replace image.
- [ ] Reuse uploaded asset.
- [ ] Image optimization.
- [ ] Responsive variants.

## Editing

- [ ] Crop.
- [ ] Focal point.
- [ ] Fit/fill.
- [ ] Position.
- [ ] Aspect ratio.
- [ ] Background image.
- [ ] Overlay/gradient.
- [ ] Alt text.

## Design treatments

- [ ] Full bleed.
- [ ] Rounded editorial.
- [ ] Portrait.
- [ ] Landscape.
- [ ] Floating image.
- [ ] Collage.
- [ ] Before/after.
- [ ] Image background.

## Acceptance criteria

A user can upload photos once and use them across hero, testimonials, results, gallery, and background treatments without manually managing URLs or technical asset IDs.

---

# 8. EPIC LP-7 — AI Design & Page Generation

**Goal:** Make AI the designer while keeping output structured, predictable, editable, and safe.

## AI inputs

- [ ] Business description.
- [ ] Audience.
- [ ] Offer.
- [ ] Desired outcome.
- [ ] Price where relevant.
- [ ] CTA.
- [ ] Brand voice.
- [ ] Uploaded images.
- [ ] VSL.
- [ ] Form URL.
- [ ] Product reference.

## AI planning

- [ ] Audience extraction.
- [ ] Offer extraction.
- [ ] Conversion goal selection.
- [ ] Page architecture selection.
- [ ] Theme selection.
- [ ] Typography pairing selection.
- [ ] Section variant selection.
- [ ] Image-treatment selection.
- [ ] CTA strategy.
- [ ] Trust-element recommendations.

## Generation

- [ ] Full-page generation.
- [ ] Section generation.
- [ ] Headline variants.
- [ ] Subtitle variants.
- [ ] Benefit copy.
- [ ] Objection handling.
- [ ] FAQ generation.
- [ ] Testimonial layout.
- [ ] Offer copy.
- [ ] SEO metadata.

## AI editing commands

- [ ] Make this more premium.
- [ ] Make this feel more like a fitness brand.
- [ ] Make this clearer.
- [ ] Make the CTA stronger.
- [ ] Make this more concise.
- [ ] Make this more trustworthy.
- [ ] Improve mobile layout.
- [ ] Improve conversion flow.
- [ ] Replace this section with a better one.

## Guardrails

- [ ] Structured JSON output.
- [ ] Schema validation.
- [ ] Fallback generation.
- [ ] Never generate executable frontend code.
- [ ] Never invent customer results or analytics.
- [ ] Flag assumptions.
- [ ] Preview mutations before destructive changes.
- [ ] Preserve authoritative product/price/form data.

## Acceptance criteria

AI output always maps to supported design tokens, section variants, components, and media references. Generated pages remain fully editable by the user.

---

# 9. EPIC LP-8 — Conversion & Trust Section System

**Goal:** Make pages strategically persuasive, not merely visually attractive.

- [ ] Credibility strip.
- [ ] Social proof.
- [ ] Testimonials.
- [ ] Before/after results.
- [ ] Benefits.
- [ ] Features.
- [ ] Problem/solution.
- [ ] Objection handling.
- [ ] VSL.
- [ ] Offer breakdown.
- [ ] Pricing.
- [ ] Guarantee.
- [ ] FAQ.
- [ ] Lead capture.
- [ ] Product CTA.
- [ ] Buy Now CTA.
- [ ] Final CTA.

## CTA strategy

- [ ] Hero CTA.
- [ ] VSL CTA.
- [ ] Post-proof CTA.
- [ ] Offer CTA.
- [ ] Final CTA.
- [ ] Context-aware CTA copy.
- [ ] Real form/product connections.

## Analytics

- [ ] Page view.
- [ ] CTA click.
- [ ] Video play.
- [ ] Form start.
- [ ] Form submission.
- [ ] Product view.
- [ ] Checkout start.
- [ ] Conversion.

---

# 10. EPIC LP-9 — Preview, Publish & Production Quality

**Goal:** Make preview and published output reliable enough to be the user's source of truth.

- [ ] Preview immediately after creation.
- [ ] Mobile preview.
- [ ] Tablet preview.
- [ ] Desktop preview.
- [ ] Edit from preview.
- [ ] Return to preview without losing changes.
- [ ] Publish validation.
- [ ] Draft/published revision model.
- [ ] Public URL.
- [ ] Share action.
- [ ] Open Graph preview.
- [ ] SEO metadata.
- [ ] Favicon/brand image.
- [ ] Loading states.
- [ ] Empty states.
- [ ] Error states.
- [ ] Recovery from malformed/legacy documents.
- [ ] Error boundary around editor.
- [ ] No blank-screen failures.

## Acceptance criteria

`Create → Preview → Edit → Preview → Publish → Open public URL` works reliably after refresh and across supported mobile/desktop viewports.

---

# 11. EPIC LP-10 — Accessibility, Performance & Visual QA

**Goal:** Make generated pages production-grade.

## Accessibility

- [ ] Semantic headings.
- [ ] Keyboard navigation.
- [ ] Focus states.
- [ ] Accessible buttons/links.
- [ ] Image alt text.
- [ ] Video accessibility.
- [ ] Color contrast.
- [ ] Reduced-motion handling.
- [ ] Form accessibility.

## Performance

- [ ] Image compression.
- [ ] Responsive image delivery.
- [ ] Lazy loading below the fold.
- [ ] Video loading strategy.
- [ ] Font loading strategy.
- [ ] Avoid layout shift.
- [ ] Public-page bundle optimization.
- [ ] Lighthouse/Core Web Vitals baseline.

## Visual QA

- [ ] Automated mobile screenshots.
- [ ] Automated tablet screenshots.
- [ ] Automated desktop screenshots.
- [ ] Visual regression checks.
- [ ] Golden fitness page snapshot.
- [ ] Long-copy regression.
- [ ] Missing-media regression.
- [ ] VSL regression.
- [ ] Before/after regression.
- [ ] Publish/preview parity regression.

---

# 12. EPIC LP-11 — Template Library Expansion

**Goal:** Expand only after the design system and renderer can consistently produce high-quality output.

Priority order:

1. [ ] Fitness coach — flagship.
2. [ ] Creator/personal brand.
3. [ ] Coach/consultant.
4. [ ] Service business.
5. [ ] Agency.
6. [ ] Digital product/lead magnet.
7. [ ] Webinar/event.
8. [ ] Local business.
9. [ ] Product offer.
10. [ ] Custom AI-generated page.

Every template must have:

- [ ] Figma reference design.
- [ ] Mobile design.
- [ ] Desktop design.
- [ ] Realistic sample content.
- [ ] Sample imagery.
- [ ] Replaceable media.
- [ ] Preview.
- [ ] Editable sections.
- [ ] Responsive behavior.
- [ ] Connected CTA actions.
- [ ] Publish validation.

---

# 13. EPIC LP-12 — AI Visual Design QA & Improvement

**Goal:** Have AI critique generated pages before and after publication.

## Pre-publish checks

- [ ] Missing headline.
- [ ] Weak CTA.
- [ ] Too many sections.
- [ ] Missing social proof.
- [ ] Missing offer information.
- [ ] Poor image quality.
- [ ] Poor image placement.
- [ ] Typography hierarchy issues.
- [ ] Excessive spacing.
- [ ] Insufficient spacing.
- [ ] Mobile overflow.
- [ ] Weak conversion path.
- [ ] Missing trust signals.
- [ ] Broken links.

## AI improvement experience

Provide a simple **Improve with AI** action with options such as:

- [ ] Make it more premium.
- [ ] Improve conversion.
- [ ] Improve mobile.
- [ ] Improve copy.
- [ ] Improve visual hierarchy.
- [ ] Improve trust.
- [ ] Simplify.
- [ ] Strengthen CTA.
- [ ] Improve the hero.

AI changes must be reviewable and reversible.

---

# 14. Recommended implementation sequence

## Phase 1 — Design foundation

**LP-1 + LP-2**

Deliver the Figma design system and gold-standard fitness page.

## Phase 2 — Renderer foundation

**LP-3 + LP-5**

Build design tokens, component variants, section variants, and responsive rendering.

## Phase 3 — Mobile editor

**LP-4 + LP-6**

Make every section and image easy to edit from a phone.

## Phase 4 — AI generation

**LP-7**

Move AI from copy generation toward full page art direction using structured design specifications.

## Phase 5 — Conversion system

**LP-8**

Add persuasive section architecture and real conversion connections.

## Phase 6 — Production quality

**LP-9 + LP-10**

Harden preview, publishing, performance, accessibility, and visual regression.

## Phase 7 — Scale

**LP-11 + LP-12**

Expand templates and introduce AI visual QA/improvement.

---

# 15. Definition of Done — Landing Pages

Landing Pages are considered flagship-ready when:

- [ ] A first-time user can create a professional page from a phone in approximately 15 minutes.
- [ ] The fitness coach page meets the Figma gold-standard design.
- [ ] The design system is tokenized and reusable.
- [ ] AI chooses page architecture, theme, variants, and content from structured inputs.
- [ ] Users can replace any image from device, URL, or media library.
- [ ] Every visible section is directly editable.
- [ ] Preview works immediately after creation.
- [ ] Preview and published output are visually consistent.
- [ ] Mobile, tablet, and desktop layouts are intentional.
- [ ] Real forms/products/Buy Now actions can be connected.
- [ ] Pages have SEO, accessibility, performance, and analytics foundations.
- [ ] Critical flows have automated tests and visual regression coverage.
- [ ] AI can critique and improve a page without destroying user content or authoritative business data.
