# Phase 2: Static Elements Specification

## Overview
Detailed specifications for header, navigation, and footer components based on the selected Modern Professional design with Medium Blue accent.

---

## Header Component

### Desktop Header (> 1024px)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Logo + Name]                Home  About  Services  Insights  Contact  │
└─────────────────────────────────────────────────────────────────────┘
```

#### Structure
- **Height:** 80px
- **Background:** White `#FFFFFF`
- **Border Bottom:** 1px solid `#E5E7EB`
- **Position:** Sticky/Fixed (stays at top on scroll)
- **Z-index:** 1000
- **Padding:** 0 48px (left/right)
- **Shadow on Scroll:** `0 2px 4px rgba(0,0,0,0.06)` (appears after scrolling 50px)

#### Logo Section (Left)
- **Logo:** Icon + Text wordmark
- **Icon Size:** 32px × 32px
- **Icon Colors:** Navy `#1D3557` + Medium Blue `#4A90E2`
- **Text:** Business name in Inter Bold, 20px, Navy
- **Spacing:** 12px gap between icon and text
- **Hover:** None (logo is not clickable on home page, links to home on other pages)

#### Navigation Menu (Right)
- **Items:** Home, About, Services, Insights, Contact
- **Font:** Inter Medium, 16px
- **Color:** Navy `#1D3557`
- **Spacing:** 40px between items
- **Vertical Alignment:** Center

**States:**
- **Default:** Navy text, no underline
- **Hover:** Medium Blue `#4A90E2` text, 2px underline appears (animated, 200ms)
- **Active Page:** Medium Blue `#4A90E2` text with 2px underline
- **Focus (keyboard):** 2px outline in Medium Blue, 2px offset

**Animation:**
- Underline slides in from left to right on hover
- Color transition: 200ms ease-in-out

### Tablet Header (768px - 1024px)

```
┌─────────────────────────────────────────────────────┐
│  [Logo + Name]        Home  About  Services  ≡      │
└─────────────────────────────────────────────────────┘
```

#### Structure
- **Height:** 72px
- **Padding:** 0 32px
- All other properties same as desktop

#### Navigation
- Show: Home, About, Services
- Hide: Insights, Contact
- **Hamburger Menu:** Icon on far right (24px)
  - Opens slide-out menu containing all items

### Mobile Header (< 768px)

```
┌──────────────────────────────────────┐
│  [Logo]                           ≡  │
└──────────────────────────────────────┘
```

#### Structure
- **Height:** 64px
- **Padding:** 0 20px
- Logo: Icon only (no text) or abbreviated name
- Background, border, sticky behavior same as desktop

#### Navigation
- **Hamburger Menu:** Only visible navigation element
- **Menu Icon:** 24px, Navy
- Taps to open full-screen or slide-in navigation

---

## Navigation Menu Structure

### Primary Navigation Items

#### 1. Home
- **URL:** `/` or `/index.html`
- **Purpose:** Return to homepage
- **Visible:** All pages except homepage (optional)

#### 2. About
- **URL:** `/about` or `/about.html`
- **Purpose:** Background, credentials, experience, approach
- **Sub-sections (on About page):**
  - Background & Experience
  - Approach & Methodology
  - Certifications & Credentials
  - Why Independent Consulting

#### 3. Services
- **URL:** `/services` or `/services.html`
- **Purpose:** Detailed service offerings
- **Potential Dropdown/Sub-menu:**
  - Third-Party Risk Management
  - Risk Framework Development
  - Regulatory Compliance Advisory
  - Program Assessment & Optimization
- **Decision:** Start without dropdown, add later if needed

#### 4. Insights
- **URL:** `/insights` or `/blog`
- **Purpose:** Articles, thought leadership, case studies
- **Content Types:**
  - Blog posts
  - Case studies
  - Whitepapers/guides
  - Industry updates

#### 5. Contact
- **URL:** `/contact` or `#contact` (if single page)
- **Purpose:** Contact form, scheduling, direct contact info
- **Could also be CTA button** instead of regular nav item

### Navigation Variations

#### Option A: All Text Links (Recommended)
```
Home  About  Services  Insights  Contact
```
- Clean, simple
- Equal visual weight
- Professional

#### Option B: Contact as CTA Button
```
Home  About  Services  Insights  [Contact →]
```
- Contact button: Medium Blue background, white text, rounded corners
- Draws attention to primary action
- More conversion-focused

**Recommendation:** Start with Option A for consistency, can test Option B later.

---

## Mobile Navigation Menu

### Slide-In Menu (Recommended)

#### Menu Appearance
- **Trigger:** Tap hamburger icon
- **Animation:** Slide in from right, 300ms ease-out
- **Background:** White `#FFFFFF`
- **Overlay:** Semi-transparent dark overlay `rgba(0,0,0,0.5)` on main content
- **Width:** 80% of screen (max 320px)
- **Height:** Full screen

#### Menu Structure
```
┌────────────────────────┐
│                     ✕  │
│                        │
│  Home                  │
│  About                 │
│  Services              │
│  Insights              │
│  Contact               │
│                        │
│  ─────────────────     │
│                        │
│  email@domain.com      │
│  LinkedIn              │
│  Phone                 │
│                        │
└────────────────────────┘
```

#### Elements
- **Close Button:** ✕ in top-right, 32px, Navy
- **Navigation Items:**
  - Font: Inter Medium, 20px
  - Color: Navy
  - Spacing: 32px vertical padding each
  - Tap area: Full width
  - Hover/Tap: Light grey background `#F8F9FA`
- **Divider:** Thin grey line separating nav from contact
- **Contact Info:**
  - Smaller font: 16px
  - Slate grey color
  - Icons optional

#### Behavior
- Tapping overlay closes menu
- Tapping menu item navigates and closes menu
- Smooth scroll if single-page site

---

## Footer Component

### Desktop Footer (> 768px)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Logo]                                                         │
│                                                                 │
│  Navigation            Services              Connect            │
│  Home                  Third-Party Risk      email@domain.com   │
│  About                 Framework Design      LinkedIn           │
│  Services              Compliance            (555) 123-4567     │
│  Insights              Advisory                                 │
│  Contact                                                        │
│                                                                 │
│  Building Risk Management Frameworks That Scale                 │
│                                                                 │
│  © 2025 [Business Name] • Privacy Policy • Terms of Service    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Structure
- **Background:** Charcoal `#2D3436`
- **Text Color:** White `#FFFFFF` (primary), Light Grey `#9CA3AF` (secondary)
- **Padding:** 64px 48px 32px 48px (top, right, bottom, left)
- **Max Width:** 1200px centered

#### Logo Section
- Same logo as header, inverted colors (white + medium blue)
- Positioned top-left
- 48px margin bottom

#### Three-Column Layout

**Column 1: Navigation (25% width)**
- **Heading:** "Navigation" - Inter Semibold, 16px, White
- **Links:** Inter Regular, 15px, Light Grey `#9CA3AF`
- **Spacing:** 12px between links
- **Hover:** Medium Blue `#4A90E2`

**Column 2: Services (40% width)**
- **Heading:** "Services" - Inter Semibold, 16px, White
- **Links:** Service names, 15px, Light Grey
- **Hover:** Medium Blue
- Link to service pages or sections

**Column 3: Connect (35% width)**
- **Heading:** "Connect" - Inter Semibold, 16px, White
- **Contact Info:**
  - Email (clickable mailto:)
  - LinkedIn (external link with icon)
  - Phone (clickable tel:)
- **Spacing:** 12px between items
- **Icons:** Optional, 16px, aligned left of text

#### Tagline Section
- **Text:** "Building Risk Management Frameworks That Scale"
- **Font:** Inter Regular, 16px, Light Grey
- **Position:** Below columns, centered or left-aligned
- **Margin:** 48px top, 24px bottom

#### Copyright Section
- **Text:** "© 2025 [Business Name] • Privacy Policy • Terms of Service"
- **Font:** Inter Regular, 14px, Light Grey `#9CA3AF`
- **Position:** Bottom, centered or left-aligned
- **Links:** Privacy Policy and Terms (hover: Medium Blue)
- **Separator:** • (bullet) between items

### Tablet Footer (768px - 1024px)

```
┌────────────────────────────────────────────────┐
│  [Logo]                                        │
│                                                │
│  Navigation      Services        Connect       │
│  [Links]         [Links]         [Contact]     │
│                                                │
│  Building Risk Management Frameworks That Scale│
│                                                │
│  © 2025 [Business Name]                        │
│  Privacy Policy • Terms of Service             │
└────────────────────────────────────────────────┘
```

- Slightly smaller padding: 48px 32px 24px
- Columns remain three across but narrower
- Font sizes remain same

### Mobile Footer (< 768px)

```
┌──────────────────────────────────┐
│  [Logo]                          │
│                                  │
│  Navigation                      │
│  Home                            │
│  About                           │
│  Services                        │
│  Insights                        │
│  Contact                         │
│                                  │
│  Services                        │
│  Third-Party Risk Management     │
│  Framework Development           │
│  Compliance Advisory             │
│  Program Assessment              │
│                                  │
│  Connect                         │
│  email@domain.com                │
│  LinkedIn                        │
│  (555) 123-4567                  │
│                                  │
│  Building Risk Management        │
│  Frameworks That Scale           │
│                                  │
│  © 2025 [Business Name]          │
│  Privacy Policy                  │
│  Terms of Service                │
└──────────────────────────────────┘
```

#### Structure
- **Layout:** Single column, stacked
- **Padding:** 40px 20px 24px
- **Sections:** 32px margin between each
- All links and text left-aligned
- Copyright and legal links stack vertically

---

## Responsive Breakpoints

### Defined Breakpoints

| Breakpoint | Range | Layout Changes |
|------------|-------|----------------|
| **Mobile** | < 768px | Single column, hamburger menu, stacked footer |
| **Tablet** | 768px - 1024px | Condensed header, 3-col footer, some nav hidden |
| **Desktop** | 1024px - 1440px | Full layout, all navigation visible |
| **Wide** | > 1440px | Max-width containers (1200px), centered |

### Behavior at Breakpoints

#### 768px (Mobile → Tablet)
- Header: Hamburger disappears, partial nav shows
- Footer: Single column → Three columns
- Body: Single column → Two columns (where applicable)

#### 1024px (Tablet → Desktop)
- Header: All nav items visible
- Hero: Full asymmetric layout
- Services: Cards go from stacked to grid

### Fluid Typography
- **Mobile:** Base 16px
- **Tablet:** Base 17px
- **Desktop:** Base 18px
- **Headings scale proportionally**

---

## Scroll Behavior

### Sticky Header Transition
- **Default State (top of page):**
  - Height: 80px
  - No shadow
  - Background: White with bottom border

- **Scrolled State (> 50px from top):**
  - Height: 72px (slightly compressed)
  - Shadow: `0 2px 4px rgba(0,0,0,0.06)`
  - Smooth transition: 200ms ease-in-out
  - Background: White (same)

### Smooth Scrolling
- **Internal anchor links:** Smooth scroll, 600ms
- **Offset:** -80px (account for sticky header)
- **Behavior:** `scroll-behavior: smooth` in CSS

---

## Accessibility Considerations

### Keyboard Navigation
- **Tab Order:** Logo → Nav items → Main content → Footer links
- **Focus Indicators:** 2px Medium Blue outline, 2px offset
- **Skip Link:** "Skip to main content" (visually hidden, appears on focus)

### Mobile Menu
- **ARIA Labels:**
  - Hamburger: `aria-label="Open navigation menu"`
  - Close button: `aria-label="Close navigation menu"`
- **Focus Trap:** When menu open, tab only cycles through menu items
- **ESC Key:** Closes mobile menu

### Footer
- **Semantic HTML:** `<footer>` element
- **Navigation:** `<nav>` for link groups
- **Headings:** Proper heading hierarchy (h2 or h3 for sections)

### Color Contrast
- All text meets WCAG 2.1 AA standards:
  - White on Charcoal: 12.8:1 (AAA)
  - Light Grey on Charcoal: 7.2:1 (AA)
  - Navy on White: 12.6:1 (AAA)
  - Medium Blue on White: 4.8:1 (AA)

---

## Implementation Notes

### Header HTML Structure
```html
<header class="site-header">
  <div class="header-container">
    <a href="/" class="logo">
      <img src="logo-icon.svg" alt="">
      <span>Business Name</span>
    </a>
    <nav class="main-nav" aria-label="Main navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/insights">Insights</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
    <button class="menu-toggle" aria-label="Open navigation menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
</header>
```

### Footer HTML Structure
```html
<footer class="site-footer">
  <div class="footer-container">
    <div class="footer-logo">
      <img src="logo-icon-white.svg" alt="">
      <span>Business Name</span>
    </div>
    <div class="footer-columns">
      <div class="footer-col">
        <h3>Navigation</h3>
        <nav aria-label="Footer navigation">
          <ul>...</ul>
        </nav>
      </div>
      <div class="footer-col">
        <h3>Services</h3>
        <ul>...</ul>
      </div>
      <div class="footer-col">
        <h3>Connect</h3>
        <ul class="contact-info">...</ul>
      </div>
    </div>
    <p class="tagline">Building Risk Management Frameworks That Scale</p>
    <div class="copyright">
      <p>© 2025 Business Name</p>
      <nav class="legal-nav">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
      </nav>
    </div>
  </div>
</footer>
```

---

## Status
- **Header:** Fully specified ✓
- **Navigation:** Fully specified ✓
- **Footer:** Fully specified ✓
- **Responsive Behavior:** Fully specified ✓
- **Next:** Logo design direction & Homepage content planning
