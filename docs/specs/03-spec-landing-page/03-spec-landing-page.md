# 03-spec-landing-page.md

## Introduction/Overview

This feature creates a comprehensive landing page for the five31.theshire.club workout tracking app. The landing page serves as the primary entry point for new visitors who may have never heard of Jim Wendler's 5/3/1 strength training program. The page will educate visitors about the program's core philosophy while positioning the app as a simple, independent tool built by a lifter who loves the methodology. The design maintains the existing dark mode aesthetic with mobile-first responsive layout.

## Goals

- Create an educational landing page that explains the 5/3/1 program to complete beginners in simple, approachable terms
- Position the app as "built for lifters who want consistent, measurable strength gains" with a focus on sustainable long-term progress
- Emphasize the core philosophy of "start too light, progress slowly" through concise content and visual elements
- Maintain transparent attribution to Jim Wendler with links to official resources (jimwendler.com) and clear disclaimer of non-affiliation
- Implement mobile-first responsive design that follows the existing dark mode theme and barbell pattern aesthetic
- Provide low-pressure conversion path (sign-in available in header) while letting the content quality drive user interest

## User Stories

- **As a lifter who has never heard of 5/3/1**, I want to understand what the program is and why it works so that I can decide if it's right for my training goals
- **As a mobile user researching workout programs**, I want a fast, readable landing page optimized for my phone so that I can learn about 5/3/1 on the go
- **As a visitor interested in the program**, I want to see clear attribution and links to official Jim Wendler resources so that I can learn more and support the original creator
- **As someone skeptical of fitness apps**, I want to see an honest disclaimer about the app being an independent tool so that I understand this is built by a fan, not a commercial product
- **As a user who has already signed in**, I want to be automatically redirected to my dashboard so that I don't have to click through the landing page unnecessarily

## Demoable Units of Work

### Unit 1: Hero Section with Core Messaging

**Purpose:** Creates the first impression and communicates the value proposition to visitors landing on the page for the first time

**Functional Requirements:**
- The system shall display a full-width hero section at the top of the landing page with the existing dark background and barbell pattern
- The system shall display the primary headline "Built for lifters who want consistent, measurable strength gains" (or similar approved variation)
- The system shall include a concise subheadline (2-3 sentences) introducing 5/3/1 as a proven strength program
- The system shall maintain the existing header with dumbbell logo and sign-in button (no additional CTA in hero)
- The hero section shall be optimized for mobile viewport with readable text sizing (minimum 16px body text, larger for headlines)
- The system shall use the existing dark theme color palette (true black background, white/gray text hierarchy)

**Proof Artifacts:**
- Screenshot: Desktop hero section showing headline, subheadline, and header with logo demonstrates desktop layout
- Screenshot: Mobile hero section (375px width) showing readable text and proper spacing demonstrates mobile-first optimization
- Browser DevTools: Inspect text elements showing font sizes meet mobile-first minimum demonstrates accessibility compliance

### Unit 2: Program Overview with Visual Elements

**Purpose:** Educates complete beginners about what 5/3/1 is through brief explanation and visual/diagram approach

**Functional Requirements:**
- The system shall display a program overview section using the card-based layout pattern (matching existing `.card` styles)
- The system shall present the core philosophy "start too light, progress slowly" prominently in this section
- The system shall include a visual representation or diagram showing the 4-week cycle concept (Week 1: 5s, Week 2: 3s, Week 3: 5/3/1, Week 4: Deload)
- The system shall keep text explanation brief (3-5 short paragraphs or bullet points maximum)
- The system shall emphasize sustainable long-term strength gains over quick results
- The section shall be responsive and stack appropriately on mobile devices

**Proof Artifacts:**
- Screenshot: Program overview section on desktop showing card layout and visual elements demonstrates content structure
- Screenshot: Program overview on mobile showing stacked, readable layout demonstrates responsive behavior
- Screenshot: Visual/diagram showing 4-week cycle demonstrates educational visual aid

### Unit 3: Attribution, Links, and Footer

**Purpose:** Provides transparent attribution to Jim Wendler, links to external resources, and includes disclaimer about non-affiliation

**Functional Requirements:**
- The system shall display a footer section at the bottom of the landing page
- The system shall include clear statement: "This app follows Jim Wendler's 5/3/1 methodology" with a clickable link to jimwendler.com
- The system shall display disclaimer text: "This tool is not affiliated with Jim Wendler or his brand. It's an independent project built by a lifter who loves the program."
- The system shall include a "Buy Me a Coffee" link to https://buymeacoffee.com/joshuajohnn with appropriate styling
- The system shall include a "Learn more about 5/3/1" or similar link pointing to jimwendler.com (official details and merch)
- The system shall maintain dark theme styling in footer with proper text contrast
- All external links shall open in new tabs (target="_blank" with rel="noopener noreferrer")

**Proof Artifacts:**
- Screenshot: Footer section showing all attribution, disclaimer, and external links demonstrates footer implementation
- Browser: Clicking Jim Wendler link opens jimwendler.com in new tab demonstrates proper link behavior
- Browser: Clicking Buy Me a Coffee link opens https://buymeacoffee.com/joshuajohnn in new tab demonstrates support link functionality
- Screenshot: Mobile footer showing readable text and properly stacked links demonstrates mobile responsiveness

### Unit 4: Authenticated User Auto-Redirect

**Purpose:** Ensures logged-in users are automatically redirected to dashboard when visiting the landing page URL, maintaining current behavior

**Functional Requirements:**
- The system shall check authentication status on landing page load using `getServerSession()`
- The system shall redirect authenticated users to `/dashboard` immediately (no landing page content shown)
- The system shall maintain the existing redirect logic (same as current `app/page.tsx` behavior)
- The system shall only display landing page content to unauthenticated (logged-out) visitors
- The redirect shall occur server-side before page render for optimal performance

**Proof Artifacts:**
- Browser test: Visit landing page while logged out shows full landing page content demonstrates unauthenticated experience
- Browser test: Sign in, then visit landing page root URL (`/`) results in immediate redirect to `/dashboard` demonstrates authenticated redirect
- Browser DevTools Network tab: Shows 307 redirect response when authenticated demonstrates server-side redirect

## Non-Goals (Out of Scope)

1. **Detailed program guide**: This is not a comprehensive tutorial on how to run 5/3/1 (no training max calculations, percentage tables, or detailed accessory work explanations on landing page)
2. **Workout tracking demo**: No interactive preview or demo of the actual workout tracking functionality
3. **User testimonials or reviews**: No social proof elements, user counts, or testimonial sections
4. **Email capture or newsletter signup**: No lead generation forms or email list building
5. **Multiple page variants**: No A/B testing, alternate hero messages, or content experiments
6. **Video content**: No embedded videos, workout demonstrations, or animated explainers
7. **Blog or content section**: No articles, guides, or additional educational content pages
8. **Custom illustrations**: Use existing dumbbell logo and barbell pattern; no new custom artwork or icons
9. **Pricing or premium features**: No mention of paid tiers, subscriptions, or feature comparisons (app is free)
10. **Multi-language support**: English only for initial implementation

## Design Considerations

**Layout Structure:**
- **Hero Section**: Full-width with centered content, maximum content width 800-1000px
- **Program Overview**: Card-based layout (use existing `.card` class) with centered alignment
- **Footer**: Full-width with centered content, slightly darker background than body for visual separation

**Visual Hierarchy:**
- Headlines: Bright white (#ffffff), 2rem-3rem on mobile, larger on desktop
- Body text: Soft gray (#b0b0b0), 1rem (16px minimum) for readability
- Card backgrounds: #1a1a1a (existing pattern)
- Visual/diagram: Use monochromatic colors, consider white stroke graphics similar to barbell pattern

**Mobile-First Breakpoints:**
- Mobile: 320px-767px (primary optimization target)
- Tablet: 768px-1023px
- Desktop: 1024px+
- Use responsive padding (1rem mobile, 2rem tablet, 3rem desktop)

**Typography:**
- Maintain existing font stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', etc.
- Ensure minimum 16px body text on mobile for readability
- Line-height 1.6 for body text (existing standard)

**4-Week Cycle Visual:**
- Consider simple horizontal bar/timeline showing 4 weeks
- Or 4-column grid with week names and rep schemes
- Keep it simple: Week 1 (5s) → Week 2 (3s) → Week 3 (5/3/1) → Week 4 (Deload)
- Use existing color palette (white/gray on dark)

**Spacing and Padding:**
- Mobile: 1.5rem-2rem vertical spacing between sections
- Desktop: 3rem-4rem vertical spacing between sections
- Maintain existing card padding (3rem as per current `.card` style)

## Repository Standards

Based on existing codebase patterns:

**File Structure:**
- Update `app/page.tsx` for landing page content (currently redirects to dashboard for authenticated users only)
- Update `app/globals.css` if new reusable classes are needed (prefer using existing classes)
- No new components required (use existing Header, SignInButton)

**Code Patterns:**
- TypeScript + React functional components with async server components
- Server-side rendering with `getServerSession(authOptions)` for auth checks
- Standard JSX with semantic HTML5 elements (main, section, footer, etc.)
- External links use `target="_blank"` and `rel="noopener noreferrer"`

**Styling Approach:**
- Use existing global CSS classes (`.card`, `.button`, `.header`, etc.)
- Add new classes to `globals.css` only if reusable
- Follow kebab-case naming convention (`.landing-hero`, `.program-overview`, etc.)
- Maintain existing dark theme color variables

**Content Formatting:**
- Keep text concise and scannable
- Use semantic heading hierarchy (h1 for hero, h2 for sections, h3 for subsections)
- Maintain "simple and approachable" tone per user preference
- Links styled consistently with existing `.button` or underlined text styles

## Technical Considerations

**Authentication Flow:**
- Maintain existing `getServerSession()` check at top of page component
- Early return with `redirect('/dashboard')` for authenticated users
- Landing page JSX only renders for unauthenticated visitors

**Performance:**
- No new dependencies required (React, Next.js handle all needs)
- Inline SVG for 4-week cycle visual (no additional image requests)
- Existing barbell pattern already optimized as data URI in CSS
- Page should load in under 2 seconds on 3G connection

**External Links:**
- jimwendler.com - official 5/3/1 information and merchandise
- https://buymeacoffee.com/joshuajohnn - creator support link
- Ensure all external links are tested and valid

**Responsive Implementation:**
- CSS Grid or Flexbox for layout (both well-supported)
- Mobile-first media queries: `@media (min-width: 768px)` for tablet, `@media (min-width: 1024px)` for desktop
- Test on actual mobile devices, not just browser DevTools

**Content Management:**
- All content hardcoded in JSX (no CMS or external data source)
- Text content should be easily editable for future refinements
- Consider extracting long text to constants at top of file for easier editing

**Browser Compatibility:**
- Target modern browsers (Chrome, Firefox, Safari, Edge latest 2 versions)
- No IE11 support required (Next.js 14 doesn't support it)
- Test SVG rendering across browsers

## Security Considerations

**External Link Security:**
- All external links must use `rel="noopener noreferrer"` to prevent window.opener exploits
- Verify external URLs (jimwendler.com, buymeacoffee.com) are correct and use HTTPS

**No user input:** Landing page is static content with no forms or user-submitted data, minimal security concerns

**Authentication:** Uses existing NextAuth.js session handling, no new auth code required

## Success Metrics

1. **Content Clarity**: Landing page clearly explains 5/3/1 to someone unfamiliar with the program (subjective review by test users)
2. **Mobile Performance**: Page loads and renders correctly on mobile devices (375px-428px width) with readable text and proper spacing
3. **Redirect Functionality**: Authenticated users are automatically redirected to dashboard without seeing landing page
4. **Link Functionality**: All external links (jimwendler.com, Buy Me a Coffee) open in new tabs and navigate correctly
5. **Visual Consistency**: Landing page maintains dark theme, barbell pattern, and design consistency with existing site
6. **Accessibility**: Text contrast meets WCAG AA standards, semantic HTML structure supports screen readers

## Open Questions

**No open questions at this time.** All design decisions have been clarified:
- Content depth: Overview + visuals, link out for full details
- Visual for 4-week cycle: Simple diagram/timeline to be designed during implementation
- Exact wording: "Simple and approachable" tone with core philosophy emphasis, final copy can be refined during implementation review
