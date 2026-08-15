# Build a Mobile-First Lead Capture, CRM, Pipeline & Checkout App

Design and prototype a polished, production-quality **iPhone mobile application** that combines:

* Typeform-style lead form creation
* Lead capture
* Lightweight CRM
* Sales/project pipeline management
* Landing page creation
* Buy Now / checkout page creation
* Product management
* Lead and customer management

The product should feel like a modern combination of **Typeform + HubSpot CRM + Carrd + simple checkout**, but optimized specifically for a fast, simple mobile workflow.

The user should be able to create a form or landing page from their phone, share it with customers, capture leads, manage those leads in a CRM pipeline, and optionally sell a product directly through a checkout page.

---

# 1. Core Product Concept

The app revolves around five primary capabilities:

1. **Capture**

   * Create lead forms
   * Share forms
   * Collect customer information
   * Capture custom fields
   * View submissions

2. **CRM**

   * Automatically turn submissions into leads/contacts
   * View customer profiles
   * Track lead activity
   * Add notes
   * Add tags
   * View source
   * Track status

3. **Pipeline**

   * Move leads through customizable stages
   * Manage sales/projects
   * Track opportunities
   * Assign values
   * Add tasks
   * Track activity

4. **Pages**

   * Create templated landing pages
   * Create lead-generation pages
   * Create simple marketing pages
   * Publish/share pages

5. **Sell**

   * Create products
   * Create Buy Now pages
   * Add product photo
   * Product name
   * Product description
   * Price
   * Checkout form
   * Payment section
   * Order confirmation

The product should feel like **one connected system**, not five separate tools.

---

# 2. Primary Navigation

Use a simple bottom navigation designed for iPhone.

Recommended navigation:

```text
Home
Leads
Pipeline
Create
More
```

### Home

Dashboard overview.

### Leads

CRM / contacts / submissions.

### Pipeline

Sales and project pipeline.

### Create

Central creation button for:

```text
Lead Form
Landing Page
Buy Now Page
Product
```

### More

Secondary features:

```text
Pages
Products
Orders
Analytics
Settings
Integrations
```

The central Create button should be visually emphasized.

---

# 3. Visual Design System

Follow the provided `style.md` design system exactly.

The visual language should be:

**Clean + Bold + Premium + Friendly + Modern + Mobile-first**

Primary colors:

```text
Primary Blue: #0325D9
Primary Violet: #7448F6

Text: #111111
Muted Text: #6B7280

Background: #FFFFFF
Soft Background: #F7F8FC

Border: #EEF0F5

Success: #16B879
Warning: #FF8A00
Error: #EF4444
```

Use white as the dominant background.

Blue should communicate actions and important states.

Violet should primarily communicate:

* Premium features
* AI
* Creation
* Special features
* Secondary visual emphasis

Do not make the application overly colorful.

---

# 4. Typography

Use:

```text
Inter
```

Fallback:

```text
SF Pro Display
SF Pro Text
```

Typography should be bold and highly readable.

Use large typography for:

* Dashboard metrics
* Page titles
* Lead names
* Revenue
* Pipeline values
* Conversion metrics

Use muted text for secondary metadata.

---

# 5. Home Dashboard

Create a clean dashboard.

Top:

```text
Good morning, Jake 👋

Here's what's happening today.
```

Primary metric card:

```text
Total Leads

1,248

+12.5% this month
```

Use a blue/violet gradient card for the primary overview.

Then:

```text
New Leads
+42

Pipeline Value
$24,560

Conversions
8.4%

Orders
126
```

Use clean metric cards.

Then:

```text
Recent Leads
```

Example:

```text
Sarah Johnson
Interested in Website Design
Today · 10:42 AM

Mike Rodriguez
Downloaded Lead Magnet
Today · 9:18 AM

Jessica Smith
Requested Consultation
Yesterday
```

Then:

```text
Pipeline Overview
```

Show a compact horizontal visualization of:

```text
New
Contacted
Qualified
Proposal
Won
```

At the bottom, provide a prominent:

```text
+ Create
```

CTA.

---

# 6. Create Flow

The Create button is one of the most important parts of the application.

When tapped, show a clean bottom sheet.

Title:

```text
Create Something
```

Options:

### Lead Form

Icon: form/document

```text
Capture leads and customer information
```

### Landing Page

Icon: layout

```text
Create a simple marketing page
```

### Buy Now Page

Icon: shopping bag

```text
Sell a product with checkout
```

### Product

Icon: package

```text
Create a product to sell
```

Each option should use a rounded card with an icon container.

---

# 7. Lead Form Builder

Create a mobile-friendly form builder.

The builder should feel simpler than a traditional desktop form builder.

Header:

```text
New Lead Form

Save
Publish
```

Show a live form preview.

Example:

```text
Let's get started

Tell us a little about yourself.

[ First Name ]

[ Last Name ]

[ Email ]

[ Phone ]

What are you interested in?

○ Website Design
○ Marketing
○ App Development
○ Other

[ Submit ]
```

Below or through an Edit mode, allow the user to add fields.

Field types:

```text
Short Text
Long Text
Email
Phone
Number
Dropdown
Multiple Choice
Checkboxes
Date
File Upload
Address
```

Each field should be represented as a draggable card.

Example:

```text
☰  Email
    Required
```

Allow:

* Reordering
* Editing
* Required toggle
* Delete
* Duplicate

---

# 8. Form Templates

When creating a Lead Form, first show templates.

Categories:

```text
Lead Generation
Contact Us
Consultation
Event Registration
Quote Request
Job Application
Customer Feedback
Newsletter
Client Intake
Custom
```

Each template should have a visual preview.

Example:

```text
Consultation Request

Name
Email
Phone
What can we help with?
Preferred date

[ Request Consultation ]
```

Provide:

```text
Use Template
Start Blank
```

---

# 9. Form Publishing

After creating a form, show:

```text
Your form is ready 🎉
```

Options:

```text
Copy Link
Share
Preview
Edit
```

Show a generated URL card.

Also provide:

```text
QR Code
```

and:

```text
Embed
```

The primary action should be:

```text
Share Form
```

---

# 10. Leads / CRM

The Leads screen is the core CRM.

Header:

```text
Leads

[ Search ]
```

Filters:

```text
All
New
Contacted
Qualified
Customer
```

Lead list:

```text
[Avatar]

Sarah Johnson
sarah@email.com

Interested in Website Design

New
Today
```

Each lead should show:

* Name
* Email
* Phone if available
* Lead source
* Status
* Date
* Tags

Use clean cards or list rows.

---

# 11. Lead Profile

When a lead is selected, open a detailed CRM profile.

Header:

```text
Sarah Johnson

Qualified

[ Call ] [ Email ]
```

Information:

```text
Email
sarah@email.com

Phone
(512) 555-1234

Source
Website Lead Form

Created
August 15, 2026
```

Then:

```text
Activity
```

Timeline:

```text
Lead created
10:42 AM

Form submitted
10:42 AM

Status changed to Qualified
11:03 AM

Note added
11:10 AM
```

Then:

```text
Notes
```

Then:

```text
Tags
```

Then:

```text
Pipeline
```

Show the current pipeline stage.

Provide actions:

```text
Move Stage
Add Note
Add Task
Change Status
Send Email
Call
```

---

# 12. Pipeline

Create a mobile-friendly pipeline.

Header:

```text
Pipeline

$48,250 Total Value
```

Stages:

```text
New
↓
Contacted
↓
Qualified
↓
Proposal
↓
Won
```

Each opportunity card:

```text
Sarah Johnson

Website Project

$4,500

Qualified
```

Because this is a mobile app, do NOT attempt to cram a traditional desktop Kanban board horizontally onto the screen.

Instead, use:

### Stage selector

```text
< Qualified >

3 Opportunities
```

Then show cards for the selected stage.

Allow horizontal swiping between stages.

---

# 13. Pipeline Opportunity

Create an opportunity detail screen.

Example:

```text
Sarah Johnson

Website Project

$4,500

Qualified
```

Actions:

```text
Move Stage
Edit
Add Task
Add Note
```

Information:

```text
Contact
Sarah Johnson

Value
$4,500

Expected Close
Aug 28

Source
Website Form
```

Activity timeline underneath.

---

# 14. Landing Page Builder

The Landing Page creation experience should be template-driven.

Do NOT attempt to build a complicated Webflow-style editor.

Instead:

```text
Choose Template
↓
Customize Content
↓
Preview
↓
Publish
```

Template categories:

```text
Lead Generation
Service Business
Consultation
Event
Personal Brand
Agency
Product
Newsletter
```

Example template:

```text
Grow Your Business

We help small businesses
generate more customers.

[ Get Started ]

Trusted by 500+ businesses
```

Allow editing:

```text
Logo
Headline
Subheadline
Hero Image
Button Text
Button Link
Features
Testimonials
Contact Information
```

Keep the editor extremely simple.

---

# 15. Landing Page Templates

Show template cards.

Each card should include:

* Preview image
* Template name
* Category
* Use Template button

Examples:

```text
Modern Agency
Lead Generation

Service Business
Consultation

Creator
Personal Brand

Simple SaaS
Product Signup

Local Business
Contact
```

Use large visual previews.

---

# 16. Landing Page Editor

Use a section-based editor.

Example:

```text
Page

[ Hero ]
[ Features ]
[ Social Proof ]
[ CTA ]
[ Footer ]
```

Each section can be edited.

Example:

```text
Hero

Headline
Grow your business faster

Description
We help businesses turn visitors
into customers.

Button
Get Started

Image
[ Upload ]
```

Actions:

```text
Edit
Duplicate
Delete
Move Up
Move Down
```

Do not expose complex CSS controls.

The user should be able to create a page in under 5 minutes.

---

# 17. Buy Now Page

This is a major product feature.

The Buy Now Page should be intentionally simple.

The user creates:

```text
Product Name
Product Photo
Price
Description
```

Then the app automatically generates a landing page containing:

```text
Product Image

Product Name

$49.00

Product Description

[ Checkout Form ]

Name
Email
Phone
Billing Information

[ Payment ]

Card Number
Expiration
CVC

[ Buy Now ]
```

The entire checkout should happen on the same page.

No complicated multi-step checkout unless necessary.

---

# 18. Product Creation

Product creation screen:

```text
Create Product
```

Fields:

```text
Product Photo
[ Upload Photo ]

Product Name
[ Enter product name ]

Price
$49.00

Description
[ Describe your product ]

[ Create Buy Now Page ]
```

Optional:

```text
SKU
Inventory
Product Category
```

Keep these secondary.

The fastest path should be:

```text
Photo
Name
Price
Description
Create Page
```

---

# 19. Product Library

Create:

```text
Products
```

Each product:

```text
[Product Image]

Premium Consultation

$299

127 Sales

Active
```

Actions:

```text
Edit
View Page
Share
Orders
Duplicate
```

Primary CTA:

```text
+ Product
```

---

# 20. Checkout Preview

Create a realistic mobile checkout preview.

Example:

```text
[Product Image]

Premium Consultation

$299

Get a personalized consultation
designed to help you grow your business.

Your Information

Name
[____________]

Email
[____________]

Payment

Card
[____________]

Expiration       CVC
[______]        [____]

Total
$299

[ Buy Now ]
```

The Buy Now button should be large, blue, and visually dominant.

---

# 21. Orders

Create an Orders section.

Header:

```text
Orders
```

Metrics:

```text
Revenue
$12,450

Orders
84

Average Order
$148
```

Order list:

```text
#1048

Premium Consultation
$299

Sarah Johnson
Paid

Today
```

Statuses:

```text
Paid
Pending
Refunded
Failed
```

---

# 22. Analytics

Create a lightweight analytics dashboard.

Metrics:

```text
Visitors
12,840

Leads
1,248

Conversion Rate
9.7%

Revenue
$24,560
```

Charts:

```text
Visitors
Leads
Conversions
Revenue
```

Include date filters:

```text
7 Days
30 Days
90 Days
Custom
```

Keep analytics simple.

Do not create an enterprise BI dashboard.

---

# 23. Lead → CRM → Pipeline Connection

This is extremely important.

The prototype should visually communicate that these systems are connected.

Example:

A customer submits:

```text
Consultation Form
```

The app automatically creates:

```text
Lead
Sarah Johnson
```

The lead can then become:

```text
Pipeline Opportunity
Website Project
$4,500
```

The pipeline stage can move:

```text
New
→ Contacted
→ Qualified
→ Proposal
→ Won
```

This should feel seamless.

---

# 24. Form Submission → Lead Creation

When viewing form submissions:

```text
Consultation Form

128 Responses
```

Show:

```text
Sarah Johnson
sarah@email.com

Submitted:
Today 10:42 AM

Status:
New

[ View Lead ]
```

Primary action:

```text
Create Lead
```

If automatic CRM creation is enabled, show:

```text
✓ Added to Leads
```

---

# 25. Empty States

Every major screen needs a polished empty state.

Example:

### No Leads

```text
No leads yet

Create your first lead form
and start capturing customers.

[ Create Lead Form ]
```

### No Pipeline Opportunities

```text
Your pipeline is empty

Add your first opportunity
to start tracking sales.

[ Add Opportunity ]
```

### No Products

```text
Sell something

Create a product and launch
a simple Buy Now page.

[ Create Product ]
```

Use simple line illustrations or icons.

---

# 26. Search

Global search should be accessible.

Search across:

```text
Leads
Contacts
Pipeline
Products
Orders
Pages
Forms
```

Example:

```text
Search anything...
```

Results grouped by:

```text
Leads
Pipeline
Products
Pages
```

---

# 27. Notifications

Notification center:

```text
Notifications
```

Examples:

```text
New lead captured

Sarah Johnson submitted
Consultation Request.

2 minutes ago
```

```text
Payment received

$299 payment from
Mike Rodriguez.

15 minutes ago
```

```text
Pipeline update

Sarah Johnson moved to
Proposal.

1 hour ago
```

---

# 28. Settings

Settings should include:

```text
Account
Workspace
Team
Notifications
Integrations
Payments
Domains
Forms
Pages
Products
Subscription
```

Payment integrations:

```text
Stripe
PayPal
```

Do not design complex integration flows yet.

---

# 29. Overall UX Philosophy

The app should optimize for:

## Speed

A user should be able to create:

```text
Lead Form → under 2 minutes

Landing Page → under 5 minutes

Buy Now Page → under 3 minutes

Product → under 1 minute
```

## Simplicity

Avoid complicated configuration.

## Connected Data

A form submission should naturally become a CRM record.

A CRM record should naturally become a pipeline opportunity.

A product should naturally become a checkout page.

## Mobile First

Every important action must be possible from an iPhone.

---

# 30. Design Details

Use:

```text
16px horizontal screen padding
16–20px card padding
12–16px spacing between cards
24–32px section spacing
16–20px card radius
12px button radius
52px primary button height
44px minimum touch target
```

Use Auto Layout throughout the Figma design.

Use components and variants.

Create reusable components for:

```text
Buttons
Cards
Inputs
Form Fields
Lead Rows
Pipeline Cards
Metric Cards
Navigation
Bottom Sheets
Modals
Badges
Tabs
Progress Indicators
Product Cards
Order Cards
Template Cards
```

---

# 31. Prototype Requirements

Create interactive prototype flows for the major use cases.

## Flow 1 — Create Lead Form

```text
Home
→ Create
→ Lead Form
→ Choose Template
→ Edit Form
→ Preview
→ Publish
→ Share
```

## Flow 2 — Capture Lead

```text
Published Form
→ Form Submission
→ Lead Created
→ Lead Profile
→ Move to Pipeline
```

## Flow 3 — Manage Pipeline

```text
Pipeline
→ Opportunity
→ View Details
→ Move Stage
→ Add Note
→ Mark Won
```

## Flow 4 — Create Landing Page

```text
Create
→ Landing Page
→ Choose Template
→ Customize
→ Preview
→ Publish
```

## Flow 5 — Sell Product

```text
Create
→ Product
→ Add Product
→ Create Buy Now Page
→ Checkout Preview
→ Publish
→ Customer Checkout
→ Order Created
```

---

# 32. Important Product Architecture Concept

The UI should make the product feel like one ecosystem.

Use this mental model:

```text
                    APP
                     |
        +------------+------------+
        |            |            |
      CAPTURE       SELL        MANAGE
        |            |            |
      Forms       Products     CRM
        |            |            |
      Pages       Checkout    Pipeline
        |            |            |
        +------------+------------+
                     |
                  Analytics
```

The user should never feel like they are switching between unrelated products.

---

# 33. Home Screen Quick Actions

The Home screen should prominently provide:

```text
Create Lead Form
Create Landing Page
Create Buy Now Page
Add Lead
Add Product
```

Use a compact quick-action grid.

Example:

```text
┌──────────────┐ ┌──────────────┐
│  + Form      │ │  + Page      │
│  Lead Form   │ │  Landing     │
└──────────────┘ └──────────────┘

┌──────────────┐ ┌──────────────┐
│  + Product   │ │  + Lead      │
│  Sell        │ │  CRM         │
└──────────────┘ └──────────────┘
```

---

# 34. Mobile Interaction

Use:

* Bottom sheets
* Swipe gestures
* Horizontal stage selectors
* Sticky primary CTAs
* Full-screen editors
* Native iOS navigation
* Pull-to-refresh where appropriate
* Confirmation dialogs only when necessary

Avoid desktop-style modal overload.

---

# 35. Final Visual Direction

The final application should look like a **premium modern SaaS product redesigned specifically for iPhone**.

Reference aesthetic:

```text
Apple-like simplicity
+
Modern SaaS functionality
+
Typeform simplicity
+
HubSpot CRM organization
+
Carrd-style landing pages
+
Simple mobile checkout
```

But do not copy any competitor's branding.

Create an original visual identity using the provided blue/violet/white design system.

The interface should be:

**Clean**

**Bold**

**Fast**

**Premium**

**Simple**

**Highly scannable**

**Mobile-first**

The user should be able to open the app and immediately understand:

> "I can capture leads, manage them, create pages, and sell things — all from here."

Prioritize the **Home, Create, Leads, Pipeline, Form Builder, Landing Page Builder, Product Builder, and Checkout** experiences first.

Do not over-design secondary settings or enterprise functionality.

Build the prototype as if this is the first polished MVP being prepared for App Store launch.
