# Buy Now — Agent Instructions

## Mission

Buy Now is a mobile-first business operating system for creators, coaches, consultants, and small businesses. The product collapses lead forms, landing pages, CRM, pipeline, products, checkout, analytics, automation, and AI into one simple workflow.

The flagship creation experience is **Create → Publish → Capture → Sell → Measure → Improve**.

The app must feel dramatically simpler than a traditional desktop SaaS while producing output that is as polished and conversion-ready as leading commerce/page builders such as Shopify.

## Repository Architecture

- `buynow/` — React + Vite + TypeScript mobile-first frontend.
- `buynow/src/app/App.tsx` — current application shell; large legacy/prototype surface that should be decomposed incrementally, not rewritten blindly.
- `buynow/src/app/forms/` — form editor and public form renderer.
- `buynow/src/app/lib/api.ts` — frontend API client.
- `buynow/src/app/lib/useAppData.ts` — application data loading/state integration.
- `backend/` — Express + TypeScript API.
- `backend/src/models/` — MongoDB/Mongoose domain models including Form, FormSubmission, Contact, Opportunity, Page, Product, Order, and MediaAsset.
- `backend/src/routes/` — API routes for forms, pages, products, orders, contacts, opportunities, public content, media, etc.
- `backend/src/schemas/` — request validation schemas.
- `PRODUCT_ROADMAP.md` — canonical product roadmap and acceptance criteria.
- `PRODUCT_ROADMAP_STATUS.md` — implementation status tracking.
- `buynow/TASKS.md` — shorter execution backlog.

The current repository already has production-oriented backend foundations, domain models, public form/page architecture, media infrastructure, and initial creation flows. Do not replace working architecture merely to introduce a new abstraction.

## Product Principles

1. **Mobile first means mobile excellent.** Design for one-handed use, short sessions, touch targets, keyboards, safe areas, bottom sheets, and small screens first. Desktop is secondary.
2. **15-minute outcome.** A new user should be able to create and publish a professional lead-generation or selling experience in roughly 15 minutes without understanding web design, funnels, HTML, CSS, or CRM concepts.
3. **AI removes work; it does not add another app.** AI should be embedded at the moment a user needs help: generate, improve, organize, recommend, diagnose, and optimize.
4. **Structured data over generated code.** AI produces validated page/form/product specifications, copy, settings, and recommendations—not arbitrary executable frontend code.
5. **Real persistence.** Do not present mock arrays, synthetic analytics, or local-only state as production truth.
6. **One canonical domain model.** Forms create submissions; submissions create/update contacts; pages reference forms/products; purchases create orders and update customer history.
7. **Server authority.** Prices, order totals, payment state, authorization, publishing state, and tenant boundaries are authoritative on the backend.
8. **Progressive disclosure.** Show only the controls needed for the current task. Advanced controls live behind clearly labeled options.
9. **Preview equals reality.** Editor preview and published rendering must use the same versioned schema and renderer rules wherever practical.
10. **Every feature is measurable.** Important interactions should emit events that support funnel and conversion analytics.

## Flagship Feature Suite

The four creation primitives below are a single product system, not four unrelated CRUD screens:

### 1. Lead Forms

Users must be able to:

- Start from high-quality templates: lead generation, consultation, quote request, application, waitlist, contact, event registration, and custom.
- Create/edit/duplicate/delete/reorder fields.
- Support text, email, phone, number, textarea, select, multi-select, checkbox, radio, date, URL, file upload, and hidden/UTM fields where appropriate.
- Configure required state, labels, placeholders, help text, validation, options, defaults, and conditional visibility.
- Configure submission behavior: success message, redirect, contact creation/update, opportunity creation, pipeline stage, notification, and automation.
- Preview the exact mobile public form while editing.
- Publish/unpublish, share, copy URL, generate QR code, and embed where supported.
- Protect public submissions with server validation, rate limiting, abuse/spam controls, and duplicate handling.
- Track views, starts, abandonments, submissions, conversion rate, source, and attribution.

AI should provide:

- Generate a form from a plain-language goal.
- Recommend the minimum fields needed for the goal.
- Improve field wording and microcopy.
- Generate qualification questions.
- Detect redundant or overly invasive questions.
- Suggest conditional logic.
- Recommend the best success CTA.
- Summarize and classify submissions.
- Score lead intent/quality when enough data exists.

### 2. Landing Pages

The page builder is a flagship product surface. It should support:

- Template-first creation with strong defaults.
- Creator, service business, agency, local business, coach/consultant, lead magnet, event, waitlist, and offer templates.
- Reusable sections: hero, profile, logo/brand, social proof, benefits, features, testimonials, video/VSL, offer, pricing, FAQ, lead form, product, comparison, guarantee, CTA, footer, social links, and custom content.
- Section add/remove/reorder/duplicate/hide.
- Content editing without requiring a desktop canvas.
- Theme controls for color, typography, spacing, buttons, cards, imagery, and layout.
- Media library and image optimization.
- Mobile-first responsive behavior with safe desktop defaults.
- SEO title/description, canonical URL, Open Graph metadata, favicon/brand image, and share preview.
- Drafts, autosave, save status, preview, publish, unpublish, revision safety, and recovery.
- Fast public rendering and optimized assets.
- Conversion elements connected to real forms/products instead of fake buttons.

AI should provide:

- Business/offer intake from natural language.
- Full first-draft page generation.
- Section-by-section generation and rewriting.
- Brand voice and audience extraction.
- Headline/subheadline/CTA variants.
- Benefits and objection handling.
- FAQ generation.
- Social-proof placement recommendations.
- SEO metadata.
- Conversion critique.
- A/B test ideas and experiment suggestions.
- Plain-language commands such as “make this feel more premium,” “make the CTA stronger,” or “turn this into a coaching offer page.”

### 3. Buy Now Pages

Buy Now is the conversion surface connecting a product to payment and customer data.

Support:

- Product selection and configuration.
- High-quality product/offer presentation.
- Product image gallery.
- Price, compare-at price where supported, currency, benefits, variants/options where in scope, and availability.
- Trust elements, FAQs, guarantee, testimonials, and purchase reassurance.
- Quantity where applicable.
- Checkout CTA and clear loading/error/success states.
- Customer details and payment-provider handoff.
- Order confirmation and next-step messaging.
- Abandoned checkout event architecture.
- Product → checkout → payment → webhook → order → contact/customer → analytics lifecycle.

AI should provide:

- Generate a Buy Now page from a product record.
- Rewrite product/offer copy.
- Recommend price presentation and CTA copy without changing authoritative price data.
- Generate benefit bullets and FAQs.
- Detect missing trust/conversion elements.
- Explain checkout drop-off using real analytics.
- Recommend page improvements based on conversion data.

### 4. Products

Products are reusable commerce records, not merely fields on a page.

Support:

- Product name, slug, description, short description, images/media, price, currency, status, product type, SKU/reference where needed, and metadata.
- Product types that can evolve toward digital products, services, coaching, physical products, subscriptions, memberships, and bundles.
- Draft/active/archived lifecycle.
- Product preview.
- Product reuse across multiple pages/offers.
- Inventory/availability abstraction where required by product type.
- Server-authoritative price and product state.
- Product analytics: views, CTA clicks, checkout starts, purchases, conversion, revenue.
- Product-level SEO/share metadata where appropriate.

AI should provide:

- Product creation from a short description.
- Product copy generation and rewriting.
- Product categorization/type suggestions.
- Benefit/feature extraction.
- FAQ generation.
- SEO metadata.
- Cross-sell/upsell suggestions when the commerce model supports them.
- Performance diagnosis and recommendations.

## Unified Creation UX

The Create action must make these capabilities discoverable without overwhelming the user:

1. **Lead Form** — “Capture leads.”
2. **Landing Page** — “Build a page.”
3. **Buy Now Page** — “Sell something.”
4. **Product** — “Add something to sell.”
5. **AI Build** — “Tell Buy Now what you want to launch.”

Prefer guided flows and bottom sheets over desktop-style configuration panels.

The ideal AI flow is:

`Tell us what you're selling / collecting → AI proposes assets → User reviews → Edit with simple controls → Preview → Publish`

A single offer should be able to connect a landing page, lead form, product, Buy Now page, CRM record, analytics funnel, and automation without requiring the user to manually wire IDs together.

## AI Architecture Rules

- Use an AI provider abstraction so model/provider changes do not rewrite product features.
- Use structured outputs with schema validation.
- Keep prompts/versioning server-side where possible.
- Build context from canonical workspace/domain data.
- Never expose provider secrets in the frontend.
- Never allow AI to directly execute arbitrary code.
- AI-generated mutations must be previewable and validated before persistence.
- High-impact external actions require explicit user approval unless an existing automation policy authorizes them.
- Record AI operation type, workspace, latency, success/failure, token/cost metadata where available, and user acceptance without unnecessarily storing sensitive prompt content.
- AI recommendations must explain the relevant data or reasoning source when practical.
- Never invent business metrics. If data is insufficient, say so.

## API and Data Rules

- Validate every POST/PATCH body with the existing schema architecture or an appropriate shared schema.
- Validate IDs before database queries.
- Scope every private read/write by authenticated workspace.
- Never trust workspace/user IDs supplied by the client as proof of authorization.
- Use bounded pagination for growing collections.
- Use idempotency for payment/webhook/event processing where needed.
- Monetary values must be server-authoritative and represented consistently.
- Published public content must not leak drafts or private workspace data.
- Form submissions must be safe against duplicate creation and abusive traffic.
- Public endpoints must have explicit rate limits.

## Frontend Rules

- Reuse existing UI primitives in `buynow/src/app/components/ui/`.
- Prefer domain components over adding more logic to `App.tsx`.
- Keep API calls in `buynow/src/app/lib/` rather than scattering fetch logic across screens.
- Every new screen needs loading, empty, error, and success states.
- Use optimistic UI only where rollback is well-defined.
- Keep primary actions visible and thumb-reachable on mobile.
- Avoid dense desktop-style toolbars.
- Use drawers/sheets/dialogs for focused configuration.
- Avoid introducing a drag-and-drop desktop canvas as the primary page-building interaction. Section-based mobile editing is preferred.
- Preserve keyboard accessibility and reasonable desktop behavior.

## Testing Requirements

For flagship creation features, cover at minimum:

- Create/save/edit/delete behavior.
- Draft/publish/unpublish lifecycle.
- Workspace isolation.
- Server validation.
- Public rendering.
- Mobile viewport behavior.
- Refresh persistence.
- Form submission → contact creation/update.
- Product → Buy Now page relationship.
- Checkout → order lifecycle.
- AI structured output validation.
- AI failure/fallback behavior.
- Analytics event emission for major funnel steps.

## Definition of Done

A feature is not done because its UI renders. It is done only when:

- The mobile UX is polished.
- Backend persistence is implemented where required.
- Inputs are validated.
- Authorization and workspace isolation are enforced.
- Loading/empty/error/success states exist.
- Refresh preserves state.
- Public rendering is production-safe.
- Relevant analytics events exist.
- Critical behavior has automated test coverage.
- No mock data is presented as production truth.
- Documentation/roadmap status is updated.

## Agent Workflow

1. Read `PRODUCT_ROADMAP.md` and `PRODUCT_ROADMAP_STATUS.md` before starting a roadmap task.
2. Inspect the existing implementation and reuse current domain models/routes/components before designing new ones.
3. Implement one milestone or tightly scoped task at a time.
4. Keep frontend, backend, validation, persistence, analytics, and tests aligned.
5. Do not silently change the product scope.
6. Update roadmap/status checkboxes only for work actually completed and verified.
7. Run the repository's available lint/typecheck/test/build commands before claiming completion.
8. When architecture changes, document the decision in the relevant markdown file.

## Current Priority

The highest-priority product investment is the **Lead Forms + Landing Pages + Buy Now Pages + Products Conversion Builder Suite** defined in `PRODUCT_ROADMAP.md` as the dedicated conversion-builder epic.

Treat this suite as a coherent platform. Do not implement four disconnected CRUD experiences. The goal is to let a user launch a professional lead-capture or selling funnel from a phone with minimal effort and optional AI assistance.
