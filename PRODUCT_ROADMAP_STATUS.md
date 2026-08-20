# Product Roadmap Implementation Status

Last updated: 2026-08-20

This file tracks implementation completed against `PRODUCT_ROADMAP.md`. Items are only marked complete when the corresponding repository change has actually been made.

## EPIC 0 — Product Scope, Architecture & Technical Baseline

- [x] Add repository development scripts for frontend/backend typecheck and production builds.
- [x] Rename frontend production package metadata away from Figma-generated naming.
- [x] Establish frontend environment variable example (`buynow/.env.example`).
- [ ] Define V1 customer persona.
- [ ] Define V1 primary use cases.
- [ ] Define V1 feature cut line.
- [ ] Define explicit post-V1 backlog.
- [ ] Document canonical domain entities.
- [ ] Document frontend/backend ownership boundaries.
- [ ] Define API response contracts.
- [x] Define authentication/session architecture.
- [x] Define public vs authenticated routes.
- [ ] Define page schema versioning strategy.
- [ ] Define analytics event taxonomy.
- [ ] Define payment/order state machine.
- [ ] Define automation event/action contract.
- [ ] Define AI provider abstraction.
- [ ] Establish staging vs production configuration.

## EPIC 1 — Production Authentication & Workspace Security

- [x] Production sign-up/sign-in/sign-out backend endpoints.
- [x] Production session/token management backend.
- [x] Secure session persistence with hashed tokens, HttpOnly cookies, expiry, and TTL cleanup.
- [ ] Password reset or production identity provider.
- [x] Authenticated `/me` endpoint exists and is retained as the identity contract.
- [x] Remove browser-provided identity headers as proof of identity in production.
- [x] Derive workspace/user context from authenticated session in production.
- [ ] Workspace membership and authorization/RBAC audit.
- [ ] Tenant-isolation audit across every private route.
- [ ] Rate limiting.
- [ ] CSRF protection where applicable.
- [ ] Permission-change audit logging.
- [ ] Frontend migration from bootstrap/header identity to session auth.

> **Important:** The backend authentication foundation is implemented, but EPIC 1 is intentionally **not production-complete** until frontend migration, authorization/RBAC, tenant-isolation audit, rate limiting, and other security controls are verified.

## EPIC 2 — API Contracts, Validation & Backend Hardening

- [x] Add reusable Zod request-body validation middleware.
- [x] Apply schema validation to auth bootstrap input.
- [x] Add request validation to contacts, opportunities, products, forms, pages, pipelines, and orders.
- [ ] Add request schemas for every remaining POST/PATCH endpoint.
- [ ] Validate ObjectIds across all remaining routes.
- [ ] Validate enums/state transitions across all routes.
- [x] Validate email/URL/slug/price/currency inputs on the core CRM/content/commerce routes.
- [ ] Validate page section schemas.
- [ ] Validate form field schemas.
- [x] Validate pagination parameters on all currently paginated resource lists.
- [ ] Validate sorting parameters across all list endpoints.
- [ ] Standardize API error responses.
- [ ] Add request IDs/correlation IDs.
- [ ] Add structured server logging.
- [ ] Add safe production error handling.
- [ ] Add database indexes for high-volume queries.
- [ ] Add pagination to all growing collections.
- [x] Add search/filter support to contacts.
- [x] Add search/filter support to opportunities.
- [x] Add search/filter support to orders.
- [x] Add search/filter support to products/pages/forms.
- [ ] Add consistent created/updated timestamps.
- [ ] Add optimistic concurrency/version strategy where needed.

### Pagination contract

Paginated resource endpoints now return:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "pageSize": 25,
    "total": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

The exact item key remains resource-specific (`contacts`, `opportunities`, `products`, `forms`, `pages`, `pipelines`, or `orders`). Page size is bounded to 100.

## EPIC 3 — Frontend Architecture & App Shell

- [ ] Extract remaining domain components from `App.tsx`.
- [ ] Remove remaining prototype/demo data from critical flows.
- [ ] Remove hard-coded user identity.
- [ ] Add global error boundary.
- [ ] Standardize loading/empty/error/success states.
- [ ] Verify mobile keyboard/safe-area behavior.
- [ ] Migrate API client to cookie-based authenticated sessions.
- [ ] Add login/register/logout UI.

## EPIC 4+ — Product Features

No feature in EPIC 4 or later is being marked complete by the API hardening/authentication passes. Implementation will proceed in dependency order:

`Forms → CRM → Pipeline → Creator Brand → Media → Commerce → Analytics → Automation → Notifications → AI → Integrations → Launch`

## CI / Reliability Foundation

- [x] Add GitHub Actions CI for frontend typecheck/build.
- [x] Add GitHub Actions CI for backend typecheck/build.
- [x] Remove tracked macOS `.DS_Store` metadata.
- [ ] Add automated unit/integration/E2E tests.
- [ ] Add production error monitoring.
- [ ] Add uptime monitoring.
- [ ] Add database backup/restore verification.

## Current Implementation Pass

### Completed

- Added reusable bounded pagination utilities.
- Added pagination metadata and maximum page-size enforcement.
- Added list filtering for contacts, opportunities, products, forms, pages, and orders.
- Added pipeline list pagination.
- Added Zod validation to core CRM/content/commerce create/update endpoints.
- Added ObjectId conversion/validation at key relationship boundaries.
- Escaped user-provided contact/product/page/form search strings before constructing MongoDB regular expressions.
- Kept all implemented queries explicitly scoped to the current workspace context.
- Added password hashing using Node's built-in scrypt.
- Added persistent hashed session tokens with MongoDB TTL expiration.
- Added HttpOnly cookie-based login/logout sessions.
- Added registration and login endpoints.
- Protected private API route groups behind authentication in production.
- Disabled prototype `/auth/bootstrap` authentication in production.
- Kept public forms/pages and health endpoints accessible without authentication.

### Remaining before EPIC 1 can close

- Migrate the frontend to `/auth/register`, `/auth/login`, `/auth/logout`, and `/auth/me`.
- Add password reset or external production identity provider.
- Complete workspace membership/RBAC authorization.
- Audit tenant isolation across every private route.
- Add rate limiting and CSRF protections where applicable.
- Add authentication/security tests.

### Remaining before EPIC 2 can close

- Validate remaining routes such as activity, media, notifications, and dashboard inputs.
- Add validation for page section and form-field domain schemas rather than generic arrays.
- Complete pagination for every growing collection.
- Add standardized API errors, request IDs, structured logging, and production-safe error handling.
- Add/verify database indexes based on actual query patterns.

## Next Implementation Target

**EPIC 3 + EPIC 1 frontend migration:** connect the existing frontend to the new session-based authentication contract, remove hard-coded/header identity from production API calls, and then proceed into the Forms → CRM product sequence.
