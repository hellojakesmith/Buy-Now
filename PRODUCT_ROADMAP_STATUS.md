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
- [x] Define page schema versioning strategy.
- [ ] Define analytics event taxonomy.
- [ ] Define payment/order state machine.
- [ ] Define automation event/action contract.
- [ ] Define AI provider abstraction.
- [ ] Establish staging vs production configuration.

## EPIC 1 — Production Authentication & Workspace Security

- [x] Production sign-up/sign-in/sign-out backend endpoints.
- [x] Production session/token management backend.
- [x] Secure session persistence with hashed tokens, HttpOnly cookies, expiry, and TTL cleanup.
- [x] Password reset endpoints (`/auth/forgot-password`, `/auth/reset-password`). Email delivery is still outstanding.
- [x] Authenticated `/me` endpoint exists and is retained as the identity contract.
- [x] Remove browser-provided identity headers as proof of identity in production.
- [x] Derive workspace/user context from authenticated session in production.
- [x] Workspace membership and authorization/RBAC audit.
- [x] Tenant-isolation audit across every private route.
- [x] Rate limiting.
- [x] CSRF protection where applicable.
- [x] Permission-change audit logging.
- [x] Frontend migration from bootstrap/header identity to session auth.

> **Important:** EPIC 1 now includes RBAC, tenant isolation, rate limiting, CSRF origin checks, password reset tokens, and security unit tests. Remaining production identity work is SMTP/email delivery for password reset.

## EPIC 2 — API Contracts, Validation & Backend Hardening

- [x] Add reusable Zod request-body validation middleware.
- [x] Apply schema validation to auth bootstrap input.
- [x] Add request validation to contacts, opportunities, products, forms, pages, pipelines, and orders.
- [ ] Add request schemas for every remaining POST/PATCH endpoint.
- [ ] Validate ObjectIds across all remaining routes.
- [ ] Validate enums/state transitions across all routes.
- [x] Validate email/URL/slug/price/currency inputs on the core CRM/content/commerce routes.
- [x] Validate page section schemas.
- [x] Validate form field schemas.
- [x] Validate pagination parameters on all currently paginated resource lists.
- [ ] Validate sorting parameters across all list endpoints.
- [x] Standardize API error responses.
- [x] Add request IDs/correlation IDs.
- [ ] Add structured server logging.
- [x] Add safe production error handling.
- [ ] Add database indexes for high-volume queries.
- [ ] Add pagination to every growing collection.
- [x] Add search/filter support to contacts.
- [x] Add search/filter support to opportunities.
- [x] Add search/filter support to orders.
- [x] Add search/filter support to products/pages/forms.
- [ ] Add consistent created/updated timestamps.
- [x] Add optimistic concurrency/version strategy where needed.

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
- [x] Migrate API client to cookie-based authenticated sessions.
- [x] Add login/register UI.
- [x] Add accessible logout action to the authenticated application shell.

## EPIC 4+ — Product Features

Implementation proceeds in dependency order:

`Forms → CRM → Pipeline → Creator Brand → Media → Commerce → Analytics → Automation → Notifications → AI → Integrations → Launch`

## EPIC 5 — CRM / Contacts

- [x] Contact detail (enriched `GET /contacts/:id` returns activities, opportunities, and orders as a unified timeline).
- [x] Contact notes (`POST /contacts/:id/notes` records a note activity).
- [x] Follow-up task/reminder (`POST /contacts/:id/follow-ups` creates a task activity with optional due date).
- [x] Activity timeline (contact detail returns the activity history).
- [x] Opportunity history (contact detail returns associated opportunities).
- [x] Purchase history (contact detail returns associated orders).
- [x] Source filter (contact list accepts `source`).
- [x] Tags filter (contact list accepts comma-separated `tags`).
- [ ] Leads list / customer list filter (dedicated list views).
- [ ] Sorting.
- [ ] Contact edit (frontend).
- [ ] Contact archive/unarchive (frontend visibility).
- [ ] Contact merge/deduplication strategy.
- [ ] Contact ownership (frontend assignment).
- [ ] Bulk operations where useful.

## CI / Reliability Foundation

- [x] Add GitHub Actions CI for frontend typecheck/build.
- [x] Add GitHub Actions CI for backend typecheck/build.
- [x] Remove tracked macOS `.DS_Store` metadata.
- [x] Add automated unit tests for auth hashing, rate limiting, CSRF origin checks, and RBAC.
- [ ] Add automated integration/E2E tests.
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
- Added an authenticated frontend gate that restores sessions through `/auth/me`.
- Added frontend login and workspace registration flows.
- Migrated frontend API requests to credentialed cookie sessions.
- Removed client-supplied identity headers from frontend API requests.
- Removed the frontend dependency on `/auth/bootstrap`.
- Added accessible Sign out control on the Settings screen that calls `/auth/logout`, clears the HttpOnly session cookie, clears local context, and returns the user to the login gate.
- Added IP rate limits for API traffic, auth abuse, and public form submissions.
- Added CSRF origin checks for cookie-authenticated mutating requests.
- Attached workspace role to the authenticated session context.
- Restricted user and workspace administration to admin/owner roles, with last-owner protection.
- Scoped media GET/DELETE lookups to the current workspace.
- Added hashed password-reset tokens and a frontend reset flow. Production still needs email delivery.
- Recorded permission changes in an append-only audit log.
- Added request IDs and a consistent `{ message, requestId, details? }` error shape.
- Added canonical form-field schemas (`text`, `email`, `phone`, `textarea`, `select`, `checkbox`, `date`) with server-side answer validation.
- Public form JSON no longer exposes workspace internals.
- Public `/f/:slug` renderer captures leads without signing in.
- Duplicate submissions (same form + email within 24 hours) reuse the existing record instead of creating extra contacts.
- Contact upsert matches on email or phone only — not name alone.
- Form editor can add, edit, require, and delete fields; publish, unpublish, share, preview, and embed.
- Enriched contact detail endpoint returning activities, opportunities, and orders as a unified timeline.
- Added contact notes endpoint (`POST /contacts/:id/notes`).
- Added follow-up task/reminder endpoint (`POST /contacts/:id/follow-ups`).
- Added source and tags filters to the contact list endpoint.
- Added a database index for workspace + source + lastActivityAt on contacts.
- Added Zod query validation and pagination to the activity list endpoint (filters by contact/opportunity/order/type).
- Added Zod query validation and pagination to the notifications list endpoint (filters by unread/type).
- Added Zod body validation to the media upload endpoint (kind, purpose, alt/caption, related entity).
- Added a validated `range` query parameter to the dashboard summary endpoint (today/7d/30d/90d/all), backward-compatible default `all`.
- Added a database index on { workspaceId, userId, createdAt } for paginated notification queries.
- Added a versioned conversion-builder document schema for page sections, blocks, themes, CTAs, and canonical form/product/page references.
- Added server-side validation for conversion-builder documents.
- Added a Page persistence envelope with `builderVersion` and `builderDocument` while retaining legacy `sections` for incremental migration.
- Added a safe legacy-section migration boundary that preserves unknown legacy content rather than guessing its semantics.
- Added automated conversion-builder schema and migration tests.
- Added Page API validation for versioned builder documents.

### Remaining before EPIC 1 can close

- Add SMTP/email delivery (or an external identity provider) so password reset does not depend on returning a development token.

### Remaining before EPIC 2 can close

- Add structured server logging.
- Add/verify database indexes based on actual query patterns.

## Conversion Builder Suite — Current Pass

### CB-1 Shared Conversion Builder Architecture

- [x] Versioned builder document envelope.
- [x] Shared section/block primitives.
- [x] Shared CTA/action model.
- [x] Shared theme/design-token model.
- [x] Canonical references to existing forms/products/pages.
- [x] Structured server validation.
- [x] Incremental Page persistence strategy.
- [x] Legacy migration boundary.
- [x] Automated schema/migration tests.

### CB-2 Lead Forms

- [x] Advanced field schema foundation merged in PR #11.
- [x] Server-side validation for advanced field types and constraints.
- [x] Mobile field editor improvements.
- [x] Public renderer support for advanced fields and conditional visibility.
- [x] Automated form schema tests.
- [ ] Form autosave/draft recovery.
- [ ] Form templates.
- [ ] AI form generation.
- [ ] Form analytics.

### Next Implementation Target

**CB-3 Landing Pages:** build the shared section-based mobile editor on top of the versioned builder document. Reuse the existing `Page` domain/API and migrate the current `sections` renderer incrementally; do not create a second page-builder data model.
