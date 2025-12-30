# 03-tasks-landing-page.md

## Relevant Files

- `app/page.tsx` - Main landing page component that currently shows simple welcome card; will be updated with hero, program overview, and footer sections
- `app/layout.tsx` - Root layout with metadata; may need title/description updates for landing page SEO
- `app/globals.css` - Global styles with dark theme, barbell pattern, and reusable classes (`.card`, `.button`, etc.); will add new landing page specific classes
- `components/Header.tsx` - Existing header with logo and navigation (already implemented, no changes needed)
- `components/SignInButton.tsx` - Existing sign-in button component (already implemented, no changes needed)
- `app/auth.ts` - NextAuth configuration for authentication (already implemented, no changes needed for this feature)

### Notes

- No unit tests required for this feature as it's purely presentational content with existing auth logic
- The existing `getServerSession()` and redirect logic will remain unchanged
- All new CSS classes should follow kebab-case naming convention (e.g., `.landing-hero`, `.cycle-visual`)
- Use existing color palette: #000000 (background), #1a1a1a (cards), #ffffff (headlines), #b0b0b0 (body text)
- Mobile-first approach: Base styles for 320px+, `@media (min-width: 768px)` for tablet, `@media (min-width: 1024px)` for desktop
- External links must use `target="_blank"` and `rel="noopener noreferrer"` for security
- Test on actual mobile devices (iPhone, Android) in addition to browser DevTools responsive mode
- Follow the repository's TypeScript strict mode and Next.js App Router patterns

## Tasks

### [x] 1.0 Implement Hero Section with Core Messaging

#### 1.0 Proof Artifact(s)

- Screenshot: Desktop hero section (1024px+ width) showing headline "Built for lifters who want consistent, measurable strength gains", subheadline, and existing header with dumbbell logo demonstrates desktop layout
- Screenshot: Mobile hero section (375px width) showing readable text with proper spacing and hierarchy demonstrates mobile-first optimization
- Browser DevTools: Inspect hero text elements showing font-size meets minimum 16px for body text, 2rem+ for headline demonstrates accessibility compliance
- Screenshot: Full page view showing hero section with barbell background pattern demonstrates visual consistency with existing dark theme

#### 1.0 Tasks

- [x] 1.1 Update `app/layout.tsx` metadata to change title to "5/3/1 Workout Tracker" and description to relevant landing page description
- [x] 1.2 Add hero section CSS classes to `app/globals.css` with mobile-first responsive styles (`.landing-hero`, `.hero-content`, `.hero-headline`, `.hero-subheadline`)
- [x] 1.3 Update `app/page.tsx` to replace existing card content with new hero section structure (full-width section, centered content wrapper with max-width 800-1000px)
- [x] 1.4 Add headline text: "Built for lifters who want consistent, measurable strength gains" with h1 tag and mobile-first font sizing (2rem base, 2.5rem tablet, 3rem desktop)
- [x] 1.5 Add subheadline content (2-3 sentences) introducing 5/3/1 as proven strength program with simple, approachable tone
- [x] 1.6 Test hero section on mobile (375px width), tablet (768px), and desktop (1024px+) viewports to verify text readability and spacing
- [x] 1.7 Verify hero section shows barbell background pattern and maintains dark theme consistency
- [x] 1.8 Capture proof artifacts: desktop screenshot, mobile screenshot, DevTools font-size inspection

### [x] 2.0 Create Program Overview Section with 4-Week Cycle Visual

#### 2.0 Proof Artifact(s)

- Screenshot: Program overview section on desktop (1024px+ width) showing card layout with "start too light, progress slowly" philosophy and 4-week cycle visual demonstrates content structure
- Screenshot: Program overview on mobile (375px width) showing stacked, readable layout with visual diagram demonstrates responsive behavior
- Screenshot: Close-up of 4-week cycle visual showing Week 1 (5s), Week 2 (3s), Week 3 (5/3/1), Week 4 (Deload) demonstrates educational visual aid
- Browser DevTools: Inspect card element showing background color #1a1a1a, padding 3rem, matching existing `.card` styles demonstrates style consistency

#### 2.0 Tasks

- [x] 2.1 Add program overview CSS classes to `app/globals.css` (`.program-overview`, `.cycle-visual`, `.cycle-week`) with card-based layout and responsive grid
- [x] 2.2 Add program overview section to `app/page.tsx` after hero section using existing `.card` class for container
- [x] 2.3 Add section heading (h2) and brief introduction text emphasizing "start too light, progress slowly" core philosophy
- [x] 2.4 Create inline SVG for 4-week cycle visual showing: Week 1 (5s), Week 2 (3s), Week 3 (5/3/1), Week 4 (Deload) using horizontal timeline or 4-column grid layout
- [x] 2.5 Add 3-5 short paragraphs or bullet points explaining sustainable long-term strength gains (keep text minimal and scannable)
- [x] 2.6 Style SVG visual with monochromatic colors matching dark theme (white/gray strokes, appropriate opacity)
- [x] 2.7 Test program overview section on mobile (375px) to verify card stacks properly and visual remains clear
- [x] 2.8 Capture proof artifacts: desktop overview screenshot, mobile overview screenshot, close-up of cycle visual, DevTools card style inspection

### [x] 3.0 Add Attribution Footer with External Links

#### 3.0 Proof Artifact(s)

- Screenshot: Footer section on desktop showing Jim Wendler attribution with link, disclaimer text, "Learn more" link, and Buy Me a Coffee link demonstrates footer implementation
- Browser test: Click Jim Wendler link and verify jimwendler.com opens in new tab demonstrates proper link behavior with target="_blank"
- Browser test: Click Buy Me a Coffee link and verify https://buymeacoffee.com/joshuajohnn opens in new tab demonstrates support link functionality
- Screenshot: Mobile footer (375px width) showing readable text and properly stacked links demonstrates mobile responsiveness
- Browser DevTools: Inspect link elements showing rel="noopener noreferrer" attributes demonstrates security best practices

#### 3.0 Tasks

- [x] 3.1 Add footer CSS classes to `app/globals.css` (`.landing-footer`, `.footer-content`, `.footer-links`) with full-width layout, centered content, and slightly darker background
- [x] 3.2 Add footer section to `app/page.tsx` after program overview as HTML `<footer>` element
- [x] 3.3 Add Jim Wendler attribution text: "This app follows Jim Wendler's 5/3/1 methodology" with clickable link to jimwendler.com
- [x] 3.4 Add disclaimer text: "This tool is not affiliated with Jim Wendler or his brand. It's an independent project built by a lifter who loves the program."
- [x] 3.5 Add "Learn more about 5/3/1" link pointing to jimwendler.com for official details and merch
- [x] 3.6 Add "Buy Me a Coffee" link to <https://buymeacoffee.com/joshuajohnn> with appropriate styling
- [x] 3.7 Ensure all external links use `target="_blank"` and `rel="noopener noreferrer"` attributes for security
- [x] 3.8 Test footer on mobile (375px) to verify links stack properly and remain clickable
- [x] 3.9 Test all external links open in new tabs and navigate to correct URLs (jimwendler.com, Buy Me a Coffee)
- [x] 3.10 Capture proof artifacts: desktop footer screenshot, mobile footer screenshot, browser test of link behavior, DevTools rel attribute inspection

### [x] 4.0 Verify Authenticated User Auto-Redirect Behavior

#### 4.0 Proof Artifact(s)

- Browser test: Visit landing page (/) while logged out, see full landing page content (hero, overview, footer) demonstrates unauthenticated experience
- Browser test: Sign in via Google OAuth, then manually navigate to root URL (/), observe immediate redirect to /dashboard without seeing landing page demonstrates authenticated redirect
- Browser DevTools Network tab: Screenshot showing 307 redirect response when authenticated user visits / demonstrates server-side redirect
- Screenshot: Dashboard page after redirect showing user info demonstrates successful redirect target

#### 4.0 Tasks

- [x] 4.1 Verify existing `getServerSession()` and `redirect('/dashboard')` logic in `app/page.tsx` remains at top of component
- [x] 4.2 Test unauthenticated experience: Open browser in incognito/private mode, visit `/`, verify full landing page (hero + overview + footer) displays
- [x] 4.3 Test authenticated redirect: Sign in via Google OAuth, manually navigate to `/` root URL, verify immediate redirect to `/dashboard` without seeing landing page content
- [x] 4.4 Open Browser DevTools Network tab during authenticated redirect, verify 307 redirect response shows server-side redirect
- [x] 4.5 Verify dashboard page loads successfully after redirect and displays user information
- [x] 4.6 Test redirect behavior works correctly on both mobile and desktop viewports
- [x] 4.7 Capture proof artifacts: logged-out landing page screenshot, logged-in redirect test, Network tab 307 redirect screenshot, dashboard after redirect screenshot
