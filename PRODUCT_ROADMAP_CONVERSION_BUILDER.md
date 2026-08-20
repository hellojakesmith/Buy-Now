# Buy Now — Conversion Builder Suite Roadmap

> Dedicated roadmap for **Lead Forms + Landing Pages + Buy Now Pages + Products**.
>
> This is a flagship product surface. It must be mobile-first, extremely easy to use, AI-assisted, conversion-focused, and capable of producing output at the quality bar of leading commerce/page builders such as Shopify.

## 1. Product Objective

Build one coherent creation system that lets a small-business owner go from an idea to a professional lead-capture or selling experience from a phone with minimal configuration.

### North-star experience

`Idea → AI/Template → Customize → Connect → Preview → Publish → Measure → Improve`

### Core primitives

1. **Lead Form** — capture and qualify demand.
2. **Landing Page** — explain the offer and drive the next action.
3. **Product** — define the thing being sold.
4. **Buy Now Page** — present the offer and convert the customer.

These are not independent CRUD features. They share one content, media, analytics, CRM, and conversion model.

### Primary success metrics

- Time to first published asset.
- Time to first lead.
- Time to first checkout.
- Time to first purchase.
- Page → lead conversion rate.
- Page → checkout conversion rate.
- Checkout → purchase conversion rate.
- Percentage of users completing creation without support.
- AI-generated drafts accepted with minor edits.
- Published assets created from mobile only.

## 2. Product Experience Rules

### Mobile first

- Design for one-handed use and thumb reach.
- Use bottom sheets, drawers, segmented controls, inline editing, and focused screens rather than desktop configuration panels.
- Keep the primary action visible at the bottom when editing.
- Use large touch targets and clear hierarchy.
- Preserve keyboard state and prevent accidental navigation loss.
- Optimize every golden path for a 390px-ish mobile viewport before desktop polish.

### 15-minute launch goal

A first-time user should be able to:

1. Select a template or describe what they want to build.
2. Enter basic business/offer information.
3. Upload a logo/photo/product image if desired.
4. Accept AI-generated copy or edit it.
5. Connect a form/product.
6. Preview the result.
7. Publish/share it.

No HTML, CSS, funnel, CRM, schema, or technical knowledge should be required.

### Progressive disclosure

The default editor should expose only the controls that matter to the current task. Advanced settings should be available but hidden until requested.

## 3. EPIC CB-1 — Shared Conversion Builder Architecture

**Goal:** Establish shared primitives so forms, pages, products, and Buy Now experiences compose cleanly.

### Tasks

- [ ] Define canonical relationships between Page, Form, Product, MediaAsset, Contact, FormSubmission, Order, and analytics events.
- [ ] Define versioned schemas for page sections, form definitions, product records, and Buy Now configuration.
- [ ] Define shared media reference model.
- [ ] Define shared CTA/action model.
- [ ] Define shared theme/design-token model.
- [ ] Define shared publish/draft/revision model.
- [ ] Define preview-safe rendering contract.
- [ ] Define conversion event taxonomy.
- [ ] Define attribution/UTM propagation rules.
- [ ] Define AI structured-output contracts.
- [ ] Add schema versioning/migrations where required.
- [ ] Prevent duplicate domain objects when an existing model already represents the concept.

### Exit gate

A page can reference a real form and/or product without duplicating business data, and the public renderer can safely resolve published versions.

## 4. EPIC CB-2 — Lead Forms: Best-in-Class Mobile Form Builder

**Goal:** Make creating a high-converting form as simple as composing a message on a phone.

### Templates

- [ ] Lead generation.
- [ ] Consultation/application.
- [ ] Quote request.
- [ ] Contact us.
- [ ] Waitlist.
- [ ] Event registration.
- [ ] Client intake.
- [ ] Custom.
- [ ] AI-generated form.

### Builder

- [ ] Add/edit/delete fields.
- [ ] Duplicate fields.
- [ ] Reorder fields.
- [ ] Required/optional controls.
- [ ] Text.
- [ ] Email.
- [ ] Phone.
- [ ] Number.
- [ ] Textarea.
- [ ] Select.
- [ ] Multi-select.
- [ ] Radio.
- [ ] Checkbox.
- [ ] Date.
- [ ] URL.
- [ ] File upload where appropriate.
- [ ] Hidden attribution fields.
- [ ] Placeholder/help text.
- [ ] Validation rules.
- [ ] Field-level conditional visibility.
- [ ] Form title/description.
- [ ] Success message.
- [ ] Redirect.
- [ ] Submission routing.
- [ ] Contact create/update behavior.
- [ ] Opportunity creation.
- [ ] Pipeline stage selection.
- [ ] Notification configuration.
- [ ] Automation trigger configuration.

### UX

- [ ] Template-first creation.
- [ ] Inline field editing.
- [ ] One-screen mobile preview.
- [ ] Sticky save/publish action.
- [ ] Autosave.
- [ ] Save-state indicator.
- [ ] Undo/redo where practical.
- [ ] Draft recovery.
- [ ] Clear empty/error states.

### Publishing

- [ ] Draft/published/unpublished lifecycle.
- [ ] Public URL.
- [ ] Share action.
- [ ] QR code.
- [ ] Embed option.
- [ ] Publish validation.
- [ ] Public renderer.
- [ ] Rate limiting.
- [ ] Spam/abuse protection.
- [ ] Duplicate submission handling.
- [ ] Server-side validation.

### Analytics

- [ ] Form view.
- [ ] Form start.
- [ ] Field interaction where useful.
- [ ] Abandonment.
- [ ] Submission.
- [ ] Submission conversion rate.
- [ ] UTM/source attribution.

### AI

- [ ] “Create a form for…” natural-language flow.
- [ ] Generate form fields from business goal.
- [ ] Recommend minimum viable fields.
- [ ] Improve labels/placeholders/help text.
- [ ] Generate qualification questions.
- [ ] Suggest conditional logic.
- [ ] Detect redundant questions.
- [ ] Improve success message/CTA.
- [ ] Summarize submissions.
- [ ] Classify intent.
- [ ] Recommend lead priority.

### Exit gate

A user can describe the lead they want to capture, generate a valid form, make minor edits, publish it, and receive a real persisted submission that creates/updates a CRM contact.

## 5. EPIC CB-3 — Landing Pages: Flagship Mobile Page Builder

**Goal:** Produce professional, conversion-focused pages without forcing users to learn website design.

### Template library

- [ ] Creator brand.
- [ ] Coach/consultant.
- [ ] Service business.
- [ ] Agency.
- [ ] Local business.
- [ ] Lead magnet.
- [ ] Webinar/event.
- [ ] Waitlist.
- [ ] Product offer.
- [ ] High-converting sales/offer page.
- [ ] AI-generated custom starting point.

### Section library

- [ ] Hero.
- [ ] Profile/about.
- [ ] Logo/brand strip.
- [ ] Social links.
- [ ] Benefits.
- [ ] Features.
- [ ] Testimonials.
- [ ] Reviews/social proof.
- [ ] Video/VSL.
- [ ] Offer.
- [ ] Pricing.
- [ ] Comparison.
- [ ] Guarantee.
- [ ] FAQ.
- [ ] Lead form.
- [ ] Product.
- [ ] Buy Now CTA.
- [ ] Countdown where appropriate.
- [ ] Image/gallery.
- [ ] Rich text.
- [ ] Footer.

### Editing

- [ ] Add section.
- [ ] Edit section.
- [ ] Duplicate section.
- [ ] Reorder section.
- [ ] Hide/show section.
- [ ] Section-specific settings.
- [ ] Global theme.
- [ ] Colors.
- [ ] Typography.
- [ ] Buttons.
- [ ] Cards.
- [ ] Spacing.
- [ ] Border/radius/shadow controls.
- [ ] Media upload.
- [ ] Media library.
- [ ] Image focal point/crop where appropriate.
- [ ] Autosave.
- [ ] Undo/redo.
- [ ] Draft recovery.
- [ ] Preview.
- [ ] Publish.

### Responsive/rendering

- [ ] Mobile-first renderer.
- [ ] Responsive layout rules.
- [ ] Published revision isolation.
- [ ] Fast loading.
- [ ] Image optimization.
- [ ] Semantic markup.
- [ ] Accessibility basics.
- [ ] SEO title/description.
- [ ] Canonical URL.
- [ ] Open Graph metadata.
- [ ] Social preview.
- [ ] Favicon/brand image.

### Conversion tools

- [ ] Connect lead form.
- [ ] Connect product.
- [ ] Connect Buy Now page.
- [ ] Track CTA clicks.
- [ ] Track form starts/submissions.
- [ ] Track product views.
- [ ] Track checkout starts.
- [ ] Display real testimonials/social proof data where supported.

### AI

- [ ] Business intake.
- [ ] Audience extraction.
- [ ] Offer extraction.
- [ ] Brand voice extraction.
- [ ] Full page generation.
- [ ] Section generation.
- [ ] Headline variants.
- [ ] CTA variants.
- [ ] Benefit generation.
- [ ] Objection handling.
- [ ] FAQ generation.
- [ ] SEO metadata.
- [ ] Rewrite selected text.
- [ ] “Make this more premium.”
- [ ] “Make this clearer.”
- [ ] “Make this convert better.”
- [ ] Conversion critique.
- [ ] Missing-element detection.
- [ ] A/B test suggestions.
- [ ] AI-generated page specification validated against the renderer schema.

### Exit gate

A user can build and publish a professional page from a phone in approximately 15 minutes, and every CTA that claims to capture or sell is connected to a real product/form flow.

## 6. EPIC CB-4 — Products: Reusable Commerce Foundation

**Goal:** Make Product a reusable, authoritative commerce object.

### Product data

- [ ] Name.
- [ ] Slug.
- [ ] Short description.
- [ ] Long description.
- [ ] Price.
- [ ] Currency.
- [ ] Compare-at price where supported.
- [ ] Product type.
- [ ] Status.
- [ ] Images/media.
- [ ] SKU/reference where required.
- [ ] Metadata.
- [ ] SEO fields.
- [ ] Social preview.

### Lifecycle

- [ ] Draft.
- [ ] Active.
- [ ] Archived.
- [ ] Safe restore/reuse behavior.

### Product types

- [ ] Service.
- [ ] Digital product.
- [ ] Physical product.
- [ ] Coaching/consulting offer.
- [ ] Subscription-ready abstraction.
- [ ] Membership-ready abstraction.
- [ ] Bundle-ready abstraction.

Do not overbuild inventory/subscription systems before the first target customer needs them, but avoid a schema that prevents those future product types.

### Product experience

- [ ] Mobile product editor.
- [ ] Product preview.
- [ ] Media upload.
- [ ] Reuse product on multiple pages.
- [ ] Archive without corrupting historical orders.
- [ ] Server-authoritative price/state.
- [ ] Product performance dashboard.

### AI

- [ ] Create product from plain language.
- [ ] Generate description.
- [ ] Generate short description.
- [ ] Extract benefits/features.
- [ ] Generate FAQ.
- [ ] Generate SEO metadata.
- [ ] Suggest product type.
- [ ] Recommend missing conversion information.
- [ ] Recommend cross-sell/upsell opportunities when supported by the data model.
- [ ] Diagnose product performance.

### Exit gate

A product can be created once, reused across multiple selling surfaces, and remains the authoritative source for price and product identity.

## 7. EPIC CB-5 — Buy Now Pages: Conversion + Checkout Surface

**Goal:** Create a polished purchase experience that connects product presentation to real checkout and order state.

### Page composition

- [ ] Product selection.
- [ ] Product image/gallery.
- [ ] Offer headline.
- [ ] Description.
- [ ] Benefits.
- [ ] Price.
- [ ] Compare-at price where supported.
- [ ] CTA.
- [ ] Testimonials.
- [ ] FAQ.
- [ ] Guarantee/trust content.
- [ ] Purchase reassurance.
- [ ] Optional lead capture before checkout where appropriate.
- [ ] Confirmation/next-step content.

### Checkout

- [ ] Customer details.
- [ ] Payment-provider integration.
- [ ] Server-side total calculation.
- [ ] Checkout session creation.
- [ ] Payment confirmation.
- [ ] Webhook handling.
- [ ] Webhook signature verification.
- [ ] Idempotency.
- [ ] Success state.
- [ ] Failure state.
- [ ] Cancellation state.
- [ ] Refund lifecycle.

### Order/customer lifecycle

- [ ] Create immutable order line items.
- [ ] Associate customer/contact.
- [ ] Persist authoritative totals.
- [ ] Record purchase activity.
- [ ] Emit purchase analytics event.
- [ ] Trigger purchase automations.
- [ ] Preserve historical product/price data when a product later changes.

### Analytics

- [ ] Product view.
- [ ] CTA click.
- [ ] Checkout start.
- [ ] Checkout abandonment.
- [ ] Payment success.
- [ ] Payment failure.
- [ ] Purchase.
- [ ] Revenue.
- [ ] Conversion rate.

### AI

- [ ] Generate Buy Now page from Product.
- [ ] Generate offer copy.
- [ ] Generate benefits.
- [ ] Generate FAQs.
- [ ] Recommend trust elements.
- [ ] Recommend CTA copy.
- [ ] Explain conversion drop-off using actual events.
- [ ] Suggest experiments.
- [ ] Recommend improvements without silently changing authoritative financial data.

### Exit gate

`Product → Buy Now page → Checkout → Payment provider → Verified webhook → Paid Order → Contact/Customer → Analytics` works end-to-end with server-authoritative financial state.

## 8. EPIC CB-6 — AI “Build It For Me” Orchestrator

**Goal:** Collapse the four primitives into one guided AI launch experience.

### Example prompt

> “I sell a $499 coaching program for busy women who want to lose weight. Build me a lead form, landing page, product, and Buy Now page.”

### AI plan

- [ ] Parse business context.
- [ ] Extract audience.
- [ ] Extract offer.
- [ ] Extract price/currency.
- [ ] Determine whether a lead form is useful.
- [ ] Propose form fields.
- [ ] Create a product draft.
- [ ] Create a landing page draft.
- [ ] Create a Buy Now page draft.
- [ ] Connect all entities.
- [ ] Generate copy using one consistent brand voice.
- [ ] Show a review screen before persistence/publishing.
- [ ] Highlight assumptions.
- [ ] Allow user to edit individual generated assets.
- [ ] Publish only after explicit user confirmation.

### Guardrails

- [ ] Structured output only.
- [ ] Validate all generated records.
- [ ] Never invent payment credentials.
- [ ] Never invent analytics results.
- [ ] Never alter authoritative price without confirmation.
- [ ] Never publish without user approval.
- [ ] Never execute arbitrary generated code.

### Exit gate

A user can request an entire launch package in natural language, review the generated assets, make changes, and publish the connected funnel without manually wiring IDs or navigating multiple technical screens.

## 9. EPIC CB-7 — Conversion Intelligence

**Goal:** Make the builder improve over time using real performance data.

### Tasks

- [ ] Unified funnel dashboard.
- [ ] Page conversion analysis.
- [ ] Form conversion analysis.
- [ ] Product conversion analysis.
- [ ] Buy Now conversion analysis.
- [ ] Traffic/source analysis.
- [ ] Drop-off detection.
- [ ] Mobile performance analysis.
- [ ] Content quality checks.
- [ ] AI conversion recommendations.
- [ ] AI experiment suggestions.
- [ ] Before/after measurement.
- [ ] Explain recommendations using source metrics.

### Exit gate

The product can answer “What should I change to get more leads/sales?” using actual funnel data and can link recommendations directly to the asset that should be improved.

## 10. EPIC CB-8 — Quality, Performance & Trust

**Goal:** Ensure the suite is production-grade, fast, safe, and reliable.

### Tasks

- [ ] Unit tests for schema/relationship rules.
- [ ] API integration tests.
- [ ] Public renderer tests.
- [ ] Mobile viewport E2E tests.
- [ ] Publish/unpublish tests.
- [ ] Form submission tests.
- [ ] Product/order tests.
- [ ] Payment webhook/idempotency tests.
- [ ] Workspace isolation tests.
- [ ] AI structured-output tests.
- [ ] AI fallback/error tests.
- [ ] Performance budget for published pages.
- [ ] Image optimization.
- [ ] Public endpoint rate limits.
- [ ] Error monitoring.
- [ ] Analytics reconciliation.
- [ ] Accessibility checks.
- [ ] SEO validation.

### Exit gate

The four builders have automated coverage for critical flows and no known P0/P1 defects in creation, publishing, public rendering, lead capture, or payment.

## 11. Milestones

### CB-M0 — Architecture

- Shared schemas and relationships defined.
- Existing models reused where appropriate.
- Versioning strategy documented.

### CB-M1 — Lead Forms

- Templates.
- Mobile builder.
- Public publishing.
- Real submissions.
- CRM connection.
- Basic analytics.
- AI form generation.

### CB-M2 — Landing Pages

- Template library.
- Section library.
- Mobile editor.
- Public renderer.
- SEO/share metadata.
- Form/product connections.
- AI page generation.

### CB-M3 — Products

- Product CRUD.
- Product lifecycle.
- Media.
- Reuse across surfaces.
- AI product creation.

### CB-M4 — Buy Now

- Product-linked offer page.
- Checkout.
- Payment/webhooks.
- Orders.
- Customer association.
- Purchase analytics.
- AI conversion assistance.

### CB-M5 — AI Launch Orchestrator

- Natural-language launch request.
- Generate all connected assets.
- Review/edit flow.
- Explicit publish approval.

### CB-M6 — Conversion Intelligence

- Funnel analytics.
- AI recommendations.
- Experiment suggestions.
- Performance feedback loop.

### CB-M7 — Production Gate

- E2E tests.
- Security/tenant isolation.
- Performance.
- Accessibility.
- SEO.
- Monitoring.
- No critical defects.

## 12. Golden User Journeys

### Journey A — Lead capture

`Create → Lead Form → Template/AI → Customize → Preview → Publish → Share → Submission → Contact`

### Journey B — Lead-generation landing page

`Create → Landing Page → Template/AI → Add form → Preview → Publish → Visitor → Form → Lead`

### Journey C — Sell a product

`Create → Product → Product details → AI copy → Save → Buy Now Page → Preview → Checkout → Purchase`

### Journey D — Full launch

`AI Build → Product + Landing Page + Lead Form + Buy Now Page → Review → Publish → Measure`

### Journey E — Improve conversion

`Analytics → AI diagnosis → Recommended change → Edit → Publish → Measure again`

## 13. Definition of Done

A roadmap task is complete only when:

- [ ] It works on mobile.
- [ ] It uses real persisted data where persistence is required.
- [ ] Inputs are validated client and server side as appropriate.
- [ ] Authorization and workspace isolation are enforced.
- [ ] Loading/empty/error/success states exist.
- [ ] Public content is safe and does not expose drafts.
- [ ] Analytics events are emitted where applicable.
- [ ] AI output is schema validated.
- [ ] AI failures have a graceful fallback.
- [ ] Financial state is server authoritative.
- [ ] Critical behavior has automated tests.
- [ ] Documentation and roadmap status are updated.

## 14. Strategic Product Bar

The goal is not to clone Shopify's desktop editor.

The goal is to beat traditional builders on the dimension that matters most to this product's target customer:

**professional output with dramatically less work.**

Buy Now should combine:

`Shopify-quality commerce primitives + modern landing-page quality + Typeform-quality forms + CRM context + AI creation + mobile-first simplicity`

The differentiator is the unified workflow:

> **“Tell Buy Now what you want to launch. It builds the pieces, connects them, shows you the result, and helps you improve it.”**
