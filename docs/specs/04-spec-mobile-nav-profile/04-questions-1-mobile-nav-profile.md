# 04 Questions Round 1 - Mobile Nav Profile

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. Hamburger Menu Behavior

When the user clicks the hamburger menu icon, how should the navigation menu appear?

- [x] (A) Slide-in overlay from the right side covering the entire viewport
- [ ] (B) Slide-in overlay from the left side covering the entire viewport
- [ ] (C) Dropdown menu below the header (pushes content down)
- [ ] (D) Full-screen overlay menu that covers everything including header
- [ ] (E) Other (describe)

## 2. Navigation Menu Items - Unauthenticated State

When a user is NOT signed in, what navigation items should appear in the hamburger menu?

- [x] (A) Home, Sign In
- [ ] (B) Home, About, Sign In
- [ ] (C) Home, Program Info, Sign In
- [ ] (D) Just Sign In (no other items)
- [ ] (E) Other (describe)

## 3. Navigation Menu Items - Authenticated State

When a user IS signed in, what navigation items should appear in the hamburger menu?

- [x] (A) Home, Profile
- [ ] (B) Home, Dashboard, Profile
- [ ] (C) Home, Workouts, Profile
- [ ] (D) Home, Dashboard, Workouts, Profile
- [ ] (E) Other (describe)

## 4. Profile Page Information Display

What user information should be displayed on the profile page?

- [x] (A) Name, email, profile picture, account created date, sign out button
- [ ] (B) Name, profile picture, account created date, sign out button (no email)
- [ ] (C) Just the items you mentioned: name, account created at, profile picture, sign out
- [ ] (D) All of the above plus additional fields like "last login" or "total workouts"
- [ ] (E) Other (describe)

## 5. Profile Picture Handling

If a user doesn't have a profile picture from Google, what should be displayed?

- [ ] (A) Generic avatar placeholder icon
- [x] (B) User's initials in a colored circle
- [ ] (C) Default silhouette image
- [ ] (D) Nothing (hide the image area entirely)
- [ ] (E) Other (describe)

## 6. Desktop Breakpoint Behavior

At what screen width should the hamburger menu be replaced with a traditional horizontal navigation?

- [ ] (A) Keep hamburger menu on all screen sizes (mobile-only approach)
- [ ] (B) Switch to horizontal nav at 768px (tablet and up)
- [x] (C) Switch to horizontal nav at 1024px (desktop and up)
- [ ] (D) Switch to horizontal nav at 640px (small tablet and up)
- [ ] (E) Other (describe)

## 7. Sign In Flow - After Authentication

After a user successfully signs in from the hamburger menu, where should they be redirected?

- [x] (A) Profile page (as you mentioned in the request), lets clean up the dashboard page
- [ ] (B) Dashboard page (where the existing SignInButton redirects)
- [ ] (C) Stay on the same page they were on (no redirect)
- [ ] (D) Different redirect based on whether they're new or returning user
- [ ] (E) Other (describe)

## 8. Menu Close Behavior

How should the hamburger menu close after a user interacts with it?

- [ ] (A) Automatically close when clicking any navigation item
- [ ] (B) Automatically close when clicking outside the menu
- [ ] (C) Require clicking the hamburger icon again or an X button to close
- [x] (D) Both A and B (auto-close on navigation OR outside click)
- [ ] (E) Other (describe)

## 9. Proof Artifacts

What would best demonstrate this feature is working correctly?

- [ ] (A) Screenshots of hamburger menu (closed), menu (open), and profile page
- [ ] (B) Video recording showing the full user flow
- [x] (C) Screenshots at different breakpoints showing responsive behavior
- [ ] (D) All of the above
- [ ] (E) Other (describe)

## 10. Profile Page Route

What should the URL path be for the profile page?

- [ ] (A) `/profile`
- [x] (B) `/account`
- [ ] (C) `/user/profile`
- [ ] (D) `/settings` or `/account/settings`
- [ ] (E) Other (describe)
