# 04-spec-mobile-nav-profile.md

## Introduction/Overview

This feature adds mobile-first navigation with a hamburger menu and user profile functionality to the 5/3/1 Workout Tracker application. Users will access navigation options through a hamburger menu icon that displays context-aware navigation items (Home and Sign In for unauthenticated users; Home and Profile for authenticated users). The hamburger menu slides in from the right side of the viewport and closes automatically when clicking navigation items or outside the menu. At desktop screen sizes (1024px and above), the navigation transitions to a traditional horizontal layout. After signing in, users are redirected to a new profile page at `/account` that displays their information (name, email, profile picture, account creation date) and provides a sign-out option.

## Goals

- Implement a mobile-first navigation pattern with a hamburger menu icon in the header
- Provide context-aware navigation items based on authentication state (unauthenticated: Home/Sign In; authenticated: Home/Profile)
- Create a responsive navigation that transitions from hamburger menu to horizontal navigation at 1024px breakpoint
- Build a user profile page at `/account` displaying user information with sign-out capability
- Maintain consistent dark theme styling and follow existing component patterns
- Clean up the existing `/dashboard` page as it will be replaced by `/account`

## User Stories

**As a mobile user**, I want to access navigation options through a hamburger menu icon so that I can navigate the app without cluttering the interface on small screens.

**As an unauthenticated user**, I want to see Home and Sign In options in the navigation menu so that I can easily access the authentication flow.

**As an authenticated user**, I want to see Home and Profile options in the navigation menu so that I can quickly access my account information.

**As a desktop user**, I want the navigation to display horizontally at larger screen sizes so that I have a more traditional desktop browsing experience.

**As an authenticated user**, I want to view my profile information (name, email, profile picture, account creation date) so that I can verify my account details.

**As an authenticated user**, I want to sign out from my profile page so that I can securely end my session.

## Demoable Units of Work

### Unit 1: Hamburger Menu Navigation Component

**Purpose:** Enable mobile-first navigation with a hamburger icon that reveals context-aware navigation items, serving both authenticated and unauthenticated users with appropriate menu options.

**Functional Requirements:**
- The system shall display a hamburger menu icon in the header on all screen sizes below 1024px
- The system shall render a slide-in overlay from the right side covering the entire viewport when the hamburger icon is clicked
- The system shall display "Home" and "Sign In" navigation items when the user is not authenticated
- The system shall display "Home" and "Profile" navigation items when the user is authenticated
- The system shall close the menu automatically when a user clicks any navigation item
- The system shall close the menu automatically when a user clicks outside the menu overlay
- The system shall provide visual feedback (hover states, active states) for all interactive elements
- The user shall be able to toggle the menu open and closed by clicking the hamburger icon

**Proof Artifacts:**
- Screenshot: Hamburger menu icon visible in header on mobile viewport (< 1024px) demonstrates mobile-first approach
- Screenshot: Menu overlay open from right side with "Home" and "Sign In" items demonstrates unauthenticated state navigation
- Screenshot: Menu overlay open with "Home" and "Profile" items demonstrates authenticated state navigation
- Screenshot: Menu closed after clicking navigation item demonstrates auto-close behavior

### Unit 2: Responsive Desktop Navigation

**Purpose:** Provide a traditional horizontal navigation layout for desktop users at screen widths of 1024px and above, eliminating the hamburger menu on larger screens.

**Functional Requirements:**
- The system shall hide the hamburger menu icon at screen widths of 1024px and above
- The system shall display navigation items horizontally in the header at screen widths of 1024px and above
- The system shall show "Home" and "Sign In" items for unauthenticated users in desktop navigation
- The system shall show "Home" and "Profile" items for authenticated users in desktop navigation
- The system shall maintain consistent styling with the existing dark theme
- The system shall use smooth transitions when switching between mobile and desktop layouts

**Proof Artifacts:**
- Screenshot: Horizontal navigation visible in header at 1024px+ viewport demonstrates desktop layout
- Screenshot: No hamburger icon visible at desktop breakpoint demonstrates responsive hiding
- Screenshot: Desktop navigation with authenticated state showing "Home" and "Profile" demonstrates state-aware rendering

### Unit 3: User Profile Page

**Purpose:** Display comprehensive user account information and provide sign-out functionality, serving as the primary account management interface for authenticated users.

**Functional Requirements:**
- The system shall create a new profile page at the `/account` route
- The system shall protect the `/account` route requiring authentication to access
- The system shall redirect unauthenticated users attempting to access `/account` to the home page
- The system shall display the user's name, email, profile picture, and account creation date
- The system shall display user initials in a colored circle if no profile picture is available from Google OAuth
- The system shall include a functional sign-out button that terminates the user session
- The system shall redirect users to the home page after signing out
- The user shall see their information displayed in a clean, readable format following the existing card-based layout pattern

**Proof Artifacts:**
- Screenshot: `/account` page showing user name, email, profile picture, creation date, and sign out button demonstrates complete profile display
- Screenshot: Profile page with user initials displayed (for account without Google profile picture) demonstrates fallback avatar handling
- URL: `http://localhost:3000/account` accessible when authenticated demonstrates protected route
- Screenshot: Redirect to home page after sign out demonstrates sign-out flow

### Unit 4: Authentication Flow Updates and Dashboard Cleanup

**Purpose:** Update the authentication redirect flow to navigate users to the profile page after sign-in and remove the deprecated dashboard page.

**Functional Requirements:**
- The system shall redirect users to `/account` after successful Google OAuth sign-in
- The system shall update the SignInButton component to use `/account` as the callback URL instead of `/dashboard`
- The system shall remove the existing `/dashboard` page and route
- The system shall maintain backward compatibility for any existing authentication sessions
- The user shall be redirected to `/account` immediately after completing Google sign-in

**Proof Artifacts:**
- Screenshot: User lands on `/account` after signing in demonstrates updated redirect flow
- File verification: `/app/dashboard/page.tsx` deleted demonstrates cleanup completion
- Test: Sign in from hamburger menu navigates to profile page demonstrates end-to-end flow

## Non-Goals (Out of Scope)

1. **Profile editing functionality**: Users cannot edit their name, email, or profile picture in this iteration
2. **Additional profile information**: No workout statistics, preferences, or settings beyond basic account information
3. **Account deletion or deactivation**: No self-service account management beyond sign-out
4. **Navigation to workout-related pages**: This spec focuses on account navigation only; workout tracking navigation is out of scope
5. **Tablet-specific navigation layout**: Only mobile (< 1024px) and desktop (≥ 1024px) breakpoints are considered
6. **Accessibility enhancements**: While basic accessibility should be maintained, ARIA attributes and keyboard navigation enhancements are not required in this iteration
7. **Animation complexity**: Simple slide-in transitions are sufficient; complex animations or transitions are out of scope

## Design Considerations

**Visual Design:**
- Hamburger menu icon: Three horizontal lines (standard hamburger icon), positioned in top-right of header
- Menu overlay: Full viewport height, slides in from right, dark background (#1a1a1a) with slight transparency or blur effect
- Navigation items: Large touch targets (minimum 44px height), clear spacing, white text with hover state
- Desktop navigation: Horizontal layout in header, consistent with existing Header component styling
- Profile page: Card-based layout matching existing patterns, user avatar at top (80px diameter), information displayed in clean rows
- Avatar fallback: Initials in colored circle using a deterministic color scheme based on user name

**User Experience:**
- Menu animations should be smooth (300ms duration recommended)
- Close button (X) should be visible in top-right of menu overlay
- Outside click to close should use a semi-transparent backdrop
- Desktop navigation should appear seamlessly at 1024px breakpoint without page reload
- Profile page should be server-side rendered for performance

## Repository Standards

**Component Patterns:**
- Use PascalCase for component file names (e.g., `HamburgerMenu.tsx`, `MobileNav.tsx`)
- Client-side interactive components must include `'use client'` directive
- Follow existing component structure in `/components` directory
- Server components should be the default; use client components only when necessary (e.g., menu toggle state)

**Styling Conventions:**
- Use kebab-case for CSS class names (e.g., `mobile-nav`, `nav-overlay`, `user-avatar`)
- Maintain dark theme consistency (#000000 background, #1a1a1a cards, #ffffff text)
- Follow existing CSS patterns in `globals.css`
- Use responsive design with mobile-first approach
- Media queries should use `min-width` for desktop breakpoints

**Code Organization:**
- Place navigation components in `/components` directory
- Create profile page in `/app/account/page.tsx`
- Update existing components (`Header.tsx`, `SignInButton.tsx`) rather than replacing them
- Remove deprecated `/app/dashboard` directory after implementing `/account`

**TypeScript Standards:**
- Maintain strict TypeScript typing for all components
- Use Next.js types (e.g., `Metadata`, `ServerSession`)
- Define prop interfaces for all components

## Technical Considerations

**Authentication Integration:**
- Use `getServerSession` from `next-auth` for server-side session checking on profile page
- Update `authOptions` callback URL configuration to redirect to `/account` instead of `/dashboard`
- Leverage existing NextAuth.js setup; no changes to auth provider configuration needed

**State Management:**
- Menu open/close state should be managed in a client component using React `useState`
- Authentication state is managed by NextAuth.js session
- No additional state management libraries required

**Database Queries:**
- Profile page will need to fetch user data from MongoDB using existing `User` model
- Query should include: `name`, `email`, `image`, `createdAt` fields
- Use existing MongoDB connection utility (`lib/mongodb.ts`)

**Responsive Breakpoints:**
- Mobile: < 1024px (hamburger menu)
- Desktop: ≥ 1024px (horizontal navigation)
- Use CSS media query: `@media (min-width: 1024px)`

**Dependencies:**
- No new npm packages required
- Leverage existing Next.js, React, NextAuth.js, and Mongoose stack

**Performance:**
- Profile page should use server-side rendering (SSR) for optimal performance
- Navigation components should be code-split appropriately by Next.js automatic code splitting
- Avatar images should use Next.js `Image` component with appropriate sizing

## Security Considerations

**Authentication Protection:**
- Profile page (`/account`) must be protected with server-side session validation
- Unauthenticated access attempts should redirect to home page
- Session validation should occur on every profile page request

**Data Privacy:**
- User email addresses displayed on profile page are sensitive; ensure proper session-based access control
- Profile pictures from Google OAuth are already public URLs; no additional protection needed
- Account creation dates are not sensitive but should only be visible to the account owner

**Proof Artifact Security:**
- Screenshots for proofs should NOT include real user email addresses; use test accounts
- Blur or redact any sensitive information in proof screenshots if necessary
- Do not commit screenshots containing real user data to version control

**API Keys and Credentials:**
- No new API keys or credentials required for this feature
- Existing Google OAuth credentials continue to be used; ensure they remain in `.env` and not committed

## Success Metrics

1. **Navigation accessibility**: Users can access navigation on mobile devices (< 1024px) via hamburger menu with 0 navigation errors
2. **Profile page adoption**: 100% of authenticated users can access and view their profile at `/account`
3. **Responsive functionality**: Navigation correctly transitions between mobile and desktop layouts at 1024px breakpoint with no visual bugs
4. **Sign-out success rate**: Sign-out button successfully terminates sessions and redirects to home page with 100% success rate
5. **Dashboard migration**: `/dashboard` route is fully removed and all authentication flows redirect to `/account` instead

## Open Questions

No open questions at this time.
