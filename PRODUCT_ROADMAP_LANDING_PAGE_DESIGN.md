# Buy Now — Ad Landing Page Design & Development Roadmap

> **Product goal:** Buy Now turns an entrepreneur's offer, ad traffic, and assets into a beautiful, conversion-focused landing page in minutes.
>
> This roadmap complements `PRODUCT_ROADMAP_CONVERSION_BUILDER.md`. That roadmap covers the broader conversion-builder suite. This roadmap is the focused execution plan for making **Landing Pages** the flagship Buy Now experience.

## North Star

An entrepreneur with no design or CRO experience should be able to:

`Describe offer → Add audience/goal → Upload assets → Add VSL/form/product → AI creates page → Preview → Edit → Improve with AI → Publish → Measure`

The finished page should feel like a professional designer built it specifically for the ad traffic—not like an AI assembled a stack of generic cards.

### Core product principles

- **Ad-first:** the page continues the promise, creative direction, and audience context of the ad.
- **Mobile-first:** design the 390px-ish experience first because entrepreneurs create on mobile and much ad traffic is mobile.
- **Conversion-first:** every section should have a job in the visitor journey.
- **Design-system driven:** AI selects from controlled design tokens, layouts, and components instead of generating arbitrary frontend code.
- **Asset-first:** creator photos, videos, testimonials, logos, and brand assets are first-class inputs.
- **15-minute launch:** a first-time entrepreneur should reach a publishable page quickly.
- **Simple editing:** users edit sections and content without learning web design.
- **Preview equals reality:** preview and published pages use the same rendering contract.
- **Safe AI:** AI never invents customer results, prices, guarantees, analytics, or authoritative business facts.

---

# EPIC LP-1 — Ad Landing Page Strategy Engine

**Goal:** Build pages for the traffic source and conversion objective rather than treating every landing page as a generic website.

### Inputs

- [ ] Offer/business description.
- [ ] Target audience.
- [ ] Offer promise/outcome.
- [ ] Primary CTA.
- [ ] Price, when applicable.
- [ ] Traffic source: Instagram, Facebook, TikTok, Google, other.
- [ ] Traffic temperature: cold, warm, existing audience.
- [ ] Conversion objective: lead, application, call, product sale, course, email signup, event, waitlist.
- [ ] Ad copy/creative, when available.
- [ ] Brand voice.
- [ ] Photos.
- [ ] VSL/video.
- [ ] Form URL.
- [ ] Product/checkout connection.

### AI page strategy

- [ ] Analyze audience.
- [ ] Analyze offer.
- [ ] Analyze ad promise.
- [ ] Determine conversion objective.
- [ ] Determine traffic temperature.
- [ ] Choose page architecture.
- [ ] Determine trust requirements.
- [ ] Determine CTA frequency.
- [ ] Determine recommended sections.
- [ ] Determine visual direction.
- [ ] Preserve ad-to-page message match.

### Acceptance criteria

- A page generated from an ad clearly continues the ad's promise and visual direction.
- The architecture changes based on objective and traffic temperature.
- The user does not have to manually choose a template before AI can produce a page.

---

# EPIC LP-2 — Figma Design System & Visual Foundation

**Goal:** Establish the visual language that makes generated pages feel professionally designed.

### Figma foundations

- [ ] Create Buy Now Landing Page Design System.
- [ ] 390px mobile source-of-truth frame.
- [ ] 768px tablet frame.
- [ ] 1440px desktop frame.
- [ ] Desktop 12-column grid.
- [ ] Mobile spacing grid.
- [ ] Content max-widths.
- [ ] Spacing scale.
- [ ] Typography scale.
- [ ] Display/headline/body styles.
- [ ] Line-height and letter-spacing rules.
- [ ] Color tokens.
- [ ] Surface/background tokens.
- [ ] Border/radius/shadow tokens.
- [ ] Button/touch-target rules.
- [ ] Icon sizing.
- [ ] Image aspect-ratio rules.

### Visual directions

- [ ] Bold/high-energy.
- [ ] Luxury/editorial.
- [ ] Minimal/clean.
- [ ] Creator/personal brand.
- [ ] Dark/high-contrast.
- [ ] Warm/community.
- [ ] Product-focused.

### Acceptance criteria

- Designers can build pages without inventing new spacing, typography, or component rules.
- Tokens map directly to the application page schema.
- Mobile is intentionally designed, not desktop simply scaled down.

---

# EPIC LP-3 — Gold-Standard Ad Landing Page

**Goal:** Build one Figma-quality reference page that becomes the visual benchmark for the product.

### First reference: Fitness Coach / 6-Week Challenge

- [ ] 390px mobile.
- [ ] 768px tablet.
- [ ] 1440px desktop.
- [ ] Navigation/brand.
- [ ] High-impact hero.
- [ ] Credibility strip.
- [ ] Problem → solution.
- [ ] VSL.
- [ ] Benefits.
- [ ] Before/after results.
- [ ] Testimonials.
- [ ] Program/offer.
- [ ] Pricing/application CTA.
- [ ] Objection handling.
- [ ] FAQ.
- [ ] Final CTA.
- [ ] Footer.

### Fitness-specific requirements

- [ ] Title.
- [ ] Subtitle.
- [ ] VSL.
- [ ] Form link.
- [ ] Before/after photography.
- [ ] Testimonials.
- [ ] Program details.
- [ ] Trust/credibility.
- [ ] Strong mobile CTA.

### Acceptance criteria

The page must look like a premium professional marketing page—not a collection of rounded cards—and must remain visually coherent across mobile, tablet, and desktop.

---

# EPIC LP-4 — Reusable Design System Components & Section Variants

**Goal:** Turn the Figma system into controlled, reusable application primitives.

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

### Section variants

**Hero**
- [ ] Editorial split.
- [ ] Full-bleed image.
- [ ] Image background.
- [ ] Centered minimal.
- [ ] Product/offer hero.
- [ ] Video-led hero.

**Benefits**
- [ ] Three-card.
- [ ] Four-card.
- [ ] Icon grid.
- [ ] Editorial.
- [ ] Numbered.

**Social proof**
- [ ] Quote.
- [ ] Testimonial cards.
- [ ] Results grid.
- [ ] Before/after.
- [ ] Metrics.
- [ ] Logo strip.

**Offer/CTA**
- [ ] Lead CTA.
- [ ] Application CTA.
- [ ] Product CTA.
- [ ] Pricing card.
- [ ] Full-width CTA.

### Acceptance criteria

- AI selects variants through structured page data.
- Existing documents remain renderable.
- Every variant has intentional mobile and desktop behavior.

---

# EPIC LP-5 — Mobile-First Creation & Editing UX

**Goal:** Make creating and editing a professional ad landing page easy from a phone.

### Creation flow

- [ ] AI-first creation flow.
- [ ] Minimal offer intake.
- [ ] Optional ad-copy input.
- [ ] Audience input.
- [ ] Conversion objective.
- [ ] Traffic source/temperature.
- [ ] Asset upload.
- [ ] VSL/form/product connection.
- [ ] Generate page.
- [ ] Immediate preview.
- [ ] Explicit Preview → Edit transition.

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

### Mobile interaction model

- [ ] Bottom sheets.
- [ ] Focused full-screen editors where useful.
- [ ] Sticky primary action.
- [ ] Large touch targets.
- [ ] Keyboard-safe editing.
- [ ] Clear save state.
- [ ] No desktop-style property panel as the primary mobile interaction.

### Acceptance criteria

A first-time user can tap a section, understand what can be changed, make the change, return to the page, and preview the result without hunting through menus.

---

# EPIC LP-6 — Responsive Renderer & Preview/Published Parity

**Goal:** Make every generated page look intentionally designed at every viewport.

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

### Acceptance criteria

The page never looks like a desktop card squeezed onto a phone. The intended visual hierarchy is preserved at mobile, tablet, and desktop sizes.

---

# EPIC LP-7 — Media & Image Composition System

**Goal:** Make creator photography a primary design ingredient.

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

### Design treatments

- [ ] Full bleed.
- [ ] Editorial portrait.
- [ ] Landscape.
- [ ] Floating image.
- [ ] Collage.
- [ ] Before/after.
- [ ] Image background.
- [ ] Overlapping/offset composition.

### Acceptance criteria

Users upload photos once and Buy Now can intelligently place them in hero, results, testimonials, backgrounds, and supporting sections without technical asset management.

---

# EPIC LP-8 — AI Art Direction & Page Generation

**Goal:** Make AI the designer while keeping output structured, editable, predictable, and safe.

### AI should decide

- [ ] Page architecture.
- [ ] Conversion objective.
- [ ] Section sequence.
- [ ] Theme.
- [ ] Typography pairing.
- [ ] Layout variants.
- [ ] Image treatments.
- [ ] CTA placement.
- [ ] Trust elements.
- [ ] Content hierarchy.
- [ ] Mobile composition.

### AI generation

- [ ] Full-page generation.
- [ ] Section generation.
- [ ] Headlines.
- [ ] Subtitles.
- [ ] Benefits.
- [ ] Objection handling.
- [ ] FAQ.
- [ ] Offer copy.
- [ ] CTA copy.
- [ ] SEO metadata.

### Ad/message match

- [ ] Carry ad promise into hero.
- [ ] Carry audience context into copy.
- [ ] Maintain visual continuity.
- [ ] Avoid bait-and-switch messaging.
- [ ] Preserve user-provided offer facts.

### Guardrails

- [ ] Structured JSON output.
- [ ] Schema validation.
- [ ] Fallback generation.
- [ ] No executable frontend code from AI.
- [ ] No invented customer results.
- [ ] No invented pricing/guarantees.
- [ ] Flag assumptions.
- [ ] Preserve authoritative form/product data.

---

# EPIC LP-9 — AI Improve / Design Critique

**Goal:** Let entrepreneurs improve professional quality without learning design.

### One-tap actions

- [ ] ✨ Make it more premium.
- [ ] 🎯 Improve conversion.
- [ ] 📱 Improve mobile.
- [ ] ✍️ Improve copy.
- [ ] 🖼️ Improve image placement.
- [ ] 🎨 Change visual direction.
- [ ] 🔥 Strengthen CTA.
- [ ] 🧠 Simplify the page.
- [ ] 🛡️ Improve trust.
- [ ] Replace this section with a better one.

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

### Safety

- [ ] Show proposed changes before destructive mutations when appropriate.
- [ ] Preserve user content.
- [ ] Preserve authoritative business data.
- [ ] Undo AI changes.

---

# EPIC LP-10 — Conversion Architecture & Trust

**Goal:** Ensure beautiful pages are also strategically effective for ad traffic.

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
- [ ] Guarantee where user provides one.
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

### Analytics foundation

- [ ] Page view.
- [ ] CTA click.
- [ ] Video play.
- [ ] Form start.
- [ ] Form submission.
- [ ] Product view.
- [ ] Checkout start.
- [ ] Conversion.

---

# EPIC LP-11 — Preview, Publish & Production Quality

**Goal:** Make the landing page reliable from creation through public traffic.

- [ ] Preview immediately after creation.
- [ ] Mobile/tablet/desktop preview.
- [ ] Edit from preview.
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

**Goal:** Make every generated page production-grade.

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

# EPIC LP-13 — Entrepreneur Landing Page Strategies

**Goal:** Expand beyond the fitness reference while preserving design quality.

Priority:

1. [ ] Fitness challenge/program.
2. [ ] Lead-generation offer.
3. [ ] Application/coaching funnel.
4. [ ] Digital product.
5. [ ] Course.
6. [ ] Book-a-call service.
7. [ ] Creator/personal brand.
8. [ ] Webinar/event.
9. [ ] Agency/service business.
10. [ ] Product sale.
11. [ ] Waitlist/launch.
12. [ ] Custom AI-generated strategy.

Every strategy must include:

- [ ] Figma reference.
- [ ] Mobile design.
- [ ] Desktop design.
- [ ] Realistic sample content.
- [ ] Sample assets.
- [ ] Replaceable media.
- [ ] Editable sections.
- [ ] Responsive behavior.
- [ ] Connected CTA action.
- [ ] Preview.
- [ ] Publish validation.

---

# Recommended execution order

## Phase 1 — Design benchmark

**LP-1 + LP-2 + LP-3**

Build the ad strategy model, Figma design system, and gold-standard fitness/ad landing page.

## Phase 2 — Engineering the design system

**LP-4 + LP-5**

Translate the Figma system into reusable components, section variants, and responsive rendering.

## Phase 3 — Mobile creation experience

**LP-6 + LP-7**

Make the entrepreneur workflow fast and make their assets easy to use everywhere.

## Phase 4 — AI designer

**LP-8 + LP-9**

Move AI from copy generation to page strategy, art direction, composition, and iterative improvement.

## Phase 5 — Conversion engine

**LP-10**

Make the page architecture explicitly optimized for ad traffic and the chosen conversion objective.

## Phase 6 — Production quality

**LP-11 + LP-12**

Harden publishing, accessibility, performance, and visual quality.

## Phase 7 — Scale

**LP-13**

Add additional entrepreneur strategies only after the design system and renderer consistently meet the quality bar.

---

# Definition of Done — Flagship Ad Landing Pages

Landing Pages are flagship-ready when:

- [ ] An entrepreneur can create a professional ad landing page from a phone in approximately 15 minutes.
- [ ] The page continues the promise and visual language of the ad.
- [ ] AI chooses the architecture, visual direction, section variants, image treatments, and CTA strategy.
- [ ] The generated result looks professionally art-directed rather than template-assembled.
- [ ] The 390px mobile experience is excellent.
- [ ] Tablet and desktop layouts are intentionally designed.
- [ ] Every visible section can be edited easily.
- [ ] Images can be uploaded from device, URL, or media library and reused.
- [ ] VSL, forms, products, and CTAs connect to real destinations.
- [ ] Preview appears immediately after creation.
- [ ] Preview and published output match.
- [ ] AI can critique and improve the page without destroying user content.
- [ ] Pages have accessibility, performance, SEO, and analytics foundations.
- [ ] Critical flows have automated and visual regression coverage.

## The quality test

> **Can an entrepreneur with zero design/CRO experience provide their offer, ad, photos, and links and produce a page that looks like they paid a professional designer $2,000+ to build it?**

If not, the Landing Page experience is not finished.
