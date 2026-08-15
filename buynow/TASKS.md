# Buynow Launch Tasks

This backlog turns the current prototype into a production-ready mobile app for lead capture, CRM, pipeline management, pages, and checkout.

## Phase 1: Product foundation

- [ ] Confirm the launch scope for v1
  - Decide which features ship in the first live release and which stay behind a later roadmap.
- [ ] Define the data model
  - Create entities for users, leads, contacts, forms, submissions, pipeline stages, notes, tags, products, pages, orders, and analytics events.
- [ ] Set up app architecture
  - Replace the empty app shell with routed screens, shared layout components, and persistent state management.
- [ ] Establish design tokens and mobile layout rules
  - Lock in spacing, color, typography, navigation, and component patterns for iPhone-first use.

## Phase 2: Core app shell

- [ ] Build the bottom navigation
  - Add Home, Leads, Pipeline, Create, and More.
- [ ] Implement the Create action sheet
  - Support Lead Form, Landing Page, Buy Now Page, and Product creation entry points.
- [ ] Add reusable screen scaffolding
  - Standardize top bars, search, filters, empty states, and primary actions.
- [ ] Wire basic app routing
  - Make each navigation target and creation flow open the correct screen.

## Phase 3: Lead capture

- [ ] Build the form template chooser
  - Include common templates such as lead generation, consultation, quote request, and custom.
- [ ] Build the form builder
  - Support field creation, editing, required toggles, duplication, deletion, and reordering.
- [ ] Implement live form preview
  - Show the form as it will appear to the end user while editing.
- [ ] Add form publishing
  - Support share link generation, preview, QR code, embed snippet, and publish state.
- [ ] Build submission handling
  - Save submissions, validate inputs, and surface them in the app.

## Phase 4: CRM and leads

- [ ] Build the Leads screen
  - Add search, filters, sorting, and submission-to-lead views.
- [ ] Build lead detail pages
  - Show profile info, source, status, tags, notes, and activity history.
- [ ] Add lead actions
  - Support status changes, note creation, tagging, and follow-up tracking.
- [ ] Connect submissions to CRM records
  - Automatically create or update contacts from new form submissions.

## Phase 5: Pipeline

- [ ] Build pipeline stage management
  - Support customizable stages and a clear mobile-friendly board or list view.
- [ ] Add opportunity cards
  - Show value, stage, owner, source, and last activity.
- [ ] Support stage movement
  - Allow leads to move between stages with a simple mobile interaction.
- [ ] Add task/reminder support
  - Let users create follow-up tasks from pipeline items.

## Phase 6: Pages and selling

- [ ] Build landing page creation
  - Create a simple page editor with templates and publish/share controls.
- [ ] Build product management
  - Add product name, description, price, photo, and active/inactive status.
- [ ] Build Buy Now pages
  - Connect product display with checkout and confirmation states.
- [ ] Add checkout flow
  - Support customer details, payment section, order confirmation, and order storage.

## Phase 7: Operations and quality

- [ ] Add authentication and account handling
  - Support sign in, sign out, and protected app access.
- [ ] Add persistence and backend integration
  - Replace mock state with real storage and API calls.
- [ ] Add analytics and events
  - Track form starts, submissions, page views, purchases, and conversion funnel metrics.
- [ ] Add error states and validation
  - Handle network failures, empty states, and form validation clearly.
- [ ] Add responsive QA and device testing
  - Verify the full app on modern mobile screens and common desktop breakpoints.
- [ ] Prepare deployment
  - Configure build, environment variables, hosting, and production monitoring.

## Phase 8: Launch readiness

- [ ] Run end-to-end smoke tests
  - Verify create, publish, submit, CRM, pipeline, and checkout flows.
- [ ] Review privacy and security basics
  - Confirm input sanitization, access control, and data handling.
- [ ] Polish final UI details
  - Tighten copy, spacing, empty states, and loading states.
- [ ] Ship the first live release
  - Publish the app and confirm the primary user journeys work in production.

## Suggested build order

1. App shell and navigation
2. Form builder and publishing
3. Leads CRM
4. Pipeline
5. Pages and checkout
6. Analytics, auth, and deployment

