# Buy Now Landing Pages — Implementation Status

Last updated: 2026-08-22

This file tracks implementation completed against `PRODUCT_ROADMAP_BUY_NOW_LANDING_PAGES.md`. Items are only marked complete when the corresponding repository change has actually been made — checking a box here without shipped code defeats the point of tracking status.

## EPIC BNL-1 — Product Setup & Offer Definition

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
- [ ] AI: suggest product name/description from minimal input.
- [ ] AI: recommend which optional fields to skip for this product type.
- [ ] AI: recommend single vs. multi-step buy flow based on product complexity.

## EPIC BNL-2 — One-Tap Buy & Checkout Engine

- [ ] Persistent/sticky "Buy" CTA.
- [ ] Buy button opens an inline checkout, never a separate site.
- [ ] Express checkout options surfaced first: Apple Pay, Google Pay, saved card.
- [ ] Manual card entry as a fallback, not the default.
- [ ] Autofill support for address/card fields.
- [ ] Quantity/variant selection folded into the buy action.
- [ ] Collect only what's required to fulfill the specific product.
- [ ] No forced account creation before purchase.
- [ ] No optional marketing questions in the buy flow.
- [ ] Optional post-purchase account creation (pre-filled from checkout data).
- [ ] Guest checkout as the default path.
- [ ] Visible security/payment badges.
- [ ] Clear total (including shipping/tax) before confirming.
- [ ] One-tap order confirmation.

## EPIC BNL-3 — Payment & Commerce Infrastructure

- [ ] Payment processor integration (card, Apple Pay, Google Pay).
- [ ] Secure tokenized card storage for saved/repeat buyers.
- [ ] Order creation and receipt generation.
- [ ] Refund/cancellation handling.
- [ ] Multi-currency support.
- [ ] Tax calculation integration.
- [ ] Shipping rate integration.
- [ ] Digital delivery: instant access link/download after payment confirms.
- [ ] Webhook/event system for order status (paid, fulfilled, refunded).
- [ ] PCI-compliant handling — no raw card data stored by Buy Now.

## EPIC BNL-4 — Product-Sale Page Architecture

- [ ] Hero with product, price, and Buy CTA above the fold.
- [ ] Product gallery/media.
- [ ] What's included / product details section.
- [ ] Social proof (reviews, testimonials, ratings).
- [ ] Objection handling / FAQ.
- [ ] Guarantee/return policy (user-provided only).
- [ ] Urgency/scarcity elements (authoritative data only).
- [ ] Sticky buy bar that follows scroll.
- [ ] Final CTA.
- [ ] CTA repeated at every natural decision point.
- [ ] Context-aware CTA copy (reflects live price/availability).
- [ ] Product-sale section variants auto-selected when objective is "product sale."

## EPIC BNL-5 — Post-Purchase Experience

- [ ] Order confirmation screen (on-page, not just email).
- [ ] Confirmation/receipt email.
- [ ] Digital product access delivery.
- [ ] Physical product shipping status updates.
- [ ] Optional lightweight account creation, pre-filled.
- [ ] Post-purchase upsell/cross-sell offer (optional, entrepreneur-configured).
- [ ] Order-status lookup for buyers without an account.

## EPIC BNL-6 — Entrepreneur Order & Sales Management

- [ ] Orders list (status, buyer, amount).
- [ ] Basic refund/cancel action.
- [ ] Sales totals / conversion rate at a glance.
- [ ] Inventory updates reflected on the live page in real time.
- [ ] Notification when a sale happens.
- [ ] Export orders (CSV).

## EPIC BNL-7 — Analytics for Selling

- [ ] Page view tracking.
- [ ] Buy CTA click tracking (by placement).
- [ ] Checkout started tracking.
- [ ] Express-pay vs. manual-card selection rate.
- [ ] Checkout abandonment point tracking.
- [ ] Purchase completed tracking.
- [ ] Average order value.
- [ ] Repeat-buyer rate.
- [ ] Abandonment-point diagnosis/recommendation.

---

## Notes

- Nothing in this roadmap has shipped yet — all items above start unchecked. Update this file as each item is actually implemented in the repository.
- Check off an item only alongside the commit/PR that implements it, and reference the PR where useful.
