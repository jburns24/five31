# 02-spec-dark-mode-theme.md

## Introduction/Overview

This feature transforms the website from its current light theme with purple gradients to a true dark mode theme with a monochromatic color scheme. The redesign incorporates a barbell SVG pattern as a subtle background watermark and integrates the existing dumbbell favicon as the primary logo in the navigation header. The goal is to create a modern, fitness-focused aesthetic optimized for OLED screens while maintaining high readability and visual hierarchy.

## Goals

- Implement a complete dark mode theme with true black (#000000) background for optimal OLED display
- Integrate a tasteful barbell SVG pattern as a subtle, repeating background watermark across main content areas
- Replace the current purple gradient styling with a monochromatic color scheme featuring subtle accent colors
- Establish the dumbbell favicon as the primary brand logo in the top-left navigation position
- Ensure proper text contrast hierarchy with bright headers and softer body text for improved readability

## User Stories

- **As a fitness enthusiast visiting the site**, I want to see a dark, modern theme with fitness-related visual elements so that the brand identity feels cohesive and professional
- **As a user with an OLED device**, I want a true black background so that I benefit from better battery life and reduced eye strain in low-light conditions
- **As a returning user**, I want clear visual hierarchy and readability in dark mode so that I can easily navigate and read content without difficulty
- **As a mobile user**, I want the logo and branding to be immediately visible in the navigation so that I understand what site I'm on

## Demoable Units of Work

### Unit 1: Core Dark Mode Theme Implementation

**Purpose:** Establishes the foundational dark mode color palette and styling system that will be applied across all pages and components

**Functional Requirements:**
- The system shall replace the current light theme background with true black (#000000) for the body element
- The system shall update card/surface elements to use #1a1a1a or lighter (#2d2d2d) for a raised appearance against the black background
- The system shall implement variable text contrast where headers use bright white (#ffffff) and body text uses softer gray (#b0b0b0 to #cccccc)
- The system shall remove the existing purple gradient background (linear-gradient(135deg, #667eea 0%, #764ba2 100%))
- The system shall update button and interactive element styling to use monochromatic colors with one subtle accent color
- The system shall maintain proper WCAG AA contrast ratios for all text elements

**Proof Artifacts:**
- Screenshot: Home page showing black background, light gray cards, and proper text contrast hierarchy demonstrates core dark mode implementation
- Screenshot: Dashboard page showing consistent dark theme with user info card demonstrates styling applied across multiple pages
- Browser DevTools: Inspect elements showing computed color values match specification demonstrates correct CSS implementation

### Unit 2: Barbell SVG Background Pattern Integration

**Purpose:** Adds the signature barbell pattern as a subtle background element that reinforces the fitness brand identity without distracting from content

**Functional Requirements:**
- The system shall embed the barbell SVG pattern using CSS background-image with data URI format
- The system shall implement the pattern with the following specifications:
  - Pattern size: 220px × 220px
  - White stroke with 0.14 opacity
  - Barbell design featuring horizontal bar with outer small plates (10×32px) and inner large plates (12×44px)
  - Stroke width: 4px with round linecap and linejoin
- The system shall apply the pattern as a repeating tiled background on the body element
- The system shall ensure the pattern remains subtle and does not interfere with text readability
- The system shall position the pattern to tile seamlessly across all viewport sizes

**Proof Artifacts:**
- Screenshot: Full page view showing the subtle barbell pattern repeating across the background demonstrates pattern integration
- Browser zoom: Pattern at 200% zoom showing SVG clarity and proper tiling demonstrates SVG quality and repeat functionality
- Screenshot: Pattern visibility with content overlay demonstrates appropriate opacity and non-interference with readability

### Unit 3: Logo and Favicon Integration

**Purpose:** Establishes consistent branding by using the dumbbell favicon as both the browser tab icon and the main navigation logo

**Functional Requirements:**
- The system shall display the dumbbell favicon (public/favicon.png) in the browser tab
- The system shall add the dumbbell logo to the top-left corner of the navigation/header area
- The system shall size the navigation logo appropriately (recommended 32-48px height) for header visibility
- The system shall add proper alt text to the logo image for accessibility
- The system shall link the logo to the home page (/) following standard web conventions
- The system shall ensure the logo is visible against the dark background with proper contrast or styling

**Proof Artifacts:**
- Screenshot: Browser tab showing favicon demonstrates favicon configuration
- Screenshot: Navigation header showing dumbbell logo in top-left position demonstrates logo placement and sizing
- Screenshot: Logo hover state (if applicable) demonstrates interactive behavior
- Mobile screenshot: Logo on mobile viewport demonstrates responsive behavior

## Non-Goals (Out of Scope)

1. **Theme toggle or light mode support**: This implementation is an immediate full replacement of the light theme with dark mode. No toggle switch or dual-theme support will be added
2. **System preference detection**: The theme will not detect or respond to OS-level dark mode preferences (prefers-color-scheme media query)
3. **Animated transitions**: No animated transitions between theme states, color changes, or pattern effects
4. **Multiple logo variations**: Only the existing dumbbell favicon will be used; no new logo designs or variations will be created
5. **Custom scrollbar styling**: Browser default scrollbars will be maintained; no custom dark mode scrollbar design
6. **Accessibility testing beyond contrast ratios**: While proper contrast will be ensured, comprehensive accessibility audits (screen reader testing, keyboard navigation, etc.) are out of scope
7. **Performance optimization**: No specific performance tuning for the SVG pattern beyond standard implementation

## Design Considerations

**Color Palette:**
- Background: True black (#000000)
- Cards/Surfaces: Dark gray (#1a1a1a to #2d2d2d) - lighter than background for raised appearance
- Headers: Bright white (#ffffff)
- Body text: Soft gray (#b0b0b0 to #cccccc)
- Accent color: One subtle monochromatic accent (to be determined during implementation, suggest #404040 to #666666 range)
- Pattern: White (#ffffff) at 0.14 opacity

**Visual Hierarchy:**
- Use brightness to establish hierarchy: headers brightest, body text softer, de-emphasized text softest
- Cards should appear to float above the background through lighter coloring
- Maintain adequate spacing and use shadows sparingly (if at all) in dark mode

**Barbell Pattern Reference:**
The provided SVG pattern uses the following structure:
```
- Pattern size: 220×220px
- Horizontal bar: path from x=65 to x=155 at y=110
- Outer small plates: 10×32px rectangles at x=43 and x=167
- Inner large plates: 12×44px rectangles at x=53 and x=155
- Stroke: white, 4px width, 0.14 opacity, round caps/joins
```

**Logo Display:**
- Position: Top-left of header/navigation
- Size: 32-48px height (scale proportionally)
- Behavior: Clickable link to home page
- Styling: Ensure visibility against dark background (the dumbbell is black/dark, may need white border or background circle)

## Repository Standards

Based on analysis of the existing codebase:

**File Structure:**
- Global styles in `app/globals.css`
- Component-specific styles inline or in component files
- Next.js App Router structure (`app/` directory)

**Styling Approach:**
- Standard CSS (no Tailwind or CSS-in-JS framework)
- CSS classes follow kebab-case naming (`.user-info`, `.button-group`)
- Global styles defined for reusable classes (`.card`, `.button`, `.button-secondary`)

**Component Patterns:**
- TypeScript + React functional components
- Server-side rendering with `getServerSession()`
- Next.js Image component for optimized images

**Code Quality:**
- TypeScript for type safety
- ESLint for linting (Next.js config)
- Clean, readable code with proper indentation

**Implementation should follow:**
- Update `app/globals.css` for theme changes
- Maintain existing CSS class structure
- Use semantic HTML and proper accessibility attributes
- Test on both home page and dashboard routes

## Technical Considerations

**CSS Implementation:**
- Use CSS custom properties (CSS variables) for colors to enable easier future theming if needed
- Implement the barbell SVG as a data URI in CSS background-image property
- Ensure SVG is properly URL-encoded for cross-browser compatibility
- Consider fallback background color if SVG fails to load

**Image Handling:**
- The favicon is already at `public/favicon.png`
- Logo in navigation should use Next.js Image component for optimization
- Ensure proper image dimensions and alt text for accessibility

**Browser Compatibility:**
- Test SVG data URI support (widely supported in modern browsers)
- Verify OLED/true black displays properly on various devices
- Test contrast ratios in multiple browsers (Chrome, Firefox, Safari)

**File Changes Required:**
- `app/globals.css` - major updates to all color values, backgrounds, text colors
- `app/layout.tsx` - add logo to navigation/header structure, update metadata for favicon
- Potentially `next.config.js` - if any image configuration needed (likely not)

**Dependencies:**
- No new dependencies required
- Existing Next.js and React versions support all needed features

## Security Considerations

**No specific security considerations identified.** This is a purely visual/UI update with no authentication, data handling, or external API changes. The SVG is embedded as a data URI with no external resource loading.

## Success Metrics

1. **Visual Consistency**: All pages (home, dashboard) display cohesive dark theme with true black backgrounds and proper contrast
2. **Pattern Integration**: Barbell pattern is visible but subtle, maintaining readability across all content areas
3. **Brand Recognition**: Logo is prominently displayed and recognized as site branding in top-left navigation
4. **Readability Score**: Text maintains WCAG AA contrast ratio (minimum 4.5:1 for normal text, 3:1 for large text)
5. **User Feedback**: Positive subjective feedback on aesthetic appeal and readability from test users

## Open Questions

**No open questions at this time.** All design decisions have been clarified through the questions process. The specific accent color can be determined during implementation based on visual testing.
