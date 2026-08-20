# Buy Now — Product Roadmap

> **Purpose:** Turn the current prototype into a production-ready, mobile-first business operating system for creators, coaches, consultants, and small businesses.
>
> **Primary product loop:** **Create → Capture → Manage → Sell → Measure → Improve**
>
> **Long-term moat:** structured business/customer data + automation + AI that can act on that data safely.

---

## 0. Current-State Assessment

This roadmap is based on the current repository rather than a greenfield assumption.

### What already exists

- React/Vite mobile-first frontend.
- Express/TypeScript backend.
- MongoDB/Mongoose workspace-first data model.
- Core models for Workspace, User, Contact, Form, FormSubmission, Pipeline, Opportunity, Product, Page, MediaAsset, Order, Activity, and Notification.
- Real API-backed dashboard data loading for contacts, opportunities, products, pages, orders, forms, notifications, activities, pipeline, and dashboard summary.
- Page CRUD and publish endpoints.
- Public page/form endpoint architecture.
- GridFS media architecture.
- Initial mobile navigation and creation flows.
- Initial landing-page templates and page-builder concepts.
- Initial checkout/product concepts.

The backend README explicitly identifies request validation, pagination/search helpers, real authentication, and payment/publishing integrations as remaining production work. fileciteturn28file0

### What is still prototype-grade

- The frontend still contains substantial mock/demo data and UI logic in `App.tsx`.
- `App.tsx` is too large and should be decomposed incrementally.
- The current authentication flow is bootstrap/context based rather than real production authentication.
- Client context is stored locally and sent through workspace/user headers.
- Page publishing currently changes page state but does not by itself establish a complete production publishing/CDN/SEO pipeline.
- Page routes accept arbitrary request bodies without a comprehensive schema-validation layer.
- List endpoints are not yet consistently paginated/searchable.
- Analytics currently derives dashboard chart values from activity/contact data and includes synthetic visitor calculations rather than a true page/event analytics pipeline.
- Checkout/order architecture exists, but a production payment provider + webhook lifecycle is still required.
- The frontend package is still named like a Figma-generated project (`@figma/my-make-file`), indicating remaining production cleanup.

The current frontend data layer loads the major backend resources, but also contains fallback/sample-oriented transformations and synthetic analytics behavior that must not become the production source of truth. fileciteturn32file0

The current page API provides CRUD/publish behavior but still needs production validation, publishing guarantees, and public rendering hardening. fileciteturn34file0

The current auth endpoint is a bootstrap mechanism that creates/reuses a workspace/user and returns raw workspace/user IDs; it should be replaced or wrapped by real authentication/session infrastructure before production. fileciteturn35file0

The existing task list already defines the broad feature progression, but this roadmap expands it into dependency-aware epics, milestones, acceptance criteria, and launch gates. fileciteturn29file0

---

# 1. Product Vision

Buy Now should become the simplest way for a small business to launch and operate a revenue-generating online presence without stitching together multiple SaaS products.

A customer should be able to:

1. Create an account/workspace.
2. Choose a business/creator template.
3. Build a professional page in under 15 minutes.
4. Create a lead form.
5. Publish/share the page.
6. Capture leads automatically.
7. Manage leads and opportunities.
8. Sell products/services through a Buy Now page.
9. Track revenue and conversion.
10. Automate follow-up.
11. Use AI to improve the entire funnel.

### North-star metric

**Activated businesses with a published page and at least one captured lead or completed purchase.**

Supporting metrics:

- Time to first published page.
- Time to first lead.
- Time to first sale.
- Page → lead conversion rate.
- Lead → opportunity conversion rate.
- Opportunity → customer conversion rate.
- Revenue per active workspace.
- Weekly active workspaces.
- AI-assisted actions accepted by users.

---

# 2. Milestone Map

| Milestone | Outcome | Exit Gate |
|---|---|---|
| M0 | Scope + architecture locked | V1 scope and contracts approved |
| M1 | Production foundation | Secure authenticated workspace exists |
| M2 | Lead capture engine | Public form → persisted contact works |
| M3 | CRM + pipeline | Lead → opportunity → follow-up works |
| M4 | Creator page builder | Template → edit → preview → publish works |
| M5 | Commerce | Product → checkout → paid order works |
| M6 | Analytics + automation | Funnel metrics and event-triggered actions work |
| M7 | AI v1 | AI creates, analyzes, and assists safely |
| M8 | Production launch | Critical E2E tests pass and monitoring is live |
| M9 | Growth platform | Multi-channel automation + AI operating layer |

Recommended sequence: **M0 → M1 → M2 → M3 → M4 → M5 → M6 → M7 → M8 → M9**.

Do not start AI-heavy product work before the underlying data/event model is trustworthy.

---

# EPIC 0 — Product Scope, Architecture & Technical Baseline

**Goal:** Establish one clear V1 definition and eliminate architectural ambiguity before adding more surface area.

### Tasks

- [ ] Define V1 customer persona.
- [ ] Define V1 primary use cases.
- [ ] Define V1 feature cut line.
- [ ] Define explicit post-V1 backlog.
- [ ] Document canonical domain entities.
- [ ] Document frontend/backend ownership boundaries.
- [ ] Define API response contracts.
- [ ] Define authentication/session architecture.
- [ ] Define public vs authenticated routes.
- [ ] Define page schema versioning strategy.
- [ ] Define analytics event taxonomy.
- [ ] Define payment/order state machine.
- [ ] Define automation event/action contract.
- [ ] Define AI provider abstraction.
- [ ] Add repository development scripts for lint/typecheck/test where missing.
- [ ] Rename production package metadata away from Figma-generated naming.
- [ ] Remove dead dependencies where verified safe.
- [ ] Establish environment variable conventions.
- [ ] Establish staging vs production configuration.

### Milestone M0 — Architecture Locked

**Acceptance criteria:**

- V1 scope fits on one page.
- Every V1 feature maps to an existing or planned domain entity.
- No new feature may introduce a duplicate Contact/Lead/Customer model without an approved ADR.
- Frontend/backend contracts are documented.
- Production authentication, payments, analytics, and publishing architecture are explicitly defined.

---

# EPIC 1 — Production Authentication & Workspace Security

**Goal:** Replace prototype bootstrap identity with secure, persistent authentication and tenant isolation.

### Tasks

- [ ] Implement sign-up.
- [ ] Implement sign-in.
- [ ] Implement sign-out.
- [ ] Implement session/token management.
- [ ] Implement secure session persistence.
- [ ] Implement password reset or production identity provider.
- [ ] Add email verification if email/password is used.
- [ ] Implement authenticated `/me` flow.
- [ ] Remove dependence on browser-provided identity headers as proof of identity.
- [ ] Derive workspace/user context from authenticated session.
- [ ] Add workspace membership model/permissions.
- [ ] Add owner/admin/member roles.
- [ ] Add invitation flow.
- [ ] Add workspace switching if multi-workspace accounts are supported.
- [ ] Audit every private route for workspace scoping.
- [ ] Audit every `_id` lookup for tenant isolation.
- [ ] Add authorization middleware.
- [ ] Add rate limiting to auth/public submission endpoints.
- [ ] Add CSRF protection where cookie sessions require it.
- [ ] Add security headers.
- [ ] Add audit logging for permission changes.

### Milestone M1A — Secure Identity

**Acceptance criteria:**

- A user can create/login to an account.
- A session survives refresh securely.
- Logout invalidates the session.
- Workspace context cannot be forged from client headers.
- Cross-workspace reads/writes are rejected.
- Unauthorized users cannot access private application APIs.

---

# EPIC 2 — API Contracts, Validation & Backend Hardening

**Goal:** Make every API endpoint predictable, validated, observable, and safe.

### Tasks

- [ ] Add request schemas for every POST/PATCH endpoint.
- [ ] Validate ObjectIds before database operations.
- [ ] Validate enums and state transitions.
- [ ] Validate email/URL/slug fields.
- [ ] Validate prices/currency/monetary values.
- [ ] Validate page section schemas.
- [ ] Validate form field schemas.
- [ ] Validate pagination parameters.
- [ ] Validate sorting/filter parameters.
- [ ] Standardize API error responses.
- [ ] Add request IDs/correlation IDs.
- [ ] Add structured server logging.
- [ ] Add safe production error handling.
- [ ] Add database indexes for high-volume queries.
- [ ] Add pagination to all growing collections.
- [ ] Add search/filter support to contacts.
- [ ] Add search/filter support to opportunities.
- [ ] Add search/filter support to orders.
- [ ] Add search/filter support to products/pages/forms.
- [ ] Add consistent created/updated timestamps.
- [ ] Add optimistic concurrency/version strategy where needed.

### Milestone M1B — Reliable API

**Acceptance criteria:**

- Invalid requests fail before unsafe database writes.
- All list APIs support bounded results.
- API errors have a consistent shape.
- High-volume queries have indexes.
- Every private query is workspace-scoped.

---

# EPIC 3 — Frontend Architecture & App Shell

**Goal:** Turn the current large prototype UI into a maintainable product shell without breaking existing behavior.

The current frontend already has mobile navigation, Home, Leads, Pipeline, More, creation flows, and many feature screens, but much of this is concentrated in `App.tsx`. fileciteturn31file0

### Tasks

- [ ] Preserve current working UI while extracting domains incrementally.
- [ ] Extract navigation components.
- [ ] Extract screen header components.
- [ ] Extract common cards/list rows.
- [ ] Extract form-builder components.
- [ ] Extract CRM components.
- [ ] Extract pipeline components.
- [ ] Extract page-builder components.
- [ ] Extract product/checkout components.
- [ ] Extract analytics components.
- [ ] Extract settings components.
- [ ] Create domain-specific hooks.
- [ ] Keep API operations in service/lib modules.
- [ ] Remove duplicate local data transformations.
- [ ] Remove hard-coded user identity.
- [ ] Add route-level loading boundaries.
- [ ] Add global error boundary.
- [ ] Add consistent toast/error behavior.
- [ ] Standardize empty states.
- [ ] Standardize skeleton/loading states.
- [ ] Add mobile safe-area handling consistently.
- [ ] Verify keyboard/input behavior on iOS/Android.

### Milestone M1C — Maintainable App Shell

**Acceptance criteria:**

- Core navigation works.
- No critical product behavior depends on sample arrays in `App.tsx`.
- New features can be added without modifying unrelated screens.
- Mobile navigation and creation entry points are stable.

---

# EPIC 4 — Form Builder & Lead Capture

**Goal:** Make form creation and public lead capture production-ready.

### Tasks

#### Form creation

- [x] Template chooser.
- [x] Lead generation template.
- [x] Consultation template.
- [ ] Quote/request template.
- [x] Custom form template.
- [x] Add field.
- [x] Edit field.
- [x] Required toggle.
- [ ] Field duplication.
- [x] Field deletion.
- [ ] Field reordering.
- [x] Field types: text, email, phone, textarea, select, checkbox, date.
- [x] Field validation.
- [ ] Placeholder/help text.
- [x] Form title/description.
- [x] Success message.
- [ ] Submission action configuration.

#### Publishing

- [x] Draft state.
- [x] Published state.
- [x] Preview.
- [x] Public URL.
- [x] Share link.
- [ ] QR code.
- [x] Embed snippet.
- [x] Unpublish.
- [x] Slug uniqueness.

#### Public form

- [x] Mobile renderer.
- [x] Client validation.
- [x] Server validation.
- [x] Spam/rate-limit protection.
- [x] Submission persistence.
- [x] Contact creation/update.
- [x] Opportunity creation when configured.
- [x] Submission success state.
- [x] Duplicate submission handling.

### Milestone M2 — Lead Capture Engine

**Golden path:**

`Create form → Publish → Open public URL → Submit → FormSubmission persisted → Contact created/updated → Activity recorded`

**Acceptance criteria:**

- A non-authenticated visitor can submit a published form.
- Invalid submissions are rejected server-side.
- The same person does not create uncontrolled duplicate contacts.
- Workspace ownership is preserved.
- Submission events are measurable.

---

# EPIC 5 — CRM / Contacts

**Goal:** Make Contact the canonical customer/lead record.

### Tasks

- [ ] Leads list.
- [ ] Customer list/filter.
- [ ] Search.
- [ ] Sorting.
- [ ] Status filter.
- [ ] Source filter.
- [ ] Tags.
- [ ] Contact detail.
- [ ] Contact edit.
- [ ] Contact notes.
- [ ] Activity timeline.
- [ ] Form submission history.
- [ ] Opportunity history.
- [ ] Purchase history.
- [ ] Contact archive/unarchive.
- [ ] Contact merge/deduplication strategy.
- [ ] Follow-up task/reminder.
- [ ] Contact ownership.
- [ ] Bulk operations where useful.

### Milestone M3A — Usable CRM

**Acceptance criteria:**

- Every form submission can be traced to a contact.
- A user can search/filter contacts.
- A contact has a unified timeline.
- Leads and customers are represented by one canonical contact record.

---

# EPIC 6 — Pipeline & Sales Management

**Goal:** Turn captured leads into managed opportunities and revenue.

### Tasks

- [ ] Default pipeline.
- [ ] Custom pipeline stages.
- [ ] Stage ordering.
- [ ] Stage colors.
- [ ] Opportunity creation.
- [ ] Opportunity edit.
- [ ] Opportunity value.
- [ ] Expected close date.
- [ ] Source.
- [ ] Owner.
- [ ] Stage movement.
- [ ] Won/lost state.
- [ ] Lost reason.
- [ ] Pipeline board view.
- [ ] Mobile-friendly pipeline list view.
- [ ] Follow-up tasks.
- [ ] Stale opportunity detection.
- [ ] Opportunity activity history.
- [ ] Pipeline value summary.
- [ ] Weighted pipeline value.

### Milestone M3B — Sales Pipeline

**Golden path:**

`Contact → Opportunity → Stage → Follow-up → Won → Customer`

**Acceptance criteria:**

- Opportunities persist correctly.
- Stage changes are reflected everywhere.
- Won/lost state is explicit.
- Pipeline totals come from database records, not mock state.

---

# EPIC 7 — Creator Brand / Landing Page Builder

**Goal:** Make the page builder the flagship creation experience.

### Tasks

#### Template system

- [ ] Creator Brand template.
- [ ] Modern Agency template.
- [ ] Service Business template.
- [ ] Local Business template.
- [ ] Future offer/product templates.
- [ ] Template metadata.
- [ ] Template versioning.

#### Section system

- [ ] Hero.
- [ ] Profile.
- [ ] Social links.
- [ ] Offer.
- [ ] Benefits.
- [ ] Testimonials.
- [ ] Social proof.
- [ ] Video/VSL.
- [ ] FAQ.
- [ ] Lead form.
- [ ] Product.
- [ ] Pricing.
- [ ] CTA.
- [ ] Footer.

#### Editor

- [ ] Template selection.
- [ ] Content editing.
- [ ] Theme selection.
- [ ] Typography.
- [ ] Media upload.
- [ ] Section reorder.
- [ ] Section hide/show.
- [ ] Section duplication.
- [ ] Autosave.
- [ ] Save status.
- [ ] Preview.
- [ ] Publish.
- [ ] Draft recovery.
- [ ] Undo/redo where practical.

#### Public rendering

- [ ] Public page renderer.
- [ ] Mobile-first responsive renderer.
- [ ] SEO metadata.
- [ ] Open Graph metadata.
- [ ] Canonical URL.
- [ ] Favicon/brand image.
- [ ] Fast loading.
- [ ] Image optimization.
- [ ] Published revision isolation.

### Milestone M4 — 15-Minute Page Launch

**Golden path:**

`Choose template → Add brand/content → Add CTA/form → Preview → Publish`

**Acceptance criteria:**

- A new user can create a professional page in approximately 15 minutes.
- Preview and public page use the same page schema/renderer logic.
- Publishing never exposes draft/private workspace data.
- Mobile experience is excellent before desktop optimization.

---

# EPIC 8 — Media Infrastructure

**Goal:** Make images/video reliable and fast across pages/products/forms.

### Tasks

- [ ] Upload image.
- [ ] Upload video.
- [ ] Validate MIME type.
- [ ] Validate file size.
- [ ] Generate metadata.
- [ ] Generate dimensions.
- [ ] Generate thumbnails where appropriate.
- [ ] Media library.
- [ ] Search/filter media.
- [ ] Attach media to pages/products.
- [ ] Remove media references safely.
- [ ] Delete unused assets.
- [ ] CDN/object-storage abstraction.
- [ ] Image resizing/optimization.
- [ ] Public caching.

### Milestone M4A — Production Media

**Acceptance criteria:**

- Media uploads are validated.
- Public pages load optimized media.
- Deleted assets do not break existing published pages unexpectedly.

---

# EPIC 9 — Commerce & Buy Now Checkout

**Goal:** Enable real revenue collection with authoritative server-side financial state.

### Tasks

#### Products

- [ ] Product create.
- [ ] Product edit.
- [ ] Product archive.
- [ ] Product image.
- [ ] Product description.
- [ ] Price.
- [ ] Currency.
- [ ] Product status.
- [ ] Product type abstraction for services/digital/physical.

#### Buy Now pages

- [ ] Product selection.
- [ ] Offer presentation.
- [ ] CTA.
- [ ] Checkout launch.
- [ ] Success state.
- [ ] Failure state.
- [ ] Cancel state.

#### Payments

- [ ] Select payment provider.
- [ ] Provider account/connect flow if required.
- [ ] Server-side price calculation.
- [ ] Checkout session creation.
- [ ] Payment confirmation.
- [ ] Webhook endpoint.
- [ ] Webhook signature verification.
- [ ] Idempotency.
- [ ] Failed payment handling.
- [ ] Refund state.
- [ ] Currency handling.

#### Orders

- [ ] Immutable order line items.
- [ ] Order number.
- [ ] Payment status.
- [ ] Customer association.
- [ ] Product association.
- [ ] Total/subtotal/discount/tax/shipping fields.
- [ ] Order detail.
- [ ] Order list.
- [ ] Revenue summary.

### Milestone M5 — First Real Sale

**Golden path:**

`Product → Buy Now page → Checkout → Payment provider → Webhook → Paid Order → Contact/Customer → Activity`

**Acceptance criteria:**

- Browser state cannot mark an order paid.
- Server calculates authoritative totals.
- Webhooks are signature-verified and idempotent.
- Paid orders persist correctly.
- Customer/contact association works.
- A refund/failure does not corrupt historical financial records.

---

# EPIC 10 — Analytics & Event Tracking

**Goal:** Replace synthetic/demo analytics with a real event pipeline.

The current frontend analytics helper derives visitor numbers from activities and contacts; this is useful for prototype visualization but is not a real visitor/event measurement system. fileciteturn32file0

### Tasks

- [ ] Define event taxonomy.
- [ ] Create analytics event model/storage.
- [ ] Page view tracking.
- [ ] Form view tracking.
- [ ] Form start tracking.
- [ ] Form submission tracking.
- [ ] CTA click tracking.
- [ ] Checkout start tracking.
- [ ] Purchase tracking.
- [ ] Product view tracking.
- [ ] Lead creation event.
- [ ] Opportunity creation event.
- [ ] Stage-change event.
- [ ] Revenue event.
- [ ] UTM/source attribution.
- [ ] Funnel calculation.
- [ ] Conversion rates.
- [ ] Revenue analytics.
- [ ] Page performance.
- [ ] Form performance.
- [ ] Product performance.
- [ ] Pipeline performance.
- [ ] Date range filters.
- [ ] Analytics dashboard.

### Milestone M6A — Trustworthy Analytics

**Acceptance criteria:**

- Dashboard metrics are derived from actual events/domain data.
- Visitor, lead, checkout, and purchase events can be traced.
- Conversion metrics reconcile with persisted records.
- No synthetic visitor counts remain in production analytics.

---

# EPIC 11 — Automation Engine

**Goal:** Let users automate repetitive growth and sales work.

### Core architecture

`Event → Conditions → Actions`

### Tasks

- [ ] Define trigger schema.
- [ ] Define condition schema.
- [ ] Define action schema.
- [ ] Automation model.
- [ ] Automation execution log.
- [ ] Enable/disable automation.
- [ ] Form submitted trigger.
- [ ] Contact created trigger.
- [ ] Opportunity created trigger.
- [ ] Stage changed trigger.
- [ ] Purchase trigger.
- [ ] Checkout abandoned trigger.
- [ ] Payment failed trigger.
- [ ] Page published trigger.
- [ ] Send email action.
- [ ] Create task action.
- [ ] Update contact action.
- [ ] Update opportunity action.
- [ ] Change stage action.
- [ ] Send notification action.
- [ ] Webhook action.
- [ ] Retry policy.
- [ ] Idempotency.
- [ ] Execution history.
- [ ] Failure alerts.

### Milestone M6B — Automation V1

**Acceptance criteria:**

- At least three useful trigger/action workflows work end-to-end.
- Automation execution is observable.
- Duplicate events do not create duplicate actions.
- Failures retry safely and become visible to the user.

---

# EPIC 12 — Notifications & Follow-Up

**Goal:** Ensure users know what requires attention.

### Tasks

- [ ] Notification center.
- [ ] Read/unread state.
- [ ] Deep links.
- [ ] New lead notification.
- [ ] New purchase notification.
- [ ] Pipeline notification.
- [ ] Failed payment notification.
- [ ] Follow-up reminder.
- [ ] Email notification channel.
- [ ] Push notification architecture.
- [ ] Notification preferences.

### Milestone M6C — Actionable Inbox

**Acceptance criteria:**

- Important business events generate actionable notifications.
- Notifications link directly to the relevant record.
- Users can configure notification preferences.

---

# EPIC 13 — AI Foundation

**Goal:** Add an AI layer that is grounded in actual business data and can evolve across providers/models.

Do not make the first AI feature a generic chat screen. Build reusable AI infrastructure first.

### Tasks

- [ ] Create AI provider abstraction.
- [ ] Create model configuration.
- [ ] Add AI operation registry.
- [ ] Add usage/cost tracking.
- [ ] Add workspace AI settings.
- [ ] Add prompt/version management.
- [ ] Add structured output validation.
- [ ] Add AI request logging with privacy controls.
- [ ] Add context-building service.
- [ ] Add business context retrieval.
- [ ] Add contact context retrieval.
- [ ] Add page/content context retrieval.
- [ ] Add analytics context retrieval.
- [ ] Add AI action permission model.
- [ ] Add human approval mechanism for mutations.

### Milestone M7A — Safe AI Runtime

**Acceptance criteria:**

- AI provider can be swapped without rewriting product features.
- AI-generated structured data is validated before persistence.
- Sensitive secrets are never passed to models.
- Mutating actions require approval unless explicitly authorized by automation policy.
- AI usage can be measured per workspace.

---

# EPIC 14 — AI Page & Content Builder

**Goal:** Make creating a professional page dramatically faster.

### Tasks

- [ ] AI business intake.
- [ ] AI audience extraction.
- [ ] AI offer extraction.
- [ ] AI brand voice extraction.
- [ ] AI page outline generation.
- [ ] AI section generation.
- [ ] AI headline generation.
- [ ] AI CTA generation.
- [ ] AI testimonial/proof placement suggestions.
- [ ] AI FAQ generation.
- [ ] AI SEO metadata generation.
- [ ] AI page rewrite.
- [ ] AI conversion optimization suggestions.
- [ ] Generate structured page specification only.
- [ ] Validate page specification against known section schemas.
- [ ] Preview generated page before publish.

### Milestone M7B — AI Page Launch

**Acceptance criteria:**

A user can describe an offer in plain language and receive a valid page draft using the existing renderer/design system, without AI-generated executable frontend code.

---

# EPIC 15 — AI CRM & Sales Assistant

**Goal:** Make the CRM proactively useful rather than just a database.

### Tasks

- [ ] Lead summary.
- [ ] Lead intent classification.
- [ ] Lead priority score.
- [ ] Recommended next action.
- [ ] Stale opportunity detection.
- [ ] Follow-up draft generation.
- [ ] Objection response draft.
- [ ] Pipeline summary.
- [ ] Daily sales briefing.
- [ ] Hot lead identification.
- [ ] Opportunity risk detection.
- [ ] Customer summary.
- [ ] Purchase history interpretation.
- [ ] AI-generated notes.
- [ ] Human approval for outbound messages.

### Milestone M7C — AI Sales Copilot

**Acceptance criteria:**

- AI recommendations reference actual CRM data.
- Users can see why a recommendation was made.
- AI can draft but does not silently send high-impact external communication.

---

# EPIC 16 — AI Analytics & Business Assistant

**Goal:** Let the owner ask the product what is happening and what to do next.

### Tasks

- [ ] Natural-language analytics questions.
- [ ] Funnel analysis.
- [ ] Conversion diagnosis.
- [ ] Revenue analysis.
- [ ] Lead-source analysis.
- [ ] Page performance analysis.
- [ ] Product performance analysis.
- [ ] Pipeline analysis.
- [ ] Anomaly detection.
- [ ] Daily business briefing.
- [ ] Recommended actions.
- [ ] Explain metric source/data.
- [ ] Drill-down from AI answer into records.
- [ ] AI-generated experiments.

### Milestone M7D — AI Business Assistant

**Acceptance criteria:**

A user can ask questions such as:

- “Which leads should I follow up with today?”
- “Why did my conversion rate drop?”
- “What page is performing best?”
- “What should I do today to increase sales?”

Answers must be grounded in actual application data and expose the relevant metrics/records.

---

# EPIC 17 — Search, Command Center & UX Acceleration

**Goal:** Make the growing product fast to operate.

### Tasks

- [ ] Global search.
- [ ] Search contacts.
- [ ] Search opportunities.
- [ ] Search pages.
- [ ] Search forms.
- [ ] Search products.
- [ ] Search orders.
- [ ] Command/action launcher.
- [ ] Quick create.
- [ ] Quick navigation.
- [ ] Recent records.
- [ ] Keyboard shortcuts for desktop.
- [ ] Mobile quick actions.

### Milestone M9A — Fast Operations

**Acceptance criteria:**

A user can find or create any major business object within a few interactions regardless of where they are in the application.

---

# EPIC 18 — Integrations

**Goal:** Connect Buy Now to the tools businesses already use without compromising the core data model.

### Tasks

- [ ] Payment provider integration.
- [ ] Email provider integration.
- [ ] Calendar integration.
- [ ] Webhooks.
- [ ] CRM export/import.
- [ ] CSV import/export.
- [ ] Analytics integration where valuable.
- [ ] Social/profile links.
- [ ] Optional marketing platform integrations.
- [ ] Integration credentials vault.
- [ ] Integration health/status.

### Milestone M9B — Connected Business

**Acceptance criteria:**

External integrations can be connected/disconnected safely, failures are visible, credentials are protected, and external events can map into the internal event model.

---

# EPIC 19 — Production Observability, QA & Reliability

**Goal:** Make the application dependable enough for real businesses.

### Tasks

- [ ] Unit testing foundation.
- [ ] API integration tests.
- [ ] Database tests.
- [ ] Frontend component tests for critical components.
- [ ] End-to-end browser tests.
- [ ] Mobile viewport test suite.
- [ ] Authentication tests.
- [ ] Tenant-isolation tests.
- [ ] Form submission tests.
- [ ] Page publishing tests.
- [ ] Checkout/payment tests.
- [ ] Webhook idempotency tests.
- [ ] Analytics reconciliation tests.
- [ ] Automation execution tests.
- [ ] AI structured-output tests.
- [ ] Error monitoring.
- [ ] Performance monitoring.
- [ ] Uptime monitoring.
- [ ] Database backups.
- [ ] Restore procedure.
- [ ] Production alerting.

### Milestone M8 — Production Ready

**Acceptance criteria:**

- Critical journeys have automated tests.
- Production errors are observable.
- Database recovery is documented and tested.
- Payment/auth/tenant isolation have regression coverage.
- Release checklist is repeatable.

---

# EPIC 20 — Privacy, Security & Compliance Baseline

**Goal:** Establish the minimum trust layer required to handle customer, business, and payment-related data.

### Tasks

- [ ] Privacy policy.
- [ ] Terms of service.
- [ ] Data retention policy.
- [ ] Account deletion.
- [ ] Workspace deletion.
- [ ] Export user/workspace data.
- [ ] PII minimization.
- [ ] Secure cookies/tokens.
- [ ] Secrets management.
- [ ] Dependency vulnerability scanning.
- [ ] Content security policy.
- [ ] Rate limiting.
- [ ] Abuse prevention.
- [ ] Audit logs.
- [ ] Data deletion workflows.
- [ ] AI data-sharing controls.
- [ ] Payment data boundary review.

### Milestone M8A — Trust Baseline

**Acceptance criteria:**

Users can understand how their data is handled, delete/export their data where required, and the product does not unnecessarily expose sensitive information to third parties or AI providers.

---

# EPIC 21 — Launch, Billing & Commercialization

**Goal:** Turn the product into an actual SaaS business.

### Tasks

- [ ] Define pricing model.
- [ ] Free/trial strategy.
- [ ] Subscription plans.
- [ ] Workspace billing.
- [ ] Usage limits.
- [ ] Feature entitlements.
- [ ] Billing portal.
- [ ] Upgrade/downgrade.
- [ ] Cancellation.
- [ ] Failed billing handling.
- [ ] Product analytics for activation.
- [ ] Onboarding flow.
- [ ] Demo workspace/sample data strategy.
- [ ] Customer support/contact flow.
- [ ] Product feedback mechanism.

### Milestone M8B — Commercial Launch

**Acceptance criteria:**

A new customer can sign up, understand the product, create a useful asset, reach activation, subscribe, and manage their account without manual engineering intervention.

---

# 3. V1 Launch Definition

V1 should **not** attempt to ship the entire long-term AI platform.

The first commercially useful release should contain:

### Required for V1

- [ ] Production authentication.
- [ ] Workspace security.
- [ ] Mobile-first app shell.
- [ ] Lead form templates.
- [ ] Form builder.
- [ ] Public forms.
- [ ] Contact CRM.
- [ ] Pipeline.
- [ ] Creator Brand landing page.
- [ ] Page editor.
- [ ] Preview.
- [ ] Publishing.
- [ ] Media upload.
- [ ] Product creation.
- [ ] Buy Now page.
- [ ] Real checkout/payment.
- [ ] Orders.
- [ ] Basic analytics.
- [ ] Notifications.
- [ ] Basic automation.
- [ ] Error handling.
- [ ] Production monitoring.
- [ ] Privacy/security baseline.

### V1 should defer

- Full marketplace.
- Complex team permissions.
- Large integration catalog.
- Advanced AI autonomous actions.
- Sophisticated marketing automation builder.
- Advanced subscription/product variants unless directly required by the first customer segment.
- Native mobile apps unless web/PWA validation demonstrates a need.

---

# 4. Critical User Journeys

Every release must preserve these journeys.

## Journey A — Launch a lead page

`Sign up → Choose Creator Brand → Add profile/offer → Add form → Preview → Publish → Copy link`

## Journey B — Capture a lead

`Visitor → Public page → Form → Submit → Contact → Activity → Notification`

## Journey C — Manage a lead

`Contact → Opportunity → Stage → Follow-up → Won/Lost`

## Journey D — Sell

`Product → Buy Now page → Checkout → Payment → Webhook → Order → Customer → Revenue`

## Journey E — Understand the business

`Dashboard → Funnel → Lead source → Pipeline → Revenue → Recommendation`

## Journey F — AI-assisted growth

`Business context → AI recommendation → User approval → Action → Event → Measurement`

---

# 5. Engineering Rules for Every Epic

Every implementation must satisfy:

- [ ] Mobile-first UX.
- [ ] Real persistence.
- [ ] Workspace isolation.
- [ ] Backend validation.
- [ ] Loading state.
- [ ] Empty state.
- [ ] Error state.
- [ ] Success state.
- [ ] Accessibility basics.
- [ ] No fake production analytics.
- [ ] No client-authoritative financial state.
- [ ] No secrets in frontend code.
- [ ] No unbounded production list queries.
- [ ] No arbitrary AI-generated executable code.
- [ ] No silent high-impact AI actions.
- [ ] No duplicate domain entities without an explicit architectural decision.
- [ ] Existing functionality must continue to work.

---

# 6. Definition of Done

A task is **not complete** because the UI renders.

A feature is complete only when:

1. The UI works on mobile.
2. The backend supports the operation where persistence is required.
3. Input is validated.
4. Authorization is enforced.
5. Workspace isolation is verified.
6. Loading/empty/error/success states exist.
7. Data survives refresh.
8. The feature participates in the correct activity/event model.
9. Analytics are measurable where applicable.
10. Critical behavior has automated test coverage.
11. No prototype/mock data is presented as production truth.
12. Documentation is updated when architecture changes.

---

# 7. Recommended Execution Order

Do **not** give an AI coding agent the entire roadmap and ask it to “build the app.” Work milestone by milestone.

### Sprint Group 1 — Foundation

1. EPIC 0 — Scope/architecture.
2. EPIC 1 — Authentication/security.
3. EPIC 2 — API validation/hardening.
4. EPIC 3 — Frontend architecture.

### Sprint Group 2 — Acquisition

5. EPIC 4 — Forms.
6. EPIC 5 — CRM.
7. EPIC 6 — Pipeline.

### Sprint Group 3 — Creator Product

8. EPIC 7 — Creator Brand/page builder.
9. EPIC 8 — Media.

### Sprint Group 4 — Revenue

10. EPIC 9 — Commerce/checkout.
11. EPIC 10 — Analytics.

### Sprint Group 5 — Retention/Growth

12. EPIC 11 — Automation.
13. EPIC 12 — Notifications.

### Sprint Group 6 — AI

14. EPIC 13 — AI foundation.
15. EPIC 14 — AI page/content.
16. EPIC 15 — AI CRM/sales.
17. EPIC 16 — AI analytics/business assistant.

### Sprint Group 7 — Scale/Launch

18. EPIC 17 — Search/command center.
19. EPIC 18 — Integrations.
20. EPIC 19 — QA/reliability.
21. EPIC 20 — Privacy/security.
22. EPIC 21 — Billing/commercialization.

---

# 8. Release Gates

## Alpha

Required:

- Authentication works.
- Workspace isolation works.
- Forms work.
- CRM works.
- Pipeline works.
- Creator page works.
- No critical mock data in primary flows.

## Beta

Required:

- Real public publishing.
- Real media.
- Real checkout/payment.
- Orders work.
- Analytics work.
- Basic automation works.
- Monitoring works.
- Critical E2E tests pass.

## Public Launch

Required:

- Production authentication.
- Production payments.
- Tenant isolation tests.
- Privacy/security baseline.
- Error monitoring.
- Backups/recovery.
- Customer onboarding.
- Billing.
- Support workflow.
- No known P0/P1 defects.

---

# 9. Post-V1 Strategic Roadmap

Once V1 is stable, the product should move from “toolbox” to “business operating system.”

### Growth intelligence

- AI funnel analyst.
- AI lead scoring.
- AI sales copilot.
- AI content optimizer.
- AI experiment generator.
- AI campaign assistant.

### Automation

- Email sequences.
- SMS/WhatsApp where appropriate.
- Appointment workflows.
- Lead nurturing.
- Abandoned checkout recovery.
- Customer onboarding.
- Review/testimonial requests.

### Commerce expansion

- Digital products.
- Coaching packages.
- Subscriptions.
- Memberships.
- Bundles.
- Upsells.
- Coupons.
- Affiliates/referrals.

### Business intelligence

- Cohort analysis.
- Revenue forecasting.
- Customer lifetime value.
- Attribution.
- Pipeline forecasting.
- Conversion benchmarking.

### AI operating layer

Eventually the owner should be able to say:

> “I have a new $499 coaching offer for women 30+ who want to lose weight. Build the page, qualification form, follow-up sequence, and checkout flow. Show me the result before publishing.”

The system should transform that request into structured product actions, show the proposed changes, obtain approval where required, execute them, and then measure the resulting business performance.

That is the long-term product direction—not simply adding a chatbot to the existing dashboard.

---

# 10. Final Product Principle

**Buy Now should remove software complexity from the small-business owner's life.**

The product should progressively collapse:

`Website builder + form builder + CRM + pipeline + checkout + analytics + automation + AI`

into one coherent workflow.

The winning experience is not the application with the most features.

It is the application that lets a business owner say:

**“I have an idea. Help me launch it, sell it, manage the customers, and tell me what to do next.”**
