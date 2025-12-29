# 02-tasks-dark-mode-theme.md

## Relevant Files

- `app/globals.css` - Global stylesheet containing all color definitions, backgrounds, card styling, button styling, and text colors that need dark mode updates
- `app/layout.tsx` - Root layout component where favicon metadata will be configured and navigation header will be added
- `public/favicon.png` - Existing dumbbell favicon image (already present, no modification needed)
- `components/Header.tsx` - New component to be created for navigation header with logo
- `app/page.tsx` - Home page that uses card styling (no direct changes needed, inherits from globals.css)
- `app/dashboard/page.tsx` - Dashboard page with user-info card (no direct changes needed, inherits from globals.css)

### Notes

- No unit tests are required for this feature as it's purely visual/CSS changes with no business logic
- Follow the repository's existing CSS class naming convention (kebab-case: `.user-info`, `.button-group`)
- Use Next.js Image component for the logo to follow existing patterns (see dashboard/page.tsx for reference)
- Test visual changes by running `npm run dev` and viewing http://localhost:3000 and http://localhost:3000/dashboard
- Verify responsive behavior at mobile viewport widths (375px, 768px)
- Use browser DevTools to inspect computed color values and verify contrast ratios

## Tasks

### [x] 1.0 Implement Core Dark Mode Theme with Color Palette

#### 1.0 Proof Artifact(s)

- Screenshot: Home page (http://localhost:3000/) showing true black background, dark gray card with raised appearance, and variable text contrast (bright white h1, softer gray p text) demonstrates core dark mode implementation
- Screenshot: Dashboard page (http://localhost:3000/dashboard) showing consistent dark theme with user info card on dark background demonstrates styling applied across multiple pages
- Screenshot: Browser DevTools inspection of body element showing `background-color: rgb(0, 0, 0)` and card showing `background: #1a1a1a` demonstrates correct CSS color values

#### 1.0 Tasks

- [x] 1.1 Update body element styling in `app/globals.css` to replace the purple gradient background with true black (#000000) and ensure min-height: 100vh is maintained
- [x] 1.2 Update `.card` class in `app/globals.css` to change background from white to dark gray (#1a1a1a) and update box-shadow for dark mode (use rgba(255, 255, 255, 0.05) for subtle elevation)
- [x] 1.3 Update `.card h1` styling to change color from #333 to bright white (#ffffff) for header text
- [x] 1.4 Update `.card p` styling to change color from #666 to soft gray (#b0b0b0) for body text, maintaining line-height: 1.6
- [x] 1.5 Update `.button` class to use monochromatic colors: background #404040, hover state #505050, maintaining white text color
- [x] 1.6 Update `.button-secondary` class to use dark mode appropriate colors: background #2d2d2d, hover state #3d3d3d
- [x] 1.7 Update `.user-info` background from #f7fafc to #2d2d2d (lighter than card for subtle distinction)
- [x] 1.8 Update `.user-details h2` color from #333 to white (#ffffff) and `.user-details p` color from #718096 to soft gray (#a0a0a0)
- [x] 1.9 Test visual changes by running `npm run dev`, view home page and dashboard, verify all colors match specification using browser DevTools color picker

### [~] 2.0 Integrate Barbell SVG Background Pattern

#### 2.0 Proof Artifact(s)

- Screenshot: Home page full view showing subtle barbell pattern repeating seamlessly across true black background demonstrates pattern integration and tiling
- Screenshot: Browser zoom at 200% showing crisp SVG barbell pattern with visible plates and bar demonstrates SVG quality and proper encoding
- Screenshot: Dashboard page with user content overlaid on pattern showing text remains highly readable demonstrates appropriate pattern opacity (0.14) and non-interference

#### 2.0 Tasks

- [x] 2.1 Create the barbell SVG pattern as a properly URL-encoded data URI using the specifications: 220×220px pattern size, white stroke at 4px width, horizontal bar from x=65 to x=155 at y=110, outer plates (10×32px) at x=43 and x=167, inner plates (12×44px) at x=53 and x=155
- [x] 2.2 Add the barbell SVG background-image to the body element in `app/globals.css` using the data URI format: `background-image: url("data:image/svg+xml,...")`
- [x] 2.3 Set the SVG pattern opacity to 0.14 by including `opacity='0.14'` in the SVG group element
- [x] 2.4 Configure background-repeat: repeat and background-size: 220px 220px on the body element to ensure seamless tiling
- [x] 2.5 Test pattern visibility by running `npm run dev`, verify the barbell pattern is visible but subtle against the black background, check tiling at various viewport sizes
- [x] 2.6 Test pattern at 200% browser zoom to verify SVG remains crisp and tiles properly without gaps or misalignment
- [x] 2.7 Verify text readability over the pattern on both home and dashboard pages, ensuring the 0.14 opacity doesn't interfere with content

### [ ] 3.0 Add Navigation Header with Logo and Favicon

#### 3.0 Proof Artifact(s)

- Screenshot: Browser tab showing dumbbell favicon demonstrates favicon configuration in metadata
- Screenshot: Home page showing navigation header with dumbbell logo in top-left corner (32-48px height) linked to "/" demonstrates logo placement, sizing, and visibility against dark background
- Screenshot: Dashboard page showing same consistent header with logo demonstrates header appears on all pages
- Screenshot: Mobile viewport (375px width) showing responsive header with logo demonstrates mobile behavior

#### 3.0 Tasks

- [ ] 3.1 Update metadata in `app/layout.tsx` to configure the favicon by adding `icons: { icon: '/favicon.png' }` to the Metadata object
- [ ] 3.2 Create new `components/Header.tsx` component with TypeScript: use Next.js Link component wrapping Next.js Image component for the logo, sized at 40px height with proportional width, alt text "Logo", linking to "/"
- [ ] 3.3 Add CSS styles for the header in `app/globals.css`: create `.header` class with padding, flexbox layout, and dark background, and `.header-logo` class to ensure proper logo styling and hover effects
- [ ] 3.4 Style the logo for visibility against dark background: add a subtle white border or light background circle if needed to ensure the dark dumbbell image is visible
- [ ] 3.5 Import and add the Header component to `app/layout.tsx` inside the body tag, positioned before the SessionProvider/children
- [ ] 3.6 Test header on both home and dashboard pages by running `npm run dev`, verify logo appears in top-left, is clickable, and navigates to home page
- [ ] 3.7 Test responsive behavior at mobile viewport (375px width) using browser DevTools device emulation, ensure header and logo scale appropriately
- [ ] 3.8 Verify favicon appears in browser tab by checking the tab icon in multiple browsers (Chrome, Firefox, Safari if available)
