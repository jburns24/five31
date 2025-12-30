# 04-tasks-mobile-nav-profile.md

## Relevant Files

- `components/MobileNav.tsx` - Mobile navigation overlay component with slide-in animation and context-aware menu items
- `components/HamburgerIcon.tsx` - Hamburger menu icon button component with toggle functionality
- `components/UserAvatar.tsx` - User avatar component with fallback to user initials in colored circle
- `components/Header.tsx` - Main header component (MODIFY: add navigation components)
- `components/SignInButton.tsx` - Sign in button component (MODIFY: update callback URL to /account)
- `app/account/page.tsx` - User profile page displaying account information with sign-out functionality
- `app/globals.css` - Global styles (MODIFY: add navigation and avatar styles)
- `app/auth.ts` - NextAuth configuration (MODIFY: update redirect to /account)
- `app/dashboard/page.tsx` - Deprecated dashboard page (DELETE)

### Notes

- This project does not currently have a testing infrastructure, so no test files are included
- Client-side interactive components must include `'use client'` directive
- Follow existing component patterns: PascalCase file names, kebab-case CSS classes
- Use Next.js `Image` component for profile pictures with appropriate sizing
- Maintain dark theme consistency (#000000 background, #1a1a1a cards, #ffffff text)
- Mobile-first CSS approach with `@media (min-width: 1024px)` for desktop breakpoint

## Tasks

### [x] 1.0 Implement Mobile Hamburger Menu Navigation

Create a mobile-first navigation system with a hamburger menu icon that slides in from the right, displaying context-aware navigation items based on authentication state.

#### 1.0 Proof Artifact(s)

- Screenshot: Hamburger menu icon visible in header on mobile viewport (< 1024px) demonstrates mobile-first approach
- Screenshot: Menu overlay open from right side with "Home" and "Sign In" items (unauthenticated) demonstrates unauthenticated state navigation
- Screenshot: Menu overlay open with "Home" and "Profile" items (authenticated) demonstrates authenticated state navigation
- Screenshot: Menu closed after clicking navigation item demonstrates auto-close behavior
- Screenshot: Menu closed after clicking outside overlay demonstrates outside-click close behavior

#### 1.0 Tasks

- [x] 1.1 Create `HamburgerIcon.tsx` component with three horizontal lines icon, click handler to toggle menu state, and hide at desktop breakpoint (≥1024px)
- [x] 1.2 Create `MobileNav.tsx` client component with state management for open/close, slide-in animation from right, full viewport overlay, and close button
- [x] 1.3 Add session-based navigation items to `MobileNav.tsx`: show "Home" and "Sign In" when unauthenticated, show "Home" and "Profile" when authenticated using `useSession` hook
- [x] 1.4 Implement auto-close behavior in `MobileNav.tsx`: close when clicking navigation items and close when clicking outside the menu using backdrop click handler
- [x] 1.5 Add mobile navigation CSS to `globals.css`: hamburger icon styles, slide-in overlay animation (300ms), navigation item styles with touch targets (min 44px height), and dark theme colors
- [x] 1.6 Update `Header.tsx` to include `HamburgerIcon` and `MobileNav` components, ensuring they only render on mobile viewports
- [x] 1.7 Test mobile navigation flow: verify hamburger icon appears on mobile, menu slides in from right, navigation items display correctly for both auth states, and menu closes on navigation click and outside click

### [x] 2.0 Implement Responsive Desktop Navigation

Add desktop horizontal navigation that appears at screen widths of 1024px and above, replacing the hamburger menu with a traditional navigation layout.

#### 2.0 Proof Artifact(s)

- Screenshot: Horizontal navigation visible in header at 1024px+ viewport demonstrates desktop layout
- Screenshot: No hamburger icon visible at desktop breakpoint demonstrates responsive hiding
- Screenshot: Desktop navigation with unauthenticated state showing "Home" and "Sign In" demonstrates unauthenticated rendering
- Screenshot: Desktop navigation with authenticated state showing "Home" and "Profile" demonstrates authenticated rendering

#### 2.0 Tasks

- [x] 2.1 Add desktop navigation section to `Header.tsx` that renders horizontally aligned navigation items using flexbox layout
- [x] 2.2 Implement session-based navigation items in desktop nav: display "Home" and "Sign In" for unauthenticated users, display "Home" and "Profile" for authenticated users using `getServerSession` server-side
- [x] 2.3 Add desktop navigation CSS to `globals.css` with `@media (min-width: 1024px)` query: horizontal layout styles, navigation item spacing, hover states, and hide mobile hamburger icon
- [x] 2.4 Add smooth transition styles in `globals.css` for switching between mobile and desktop layouts (300ms ease transition)
- [x] 2.5 Test responsive behavior: verify hamburger menu appears below 1024px, desktop navigation appears at 1024px and above, and navigation items display correctly for both auth states at desktop breakpoint

### [~] 3.0 Create User Profile Page at /account

Build a protected profile page that displays user information (name, email, profile picture, account creation date) with sign-out functionality and fallback avatar using user initials.

#### 3.0 Proof Artifact(s)

- Screenshot: `/account` page showing user name, email, profile picture, creation date, and sign out button demonstrates complete profile display
- Screenshot: Profile page with user initials displayed (for account without Google profile picture) demonstrates fallback avatar handling
- URL: `http://localhost:3000/account` accessible when authenticated demonstrates protected route
- Screenshot: Redirect to home page when accessing `/account` unauthenticated demonstrates route protection
- Screenshot: Redirect to home page after clicking sign out demonstrates sign-out flow

#### 3.0 Tasks

- [x] 3.1 Create `app/account/page.tsx` as a server component that uses `getServerSession` to check authentication status and redirects unauthenticated users to home page
- [x] 3.2 Query MongoDB in `page.tsx` to fetch user data (name, email, image, createdAt) using the existing User model and session email
- [x] 3.3 Create `UserAvatar.tsx` component that displays profile picture if available, or generates user initials in a colored circle if image is null/empty
- [x] 3.4 Implement deterministic color scheme in `UserAvatar.tsx` for initials background (use name hash to select from predefined color palette)
- [x] 3.5 Build profile page layout in `page.tsx` using existing card-based pattern: display UserAvatar (80px diameter), user name, email, formatted account creation date, and SignOutButton
- [x] 3.6 Add profile page specific CSS to `globals.css`: avatar styles for initials display, profile card layout, and information row formatting
- [x] 3.7 Format the createdAt date for display using JavaScript Date methods (e.g., "Member since December 2025")
- [x] 3.8 Test profile page: verify page accessible when authenticated at `/account`, displays all user information correctly, shows initials fallback when no image, and redirects unauthenticated users to home

### [ ] 4.0 Update Authentication Flow and Remove Dashboard

Update authentication redirect flow to navigate users to `/account` instead of `/dashboard`, and remove the deprecated dashboard page.

#### 4.0 Proof Artifact(s)

- Screenshot: User lands on `/account` after signing in from hamburger menu demonstrates updated redirect flow
- Screenshot: User lands on `/account` after signing in from desktop navigation demonstrates consistent redirect behavior
- File verification: `/app/dashboard/page.tsx` deleted demonstrates cleanup completion
- Test: Sign in from unauthenticated state navigates to profile page demonstrates end-to-end flow

#### 4.0 Tasks

- [ ] 4.1 Update `components/SignInButton.tsx` to change callbackUrl from '/dashboard' to '/account'
- [ ] 4.2 Update `app/auth.ts` authOptions configuration to set default signIn redirect to '/account' in pages configuration
- [ ] 4.3 Delete `app/dashboard/page.tsx` file completely
- [ ] 4.4 Test complete authentication flow: sign in from mobile hamburger menu and verify redirect to `/account`, sign in from desktop navigation and verify redirect to `/account`, and confirm dashboard route no longer exists
