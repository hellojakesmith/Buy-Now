# Figma App Style Guide

## Visual Direction

Use this document as the primary visual design system for the app.

The reference style is:

- Clean, modern, premium iOS product design
- White-first interface with generous whitespace
- Strong black typography
- Electric blue as the primary brand/action color
- Violet/indigo used for gradients and elevated feature surfaces
- Very light lavender/blue backgrounds for cards and grouped content
- Rounded cards and controls with soft, subtle shadows
- Minimal visual noise
- Large, confident typography
- Clear hierarchy and highly scannable information
- Friendly but professional
- Designed to feel like a polished App Store product rather than a generic dashboard

Do NOT make the UI look overly playful, glassmorphic, neon, or overly gradient-heavy.

The dominant visual language should be:

**White + Black + Electric Blue + Soft Lavender + Violet accents**

---

# 1. Color System

## Primary Colors

### Primary Blue

```text
Blue 900: #0325D9
Blue 800: #0B36E5
Blue 700: #1748F2
Blue 600: #2857F5
Blue 500: #426AF7
Blue 100: #E9EDFF
Blue 50:  #F4F6FF
```

Use `Blue 900` as the primary brand/action color.

Use cases:

- Primary buttons
- Active navigation
- Important links
- Progress indicators
- Selected states
- Icons that require emphasis
- Primary CTA text
- Key metrics

Avoid using blue for every element. Blue should communicate importance/action.

---

## Violet / Indigo

```text
Violet 900: #5A2BE8
Violet 800: #6937ED
Violet 700: #7448F6
Violet 600: #8056F7
Violet 500: #9470FA
Violet 100: #EEE9FF
Violet 50:  #F7F5FF
```

Use violet primarily for:

- Premium features
- Hero cards
- AI functionality
- Feature highlights
- Secondary progress indicators
- Large dashboard cards
- Decorative gradients

Preferred gradient:

```text
linear-gradient(135deg, #0325D9 0%, #7448F6 100%)
```

Use gradients selectively. Most screens should remain predominantly white.

---

## Neutrals

```text
Black:        #000000
Text Primary: #111111
Text Strong:  #181818
Text Body:    #333333
Text Muted:   #6B7280
Text Light:   #9CA3AF

White:        #FFFFFF
Off White:    #FAFAFC
Surface:      #FFFFFF
Surface Soft: #F7F8FC

Border:       #E5E7EB
Border Soft:  #EEF0F5
Divider:      #E9EBF0
```

Typography should be primarily black/dark gray.

Never use pure black for every piece of secondary text.

---

## Semantic Colors

### Success

```text
Green:       #16B879
Green Light: #E8F8F1
```

Use for:

- Completed goals
- Positive changes
- Success states
- Progress
- Confirmations

### Warning

```text
Orange:       #FF8A00
Orange Light: #FFF3E5
```

Use sparingly.

### Error

```text
Red:       #EF4444
Red Light: #FEECEC
```

Use only when an actual problem requires attention.

---

# 2. Typography

## Primary Font

Use:

**Inter**

If Inter is unavailable, use:

**SF Pro Display / SF Pro Text**

Fallback:

```text
-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

The app should feel native to iOS.

---

## Typography Scale

### Display

```text
Display XL
Font: Inter
Weight: 800
Size: 40px
Line Height: 44px
Letter Spacing: -1.2px
```

Use for:

- Major onboarding headlines
- Hero statements
- Marketing-style moments

### Display Large

```text
Size: 34px
Weight: 800
Line Height: 38px
Letter Spacing: -1px
```

### Heading 1

```text
Size: 28px
Weight: 800
Line Height: 34px
Letter Spacing: -0.7px
```

### Heading 2

```text
Size: 22px
Weight: 700
Line Height: 28px
Letter Spacing: -0.3px
```

### Heading 3

```text
Size: 18px
Weight: 700
Line Height: 24px
```

### Body Large

```text
Size: 17px
Weight: 400
Line Height: 24px
```

### Body

```text
Size: 15px
Weight: 400
Line Height: 21px
```

### Body Medium

```text
Size: 15px
Weight: 600
Line Height: 21px
```

### Caption

```text
Size: 13px
Weight: 500
Line Height: 18px
```

### Micro

```text
Size: 11px
Weight: 600
Line Height: 14px
```

---

# 3. Typography Rules

Use strong weight contrast.

Example:

```text
Today's Progress
```

should use a bold heading.

Supporting information:

```text
You're 75% of the way to your daily goal.
```

should use normal or medium weight.

Important numbers should be visually dominant.

Example:

```text
1,650 / 2,200
```

The number should be substantially larger than the label.

---

# 4. Layout System

Use an 8px spacing system.

```text
4px   = micro spacing
8px   = small spacing
12px  = compact spacing
16px  = standard spacing
20px  = medium spacing
24px  = section spacing
32px  = large spacing
40px  = major spacing
48px  = hero spacing
64px  = screen-level spacing
```

Preferred screen horizontal padding:

```text
16px
```

For larger hero sections:

```text
20px
```

Never cram content against the screen edge.

---

# 5. Corner Radius

The reference design uses rounded but controlled corners.

Use:

```text
Small controls: 10px
Buttons:        12px
Input fields:   12px
Cards:          16px
Large cards:    20px
Hero cards:     20px
Modal:          24px
Bottom sheet:   28px
Circular:       999px
```

Do not make every element excessively rounded.

Cards should feel premium rather than cartoon-like.

---

# 6. Shadows

Use extremely subtle shadows.

### Card Shadow

```text
X: 0
Y: 4
Blur: 20
Spread: 0
Opacity: 6%
Color: #000000
```

### Elevated Component

```text
X: 0
Y: 8
Blur: 30
Spread: 0
Opacity: 10%
Color: #000000
```

Avoid dark or dramatic shadows.

Most cards can rely on a subtle border instead of a shadow.

Preferred:

```text
background: #FFFFFF
border: 1px solid #EEF0F5
```

---

# 7. Buttons

## Primary Button

```text
Background: #0325D9
Text: #FFFFFF
Height: 52px
Radius: 12px
Font Size: 16px
Font Weight: 700
```

Button text should be concise.

Examples:

```text
Continue
Get Started
Create Plan
Start Workout
Save Changes
```

Optional pressed state:

```text
Background: #0020B8
```

---

## Secondary Button

```text
Background: #F4F6FF
Text: #0325D9
Height: 52px
Radius: 12px
Font Weight: 700
```

---

## Ghost Button

```text
Background: transparent
Text: #0325D9
Font Weight: 700
```

Use for low-priority actions.

---

# 8. Cards

Cards are one of the primary visual building blocks.

Standard card:

```text
Background: #FFFFFF
Border: 1px solid #EEF0F5
Radius: 16px
Padding: 16px
```

Large feature card:

```text
Background: #FFFFFF
Border: none
Radius: 20px
Padding: 20px
Shadow: subtle
```

Soft information card:

```text
Background: #F7F8FC
Border: none
Radius: 16px
Padding: 16px
```

Blue feature card:

```text
Background: #0325D9
Text: #FFFFFF
Radius: 20px
Padding: 20px
```

Gradient feature card:

```text
Background: linear-gradient(135deg, #0325D9 0%, #7448F6 100%)
Text: #FFFFFF
Radius: 20px
Padding: 20px
```

---

# 9. Dashboard Design

Dashboard screens should follow this hierarchy:

```text
Greeting
↓
Primary daily metric
↓
Progress visualization
↓
Quick actions
↓
Today's plan
↓
Secondary metrics
```

Example:

```text
Good morning, Jessica 👋

Today's Progress

75%
1,650 / 2,200 calories

Protein
120 / 166g

Water
6 / 8 cups
```

The most important metric should visually dominate.

Do not give every metric equal visual weight.

---

# 10. Progress Indicators

Use circular progress indicators for major goals.

Example:

```text
75%
of daily goal
```

Recommended:

- Track: `#EEF0F5`
- Progress: `#0325D9`
- Secondary progress: `#16B879`

For multiple nutrition metrics:

```text
Calories → Blue
Protein  → Green
Water    → Blue/Violet
```

Progress should be easy to understand at a glance.

---

# 11. Icons

Use simple outline icons.

Preferred icon style:

- 1.75px–2px stroke
- Rounded line caps
- Rounded joins
- Minimal detail
- Consistent visual weight

Recommended icon libraries:

- SF Symbols for native iOS
- Lucide
- Phosphor

Avoid mixing multiple icon styles.

---

# 12. Icon Containers

The reference design frequently uses icons inside soft rounded-square containers.

Example:

```text
Container:
48 × 48px
Radius: 12px
Background: #F4F6FF
```

Icon:

```text
24 × 24px
Color: #0325D9
```

For semantic categories:

```text
Workout → Violet
Nutrition → Orange
Progress → Blue
Success → Green
AI → Violet
```

---

# 13. Navigation

Use a simple iOS-style bottom navigation.

Recommended:

```text
Home
Plan
+
Progress
Profile
```

The center action can be emphasized.

Center action:

```text
48 × 48px
Circle
Background: #0325D9
White icon
```

Active navigation:

```text
Icon: #0325D9
Label: #0325D9
Weight: 600
```

Inactive:

```text
Icon: #9CA3AF
Label: #9CA3AF
```

Keep navigation visually quiet.

The content should remain the primary focus.

---

# 14. Header Design

Use simple headers.

Example:

```text
☰       Dashboard       🔔
```

or:

```text
Good morning, Jake 👋
Let's make today count.
```

Header hierarchy:

```text
Greeting → 22–28px bold
Supporting text → 14–15px muted
```

Avoid oversized navigation bars.

---

# 15. Forms and Inputs

Inputs should be extremely clean.

```text
Height: 52px
Radius: 12px
Background: #F7F8FC
Border: 1px solid #E5E7EB
Padding: 16px
```

Focused state:

```text
Border: #0325D9
Background: #FFFFFF
```

Label:

```text
13–14px
Weight: 600
Color: #333333
```

Error:

```text
Border: #EF4444
Text: #EF4444
```

---

# 16. Onboarding

Onboarding should use the same visual language as the reference.

Structure:

```text
Small brand mark

Large bold headline

Short supporting explanation

Visual / illustration / metric

Input or selection

Primary CTA

Progress indicator
```

Example hierarchy:

```text
Let's personalize
your experience.

We'll use a few details to create
your recommendations.

[ Weight ]

[ 180 lb ]

                    Continue →
```

Use large typography and plenty of whitespace.

---

# 17. Selection Controls

For selectable options use cards rather than traditional radio buttons whenever possible.

Unselected:

```text
Background: #FFFFFF
Border: #E5E7EB
Radius: 14px
```

Selected:

```text
Background: #F4F6FF
Border: #0325D9
```

Selected icon:

```text
Background: #0325D9
Color: #FFFFFF
```

The selected state should be immediately obvious.

---

# 18. Lists

Use generous vertical spacing.

List item:

```text
Minimum height: 64px
Padding: 12–16px
```

Structure:

```text
[Icon]  Title
        Supporting text                 Value >
```

Avoid excessive dividers.

Prefer spacing and card grouping.

---

# 19. AI / Premium Features

AI features should have a recognizable violet identity.

Use:

```text
Primary AI: #7448F6
AI Light: #F1EDFF
```

Example:

```text
✨ AI Meal Planner

Build a personalized meal plan
based on your goals and preferences.

[ Create My Plan ]
```

AI cards can use a subtle:

```text
Blue → Violet
```

gradient.

Do not make the entire app purple.

---

# 20. Data Visualization

Charts should be simple.

Use:

- Blue for primary data
- Violet for secondary data
- Green for positive/success
- Gray for comparison/background

Charts should have:

- Minimal grid lines
- No unnecessary borders
- Clear labels
- Large key values
- Rounded line caps
- Rounded chart points when appropriate

Avoid dense enterprise-dashboard charts.

The user should understand the chart within 1–2 seconds.

---

# 21. Photography / Illustrations

If imagery is used:

- Use clean, high-quality photography
- Prefer bright backgrounds
- Avoid overly saturated stock photography
- Use rounded image containers
- Maintain generous whitespace
- Avoid excessive decorative elements

Images should support the content rather than dominate the UI.

---

# 22. Visual Hierarchy

Every screen should have one obvious primary action.

Use this hierarchy:

```text
1. Primary headline / key metric
2. Primary CTA
3. Important supporting content
4. Secondary actions
5. Supporting metadata
```

Do not make every element bold.

Use whitespace as a hierarchy tool.

---

# 23. Density

The reference design is intentionally spacious.

Prefer:

```text
One strong card
```

over:

```text
Five tiny cards
```

Prefer:

```text
Large metric + supporting detail
```

over:

```text
Many equal-weight metrics
```

Avoid dashboard clutter.

---

# 24. Figma Component Naming

Use a consistent component structure.

Recommended naming:

```text
Button/Primary
Button/Secondary
Button/Ghost

Card/Default
Card/Feature
Card/Gradient
Card/Metric

Input/Default
Input/Focused
Input/Error

IconContainer/Blue
IconContainer/Violet
IconContainer/Green
IconContainer/Orange

Navigation/Bottom
Navigation/Tab

Progress/Circular
Progress/Linear

Badge/Default
Badge/Success
Badge/Premium

Header/Default
Header/Greeting
```

Use variants instead of duplicating components.

---

# 25. Figma Variables

Create variables for:

### Colors

```text
color/brand/blue
color/brand/violet

color/text/primary
color/text/secondary
color/text/muted

color/background/primary
color/background/secondary

color/border/default

color/status/success
color/status/warning
color/status/error
```

### Spacing

```text
space/1 = 4
space/2 = 8
space/3 = 12
space/4 = 16
space/5 = 20
space/6 = 24
space/8 = 32
space/10 = 40
space/12 = 48
space/16 = 64
```

### Radius

```text
radius/sm = 10
radius/md = 12
radius/lg = 16
radius/xl = 20
radius/2xl = 24
radius/full = 999
```

---

# 26. Responsive / iPhone Rules

Design primarily for iPhone.

Base design target:

```text
390 × 844
```

Also validate:

```text
375 × 812
430 × 932
```

Use Auto Layout everywhere.

Avoid fixed-width elements whenever possible.

Recommended:

```text
Horizontal screen padding: 16px
Card gap: 12–16px
Section gap: 24–32px
```

Respect:

- Safe areas
- Dynamic Island
- Home indicator
- Keyboard
- Dynamic Type
- Different iPhone widths

---

# 27. Accessibility

Maintain strong contrast.

Primary text:

```text
#111111 on #FFFFFF
```

Primary button:

```text
#FFFFFF on #0325D9
```

Do not rely on color alone to communicate state.

Selected controls should also use:

- Border
- Icon
- Checkmark
- Weight
- Background change

Minimum touch target:

```text
44 × 44px
```

---

# 28. Motion

Animations should be subtle and fast.

Preferred:

```text
150–250ms
```

Use:

- Fade
- Scale
- Slide
- Progress animation

Avoid:

- Excessive bouncing
- Long transitions
- Distracting animations

A successful action can use a small scale/fade interaction.

---

# 29. Overall Design Rules

## DO

- Use lots of white space
- Use bold black headlines
- Use electric blue for primary actions
- Use violet selectively for premium/AI features
- Use rounded cards
- Use subtle borders
- Use soft shadows
- Make important numbers large
- Keep screens visually simple
- Use consistent 8px spacing
- Use native iOS conventions
- Make the primary action obvious
- Use strong contrast
- Keep visual hierarchy intentional

## DON'T

- Don't use dark-mode-first styling
- Don't use excessive gradients
- Don't make every card colorful
- Don't use heavy shadows
- Don't use tiny typography
- Don't overcrowd dashboards
- Don't use multiple competing accent colors
- Don't mix icon styles
- Don't use giant rounded pills for everything
- Don't make every element look like a button
- Don't create an enterprise SaaS dashboard aesthetic
- Don't use glassmorphism as the primary design language
- Don't use excessive decorative graphics

---

# 30. Reference Design Translation

When recreating the provided reference visually, prioritize these characteristics:

```text
BACKGROUND
White / #FFFFFF

PRIMARY TEXT
Black / #111111

PRIMARY BRAND
Electric Blue / #0325D9

SECONDARY BRAND
Violet / #7448F6

SOFT SURFACE
#F7F8FC

BORDER
#EEF0F5

SUCCESS
#16B879

WARNING
#FF8A00

ERROR
#EF4444
```

The overall visual ratio should approximately feel like:

```text
70–80% White / Neutral
10–15% Black / Dark Typography
5–10% Blue
2–5% Violet
Small amounts of semantic colors
```

Blue and violet are accents, not the background of the entire application.

---

# 31. Screen Design Formula

For most screens, use:

```text
[Safe Area]

Header
↓
Page Title
↓
Primary Content / Hero Card
↓
Section Heading
↓
Supporting Cards / Lists
↓
Secondary Action
↓
[Bottom Navigation]
```

For content-heavy screens:

```text
Page Header
↓
Primary Metric
↓
Progress
↓
Quick Actions
↓
Main Content
↓
Supporting Content
```

---

# 32. Final Figma Instruction

The app should look like a polished, modern iPhone application inspired by the provided reference image.

The visual goal is:

**Clean + Bold + Premium + Friendly + Athletic/Modern + Highly Usable**

The interface should immediately communicate:

- Professional quality
- Confidence
- Simplicity
- Modern technology
- Strong visual hierarchy
- Easy-to-understand information
- High-quality App Store product design

When there is a design decision between adding more visual elements and simplifying the interface, choose simplicity.

When there is a design decision between making something colorful and keeping it white with a strong blue accent, choose the white/blue approach.

When there is a design decision between small dense information and one large clear metric, choose the large clear metric.

**The design should feel intentional, spacious, crisp, and premium.**
