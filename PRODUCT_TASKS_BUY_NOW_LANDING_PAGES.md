# Buy Now — Landing Pages for Selling Products, Task List

> Execution backlog for `PRODUCT_ROADMAP_BUY_NOW_LANDING_PAGES.md`.
>
> This document translates the roadmap into concrete engineering tasks based on a direct read of the current `main` implementation (backend routes/models/schemas and the `buynow/` frontend). Check items off only when the implementation is real, tested, and reachable by an actual customer — not when a screen merely looks correct in the internal app.

## Current-state assessment

The repository already has a real, working **entrepreneur-side** product and order system: `Product` and `Order` Mongoose models, authenticated CRUD routes (`backend/src/routes/products.ts`, `backend/src/routes/orders.ts`), and a frontend data layer (`buynow/src/app/lib/useAppData.ts`) that creates/lists real products and orders through the API. That part is a legitimate foundation.

Everything downstream of "product exists" — the part a paying customer would actually touch — does not exist yet:

- **There is no public buy flow at all.** `backend/src/routes/public.ts` only exposes `GET /public/forms/:slug`, `POST /public/forms/:slug/submissions`, and `GET /public/pages/:slug`. There is no public product endpoint and no public order/checkout/payment endpoint. `products` and `orders` routers are mounted behind `requireAuth` (`backend/src/routes/index.ts`) — a customer has no way to see a product or place an order.
- **There is no payment processor integration anywhere.** No Stripe (or any) SDK dependency in `backend/package.json`, no payment env vars in `backend/src/config/env.ts`, no webhook handler. `Order.paymentProvider` defaults to the string `"stripe"` but nothing ever calls Stripe. The only other occurrence of "Stripe" in the codebase is a static label in a settings menu (`buynow/src/app/App.tsx`).
- **The frontend has no public/unauthenticated route at all.** `buynow/src/main.tsx` renders `AuthGate` directly into `#root` with no router. Every screen, including `CheckoutPreviewScreen`, only exists inside the authenticated app shell. There is no URL a real buyer can visit to see a product page or complete a purchase — `Page.publishedUrl` is stored but nothing serves it publicly.
- **`CheckoutPreviewScreen` (`buynow/src/app/App.tsx`) is a non-functional mockup**, not a real checkout: the Name/Email/Phone/Card fields are static styled `<div>`s with no `<input>`, no state, and no validation; the total is hardcoded to `$299` regardless of the actual product price; and the "Buy Now" button has no `onClick` handler — it does nothing when pressed. This screen is also only reachable from inside the entrepreneur's own authenticated app, so even if it worked it wouldn't be a customer-facing checkout.
- **The "Buy Now Page" creation path bypasses the canonical page schema.** `saveProductDraft` in `App.tsx` creates a `Page` with `type: "buy-now"` and `sections: [{ type: "product-checkout", productId }]`. `"product-checkout"` is not a valid section type in `backend/src/schemas/conversionBuilder.ts` (valid types are `hero, content, benefits, social-proof, offer, faq, form, product, vsl, cta, footer, custom`), and this write goes to the legacy `Page.sections` (`Schema.Types.Mixed`) field, not the versioned `builderDocument`. `LandingPageRenderer.tsx` renders from `builderDocument`, so a page created this way cannot be rendered by the existing renderer at all.
- **The landing-page renderer's "product" block is a placeholder.** `renderBlock()` in `LandingPageRenderer.tsx` renders a `product` block as a static card reading `"Connected product: <productId>"` — no name, price, image, or buy action. The `button` block's `onClick` only handles `action.type === "url"`; clicking a button wired to `type: "form"`, `type: "product"`, or `type: "buy-now"` does nothing (`buynow/src/app/landing/LandingPageRenderer.tsx:102`).
- **Products screen actions are dead.** `ProductsScreen`'s "Edit / View Page / Share" buttons (`App.tsx`) have no `onClick` handlers.
- **The schema has the right shape but no backing behavior.** `conversionBuilder.ts` already defines `product` and `buy-now` as valid block/action/reference types — the data model anticipated this feature. The gap is entirely in resolving those references to real product data and giving the buy-now action somewhere real to go.

**Net effect:** an entrepreneur can create a product in the CRM sense, but nothing in the current codebase lets a real customer view that product on a public page, enter payment details, or complete a purchase. This task list treats the roadmap's BNL-1 through BNL-7 epics as work against that actual gap, not against an assumed blank slate.

---

# Phase 0 — Baseline & architecture decisions

## BNL-T0.1 — Confirm the public delivery architecture

- [ ] Decide how public pages are served: a router added to the existing `buynow` SPA (e.g. `react-router`) vs. a separate lightweight public-renderer bundle/entry point.
- [ ] Decide the public URL contract (e.g. `/p/:slug` or a custom-domain strategy) and reconcile it with `Page.publishedUrl`.
- [ ] Decide whether the public bundle needs to be code-split from the authenticated app shell so buyers never download entrepreneur-only code/auth logic.
- [ ] Document the decision in `docs/LANDING_PAGE_CODE_MAP.md` or a new `docs/BUY_NOW_PUBLIC_DELIVERY.md` so it isn't relitigated per-epic.

**Done when:** there is one written, agreed answer for "what does a customer's browser actually load when they visit a published Buy Now page," and every task below builds toward it.

## BNL-T0.2 — Choose and scope the payment processor integration

- [ ] Select the initial payment processor (Stripe is assumed given `Order.paymentProvider` default and the UI label, but this should be confirmed, not inherited by accident).
- [ ] Decide integration pattern: Stripe Payment Element / Checkout Session vs. custom Elements-based form.
- [ ] Define required backend env vars (secret key, publishable key, webhook signing secret) and add them to `backend/src/config/env.ts` and `.env.example`.
- [ ] Add the processor SDK dependency to `backend/package.json` (none currently present).
- [ ] Define the order/payment state machine explicitly (`pending → processing → paid → refunded/failed`) — `Order.status` currently only has the enum values with no transition logic anywhere.

**Done when:** there's a concrete, written integration plan referencing real Stripe APIs, and the env/config scaffolding exists even before the first real charge is implemented.

## BNL-T0.3 — Define the canonical product-sale page document contract

- [ ] Add a real `productId`-resolving hydration step server-side so `product` blocks in a published page return actual name/price/image/inventory, not just an ID.
- [ ] Add a `buy-now` block/section type to `conversionBuilder.ts` that carries enough structured data (product reference, CTA copy, express-pay flags) to render a real buy box — today `buy-now` only exists as an action type pointing at a `pageId`.
- [ ] Decide whether `type: "buy-now"` pages should be retired in favor of a `product-sale` section variant inside the standard landing-page document (recommended, since it unifies rendering) or kept as a distinct `Page.type` with its own schema and renderer.
- [ ] Update `migrateLegacySections()` (or equivalent) to handle the existing ad-hoc `{ type: "product-checkout", productId }` sections already being written by `saveProductDraft`, so no currently-created pages are silently orphaned.

**Done when:** there is one schema-valid way to represent "this page sells this product," and it's the only way new code writes it.

---

# Phase 1 — Public product & checkout API (BNL-2, BNL-3)

## BNL-T1.1 — Public product read endpoint

- [ ] Add `GET /api/public/products/:id` (or resolve product data inline within `GET /api/public/pages/:slug`) returning only buyer-safe fields: name, description, price, currency, image, inventory availability, checkout requirements — never `ownerUserId`, internal status, or workspace internals.
- [ ] Resolve `imageAssetId` to an actual servable image URL in the public response (`backend/src/routes/media.ts` / `services/gridfs.ts` already exist for asset storage — confirm public read access works for published-page assets).
- [ ] Add workspace/tenant scoping so a product ID can only be read publicly if it belongs to a published page in that workspace — do not allow enumerating arbitrary products by ID.
- [ ] Add rate limiting consistent with the existing `rateLimit` middleware used on public form submission.

**Done when:** an unauthenticated request can fetch everything a buy box needs to render, and nothing it shouldn't have.

## BNL-T1.2 — Public checkout intent endpoint

- [ ] Add `POST /api/public/products/:id/checkout` (or equivalent) that creates a payment intent/checkout session with the payment processor, using the **server-side** product price — never trust a client-supplied amount.
- [ ] Validate inventory/availability server-side before creating the intent.
- [ ] Handle variant/quantity selection (`Product.checkoutSettings.allowQuantity`) server-side, recomputing the total.
- [ ] Return only what the client needs to complete payment (e.g. a client secret), never processor secret keys.
- [ ] Rate-limit this endpoint distinctly from general public traffic (checkout abuse is higher-stakes than form spam).

**Done when:** a public client can start a real checkout without any authenticated session, and the price/quantity used is always server-computed.

## BNL-T1.3 — Payment confirmation & order creation

- [ ] Add a webhook endpoint for the payment processor's payment-succeeded (and failed/canceled) events.
- [ ] On success, create the `Order` record server-side (do not rely on the client to call the existing authenticated `POST /orders` — that route is behind `requireAuth` and is the wrong contract for a buyer-initiated purchase).
- [ ] Reconcile/replace the current client-callable `POST /orders` so authenticated order creation (manual/CRM entry) and webhook-driven order creation (real customer purchase) are clearly distinct code paths, not the same handler with different trust assumptions.
- [ ] Decrement inventory transactionally on order creation for products where `inventory` is tracked.
- [ ] Trigger the existing `createActivity` / `createNotification` services (already used in `orders.ts`) from the new webhook-driven path so entrepreneurs still get notified for real sales.
- [ ] Add idempotency handling so a retried webhook delivery cannot create duplicate orders.

**Done when:** a completed real-world payment reliably produces exactly one `Order` record, decremented inventory, and an entrepreneur notification — driven by the payment processor's source of truth, not client-reported success.

## BNL-T1.4 — Digital delivery & receipts

- [ ] Add receipt email delivery on order paid (no email sending infrastructure currently exists in the repo — confirm/add a transactional email provider).
- [ ] For digital products, generate and deliver a secure access link/download on payment confirmation.
- [ ] For physical products, capture and validate a shipping address as part of checkout when `Product.checkoutSettings.collectAddress` is true.

**Done when:** a buyer who completes a digital-product purchase gets access within seconds with no manual step from the entrepreneur, and a physical-product buyer's address is captured and attached to the order.

---

# Phase 2 — Public buy experience (BNL-2, BNL-4)

## BNL-T2.1 — Real public route for published pages

- [ ] Implement the routing decision from BNL-T0.1: a real, unauthenticated route that loads `GET /api/public/pages/:slug` and renders it — today no such route exists anywhere in `buynow/src`.
- [ ] Mount `LandingPageRenderer` (or its successor) on that public route with `interactive={true}`.
- [ ] Handle not-found/unpublished states for the public route (currently `public.ts` 404s correctly server-side, but there's no client route to display that gracefully).

**Done when:** a real browser, with no login, can load a published page's URL and see it render.

## BNL-T2.2 — Functional buy box component

- [ ] Replace the placeholder `product` block rendering in `LandingPageRenderer.tsx` (`"Connected product: <id>"`) with a real buy box: image, name, price, quantity/variant controls where applicable, and a working Buy button.
- [ ] Wire the `button` block's `onClick` to handle `action.type === "product"` and `action.type === "buy-now"` (currently only `"url"` is handled at `LandingPageRenderer.tsx:102`) by opening the checkout flow rather than doing nothing.
- [ ] Build the actual checkout UI as a real form with controlled inputs and validation — not the static styled `<div>` placeholders in `CheckoutPreviewScreen`. This can reuse that screen's visual design but needs real `<input>` state, error handling, and submission logic.
- [ ] Integrate the payment processor's client SDK (e.g. Stripe Elements/Payment Element) for card entry — no raw card number fields should ever be submitted directly to the Buy Now backend.
- [ ] Surface Apple Pay / Google Pay as the primary express-checkout option ahead of manual card entry, per the roadmap's core insight, with manual card entry as fallback.
- [ ] Compute and display the live total (price × quantity + tax/shipping if applicable) — `CheckoutPreviewScreen` currently hardcodes `$299` regardless of product.
- [ ] Implement guest checkout as the only path required to buy — no account/login gate before purchase.
- [ ] Add loading, error, and success states for the buy action (submitting, processor error, payment declined, success/confirmation).

**Done when:** tapping "Buy" on a real published page collects payment and completes a purchase end-to-end, with no dead buttons or hardcoded values anywhere in the path.

## BNL-T2.3 — Sticky buy bar & CTA repetition

- [ ] Add a sticky/persistent buy CTA that follows scroll on product-sale pages, per BNL-4 in the roadmap — no such component currently exists in `LandingPageRenderer.tsx`.
- [ ] Ensure CTA copy reflects live price/availability (e.g. "Buy now — $49", "Sold out") rather than static button labels.
- [ ] Verify the buy CTA is reachable within one screen of scroll from any point on the page (roadmap acceptance criterion).

**Done when:** a buyer scrolling a long product page is never more than one screen from a working, price-accurate Buy action.

## BNL-T2.4 — Order confirmation screen

- [ ] Build a real on-page order confirmation state (post-payment), not just relying on an email — currently nothing renders after a (non-functional) "Buy Now" tap.
- [ ] Show order number, what was purchased, and next steps (digital access link, or shipping expectation) sourced from the real `Order` record.

**Done when:** a buyer who just paid sees confirmation on-screen immediately, without needing to check email first.

---

# Phase 3 — Product setup & entrepreneur-side fixes (BNL-1, BNL-6)

## BNL-T3.1 — Fix the buy-now page creation path

- [ ] Update `saveProductDraft` in `App.tsx` to create a page using the canonical `builderDocument`/schema-valid section structure decided in BNL-T0.3, replacing the current `sections: [{ type: "product-checkout", productId }]` write, which the schema doesn't recognize and the renderer can't render.
- [ ] Ensure the generated page defaults to a real, minimal-but-complete product-sale architecture (hero + buy box, at minimum) rather than a single unrendorable section.

**Done when:** creating a product from the app produces a page that can actually be opened, previewed, and published through the existing landing-page machinery.

## BNL-T3.2 — Wire up dead entrepreneur-side actions

- [ ] Implement the "Edit," "View Page," and "Share" button handlers on `ProductsScreen` (`App.tsx`) — currently no `onClick` at all.
- [ ] "View Page" should open the real public URL from BNL-T2.1 once it exists.
- [ ] "Share" should surface the real published URL (share sheet / copy link), consistent with how `PublicForm`/form sharing already works elsewhere in the app.

**Done when:** every visible product-management action does something real.

## BNL-T3.3 — Product setup completeness

- [ ] Add product type distinction (physical / digital / service / subscription) to `Product` model and creation UI — not currently modeled; `checkoutSettings` only has `requirePhone`, `collectAddress`, `allowQuantity`.
- [ ] Add variant support (size/color/tier) to `Product` model, creation UI, public product read, and checkout — no variant concept exists anywhere currently.
- [ ] Add digital-delivery configuration (download asset / access link / email) to `Product` model for digital products, feeding BNL-T1.4.
- [ ] Add compare-at/strikethrough price field.
- [ ] AI-assisted product name/description suggestion from minimal input, using the existing `backend/src/routes/ai.ts` infrastructure rather than a new AI integration.

**Done when:** the product data model can actually represent the product types the roadmap commits to selling.

## BNL-T3.4 — Order management for entrepreneurs

- [ ] Add refund/cancel action wired to the payment processor (currently `Order.status` can be set to `"refunded"` via `PATCH /orders/:id`, but nothing actually issues a processor-side refund).
- [ ] Add CSV export for orders.
- [ ] Add a sale notification path confirmed to work from the new webhook-driven order creation (BNL-T1.3), not just the manual `POST /orders` path.

**Done when:** an entrepreneur can manage real orders, including actually refunding money, from the app.

---

# Phase 4 — Analytics (BNL-7)

## BNL-T4.1 — Buy-flow event instrumentation

- [ ] Add event emission for: page view, buy CTA click (by placement), checkout started, express-pay vs. manual-card selection, checkout abandonment point, purchase completed — none of this instrumentation currently exists.
- [ ] Confirm/build the analytics pipeline these events land in — `backend/src/routes/dashboard.ts` exists for CRM-style analytics but has no buy-flow-specific event ingestion today.
- [ ] Surface funnel drop-off (page view → CTA click → checkout started → purchase) to the entrepreneur.

**Done when:** an entrepreneur can see exactly where buyers are dropping off between landing on the page and completing a purchase, backed by real event data.

---

# Recommended sequencing

Phases 0 → 1 → 2 are a strict dependency chain: there is no working buy button without a public route (Phase 2) and no public route worth having without a real checkout/payment backend (Phase 1), and no correct backend without the architecture decisions in Phase 0. Phase 3's entrepreneur-side fixes can happen in parallel with Phase 1 once BNL-T0.3 is settled, since they mostly touch product setup and the page-creation path rather than the payment path. Phase 4 (analytics) depends on Phase 2 existing, since there's nothing to instrument until buyers can actually click things.

---

# Definition of Done — Buy Now Landing Pages, engineering-verified

- [ ] A real, unauthenticated browser session can load a published product page at a real URL.
- [ ] The buy box on that page shows real product name, price, and image — not a placeholder ID string.
- [ ] Tapping Buy opens a real checkout with actual input fields and processor-backed payment, not a static mockup.
- [ ] A completed payment creates exactly one real `Order` record via a payment-processor webhook, not client-reported success.
- [ ] The entrepreneur is notified and sees the order in their existing Orders screen.
- [ ] Digital products deliver access automatically; physical products capture a real shipping address.
- [ ] No button in the buy flow is a dead `onClick`-less element.
- [ ] No dollar amount anywhere in the flow is hardcoded independent of the actual product/order data.
