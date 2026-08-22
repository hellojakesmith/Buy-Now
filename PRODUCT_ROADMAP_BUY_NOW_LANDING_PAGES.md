# Buy Now — Landing Pages for Selling Products, Roadmap

> **North star:** An entrepreneur should be able to describe a product, connect a way to get paid, and publish a landing page where a buyer can go from "I want this" to "I bought this" in as few taps as possible. The page should never make the buyer feel like they're filling out paperwork.

This roadmap complements `PRODUCT_ROADMAP_LANDING_PAGE_DESIGN.md` and `PRODUCT_ROADMAP_CONVERSION_BUILDER.md`. Those roadmaps cover how a page is designed and generated. This roadmap covers what happens when the objective is **"sell a product"** specifically — the product setup, the checkout, and the buy experience itself.

## Product principle: buying should feel like tapping "Buy," not filling out a form

The core insight driving this roadmap:

> "At the end of that, you just want to be able to hit buy rather than like no one wants to fill out web forms."

Every additional field, page, or decision between "I want this" and "I bought this" is a place a buyer can abandon. Buy Now's job is to collapse that distance. Where a traditional funnel asks a buyer to read a long-form sales page, click through to a separate cart, create an account, and fill out a multi-step checkout form, Buy Now should let the entrepreneur sell directly from the landing page with a single, low-friction buy action.

### Core principles

- **Buy-first:** the primary action on a product page is "Buy," not "Learn more," "Fill out this form," or "Continue to checkout."
- **Form fields are a liability:** every required field must justify its existence. Default to the minimum viable set (payment + delivery info only).
- **One page, one decision:** the buyer should not need to leave the landing page to complete a purchase.
- **Native payment methods first:** Apple Pay, Google Pay, and saved cards should be offered ahead of manual card entry wherever possible.
- **No accounts required to buy:** account creation, if offered at all, happens after purchase, never as a gate before it.
- **Instant clarity on what's being bought:** price, what's included, and delivery/access expectations are visible before the buyer taps Buy — no surprises at a later step.
- **Safe AI:** AI never invents price, inventory, shipping, or guarantee information — all commerce facts are authoritative and user-provided.
- **Same design intelligence as Landing Pages:** product-sale pages inherit the AI design system from `PRODUCT_ROADMAP_LANDING_PAGE_DESIGN.md` rather than reinventing layout, typography, and section logic.

---

# EPIC BNL-1 — Product Setup & Offer Definition

**Goal:** Let an entrepreneur describe what they're selling in the fewest steps possible.

### Inputs

- [ ] Product name.
- [ ] Product description.
- [ ] Product photos/video.
- [ ] Price.
- [ ] Compare-at / strikethrough price (optional).
- [ ] Product type: physical, digital download, service, subscription.
- [ ] Variants (size, color, tier), when applicable.
- [ ] Inventory/quantity, when applicable.
- [ ] Shipping requirement (yes/no).
- [ ] Delivery method for digital products (download, email, access link).
- [ ] Tax handling.

### AI decisions

- [ ] Suggest a compelling product name/description from minimal input.
- [ ] Recommend which optional fields to skip for this product type.
- [ ] Recommend single vs. multi-step buy flow based on product complexity (e.g., simple product = 1 tap; product with size/color = 1 extra tap).

### Acceptance criteria

- A single product with no variants can be fully set up in under 2 minutes.
- The system never requires shipping, tax, or inventory fields for products that don't need them.

---

# EPIC BNL-2 — One-Tap Buy & Checkout Engine

**Goal:** Make the purchase itself the fastest part of the experience, not the slowest.

### Buy action

- [ ] Persistent/sticky "Buy" CTA.
- [ ] Buy button opens an inline checkout, never a separate site.
- [ ] Express checkout options surfaced first: Apple Pay, Google Pay, saved card.
- [ ] Manual card entry as a fallback, not the default.
- [ ] Autofill support for address/card fields.
- [ ] Quantity/variant selection folded into the buy action, not a separate page.

### Minimal-field checkout

- [ ] Collect only what's required to fulfill the specific product (payment, and shipping address only if physical).
- [ ] No forced account creation before purchase.
- [ ] No "how did you hear about us"-style optional marketing questions in the buy flow.
- [ ] Optional post-purchase account creation (pre-filled from checkout data).
- [ ] Guest checkout as the default path.

### Trust at the moment of payment

- [ ] Visible security/payment badges.
- [ ] Clear total (including any shipping/tax) before the buyer confirms.
- [ ] One-tap order confirmation, no extra "are you sure" friction beyond what payment processors require.

### Acceptance criteria

- A returning buyer with a saved payment method can complete a purchase in one tap.
- A first-time buyer on a simple product can complete a purchase without leaving the page or filling more than payment + (if applicable) shipping fields.
- Cart/checkout abandonment points are instrumented and visible to the entrepreneur.

---

# EPIC BNL-3 — Payment & Commerce Infrastructure

**Goal:** Give Buy Now the plumbing to actually move money and fulfill orders.

- [ ] Payment processor integration (card, Apple Pay, Google Pay).
- [ ] Secure tokenized card storage for saved/repeat buyers.
- [ ] Order creation and receipt generation.
- [ ] Refund/cancellation handling.
- [ ] Multi-currency support.
- [ ] Tax calculation integration, where applicable.
- [ ] Shipping rate integration, for physical products.
- [ ] Digital delivery: instant access link/download after payment confirms.
- [ ] Webhook/event system for order status (paid, fulfilled, refunded).
- [ ] PCI-compliant handling — Buy Now never stores raw card data itself.

### Acceptance criteria

- Every purchase produces a verifiable order record and a receipt to the buyer.
- Digital products are deliverable within seconds of payment confirmation with no manual step from the entrepreneur.

---

# EPIC BNL-4 — Product-Sale Page Architecture

**Goal:** Give the AI design/generation system (from `PRODUCT_ROADMAP_LANDING_PAGE_DESIGN.md`) a proven section architecture specifically for "sell a product" pages.

### Core sections

- [ ] Hero with product, price, and Buy CTA above the fold.
- [ ] Product gallery/media.
- [ ] What's included / product details.
- [ ] Social proof (reviews, testimonials, ratings).
- [ ] Objection handling / FAQ.
- [ ] Guarantee/return policy (user-provided only).
- [ ] Urgency/scarcity elements (only when authoritative — real stock counts, real deadlines).
- [ ] Sticky buy bar that follows scroll.
- [ ] Final CTA.

### CTA strategy

- [ ] Buy CTA repeated at every natural decision point (hero, after details, after proof, final section).
- [ ] Context-aware CTA copy ("Buy now — $49" vs. generic "Buy").
- [ ] CTA always reflects live price/availability, never stale copy.

### Acceptance criteria

- A buyer scrolling the page is never more than one screen away from a working Buy action.
- The page can be generated from the same AI design system used for lead/application pages, with product-sale-specific section variants selected automatically when the conversion objective is "product sale."

---

# EPIC BNL-5 — Post-Purchase Experience

**Goal:** The relationship doesn't end at "payment successful."

- [ ] Order confirmation screen (on-page, not just email).
- [ ] Confirmation/receipt email.
- [ ] Digital product access delivery.
- [ ] Physical product shipping status updates.
- [ ] Optional lightweight account creation, pre-filled.
- [ ] Upsell/cross-sell offer immediately after purchase (optional, entrepreneur-configured).
- [ ] Simple order-status lookup for buyers without an account.

### Acceptance criteria

- A buyer always knows, without contacting support, what they bought, what happens next, and how to get help.

---

# EPIC BNL-6 — Entrepreneur Order & Sales Management

**Goal:** Give the entrepreneur visibility and control over what's selling, without a heavyweight commerce admin.

- [ ] Orders list (status, buyer, amount).
- [ ] Basic refund/cancel action.
- [ ] Sales totals / conversion rate at a glance.
- [ ] Inventory updates reflected on the live page in real time.
- [ ] Notification when a sale happens.
- [ ] Export orders (CSV).

### Acceptance criteria

- An entrepreneur can see, from their phone, whether a sale just happened and act on it (refund, fulfill, follow up) without needing a separate commerce platform.

---

# EPIC BNL-7 — Analytics for Selling

**Goal:** Measure the parts of the funnel that are unique to a buy flow, building on the general analytics in `PRODUCT_ROADMAP_LANDING_PAGE_DESIGN.md`.

- [ ] Page view.
- [ ] Buy CTA click (by placement — hero vs. sticky bar vs. final CTA).
- [ ] Checkout started.
- [ ] Express-pay vs. manual-card selection rate.
- [ ] Checkout abandonment point.
- [ ] Purchase completed.
- [ ] Average order value.
- [ ] Repeat-buyer rate.

### Acceptance criteria

- The entrepreneur can identify exactly where buyers are dropping off between "wants to buy" and "bought," and Buy Now can recommend a fix (e.g., "buyers are abandoning at the shipping-address field").

---

# Recommended Implementation Sequence

## Phase 1 — Make it possible to get paid at all
**BNL-1 → BNL-3**
Product setup and payment/commerce infrastructure. Without this, nothing else in the roadmap matters.

## Phase 2 — Make buying frictionless
**BNL-2**
The one-tap buy and minimal-field checkout experience — the core insight behind this roadmap.

## Phase 3 — Make the page sell
**BNL-4**
Apply the AI design system to product-sale-specific page architecture and CTA strategy.

## Phase 4 — Close the loop
**BNL-5 → BNL-6**
Post-purchase experience and order management for the entrepreneur.

## Phase 5 — Learn and improve
**BNL-7**
Funnel-specific analytics and abandonment diagnosis.

---

# Definition of Done — Buy Now Product-Sale Pages

- [ ] An entrepreneur can set up a simple product for sale in under 2 minutes.
- [ ] A returning buyer with a saved payment method can complete a purchase in one tap.
- [ ] A first-time buyer never fills out more fields than the product strictly requires.
- [ ] The buyer never leaves the landing page to complete checkout.
- [ ] Digital products deliver instantly; physical products generate a real, trackable order.
- [ ] The entrepreneur can see and act on sales from their phone.
- [ ] The page architecture and CTA strategy come from the same AI design system as the rest of Buy Now's landing pages.
- [ ] Funnel drop-off is measurable at every step between page view and purchase.

## North-star test

> **Can a buyer go from landing on the page to completing a purchase in one tap — without ever feeling like they're filling out a form?**

If not, the Product-Sale Landing Pages feature is not finished.
