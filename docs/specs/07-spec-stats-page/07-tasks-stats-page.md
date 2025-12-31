# 07-tasks-stats-page.md

This task list implements the Stats Page feature as defined in [07-spec-stats-page.md](./07-spec-stats-page.md).

## Relevant Files

- `app/stats/page.tsx` - New Stats page with server-side data fetching and authentication
- `components/DesktopNav.tsx` - Add "Stats" link to desktop navigation menu
- `components/MobileNav.tsx` - Add "Stats" link to mobile navigation menu
- `app/account/page.tsx` - Add link to Stats page from Account page
- `components/Theoretical1RMSection.tsx` - New component for displaying theoretical 1RM values (extracted for reuse)
- `components/AccountOneRMSection.tsx` - Remove theoretical 1RM section (moved to Stats page)
- `components/HeaviestAMRAPSection.tsx` - New component displaying heaviest AMRAP record per lift with expandable notes
- `components/OneRMProgressChart.tsx` - New client component for Recharts line chart with time filtering
- `lib/statsCalculations.ts` - Utility functions for calculating heaviest AMRAPs and chart data points
- `lib/statsCalculations.test.ts` - Unit tests for stats calculation logic
- `app/globals.css` - Styles for Stats page, chart, and new components

### Notes

- Unit tests should be placed alongside the code files they test (e.g., `lib/statsCalculations.test.ts`)
- Use the repository's testing command: `npm test` or `npx jest [path]`
- Follow existing Next.js App Router patterns from `app/account/page.tsx` for the new Stats page
- Follow existing component patterns from `components/AccountOneRMSection.tsx` for new components
- Use existing TypeScript interfaces from `models/User.ts` (`IAMRAPHistoryEntry`, `IOneRM`)
- Use existing 1RM calculation from `lib/oneRMCalculation.ts`

## Tasks

### [x] 1.0 Stats Page Navigation and Structure

Create the `/stats` page route with authentication, add navigation links to desktop and mobile menus, and add a link from the Account page.

#### 1.0 Proof Artifact(s)

- Screenshot: Desktop navigation showing "Stats" link next to existing nav items demonstrates navigation integration
- Screenshot: Mobile navigation showing "Stats" link demonstrates mobile navigation integration
- Screenshot: Account page showing "View Stats" or similar link demonstrates cross-linking
- Screenshot: `/stats` page rendered with page title and structure (empty sections) demonstrates page creation
- Screenshot: Unauthenticated user redirected to home when accessing `/stats` demonstrates auth protection

#### 1.0 Tasks

- [x] 1.1 Create `app/stats/page.tsx` as a server component with authentication check (redirect to `/` if not authenticated), page title, and placeholder sections for upcoming content
- [x] 1.2 Add "Stats" link to `components/DesktopNav.tsx` in the authenticated user menu section (between "My Workout" and "Profile")
- [x] 1.3 Add "Stats" link to `components/MobileNav.tsx` in the authenticated user menu section (between "My Workout" and "Profile")
- [x] 1.4 Add a "View Stats" link/button to the Account page that navigates to `/stats`
- [x] 1.5 Add CSS styles for the stats page layout in `app/globals.css` (container, section spacing, headings)

### [x] 2.0 Theoretical 1RM Card Migration

Move the theoretical 1RM section from the Account page to the Stats page, including the calculation logic and display.

#### 2.0 Proof Artifact(s)

- Screenshot: Stats page showing theoretical 1RM section with values for all four lifts demonstrates migration
- Screenshot: Account page without the theoretical 1RM section (before/after) demonstrates removal
- Screenshot: Stats page with "No data yet" placeholder for user without AMRAP history demonstrates empty state

#### 2.0 Tasks

- [x] 2.1 Create `components/Theoretical1RMSection.tsx` as a presentational component that accepts theoretical 1RM values and units as props, displays all four lifts in a grid
- [x] 2.2 Update `app/stats/page.tsx` to fetch user data, calculate theoretical 1RM values from AMRAP history using the existing `calculateOneRM` function, and render `Theoretical1RMSection`
- [x] 2.3 Remove the theoretical 1RM section from `components/AccountOneRMSection.tsx` (the `{theoretical1RMs && ...}` block) and remove the `theoretical1RMs` prop
- [x] 2.4 Update `app/account/page.tsx` to remove the `theoretical1RMs` calculation and prop passed to `AccountOneRMSection`
- [x] 2.5 Add "No data yet" placeholder display in `Theoretical1RMSection` when no lifts have AMRAP history

### [x] 3.0 Heaviest AMRAP Records Display

Create a section displaying the heaviest recorded AMRAP for each lift with weight, reps, date, and expandable notes functionality.

#### 3.0 Proof Artifact(s)

- Screenshot: Heaviest AMRAP section showing all four lifts with weight, reps, and date demonstrates display
- Screenshot: "View notes" button visible for a record that has notes demonstrates conditional display
- Screenshot: Expanded notes view showing note content inline demonstrates expandable notes
- Screenshot: Empty state placeholder for a lift without AMRAP history demonstrates graceful degradation

#### 3.0 Tasks

- [x] 3.1 Create `lib/statsCalculations.ts` with a `findHeaviestAMRAPs` function that takes AMRAP history array and returns the heaviest record (by weight) for each lift
- [x] 3.2 Write unit tests in `lib/statsCalculations.test.ts` for `findHeaviestAMRAPs` covering: multiple records per lift, ties (same weight), empty history, and missing lifts
- [x] 3.3 Create `components/HeaviestAMRAPSection.tsx` as a client component that displays four lift cards with weight, reps, and formatted date
- [x] 3.4 Add expandable notes functionality to `HeaviestAMRAPSection` with a "View notes" toggle button that shows/hides notes inline (only visible when notes exist)
- [x] 3.5 Update `app/stats/page.tsx` to call `findHeaviestAMRAPs`, serialize the data, and pass it to `HeaviestAMRAPSection`
- [x] 3.6 Add CSS styles for heaviest AMRAP cards in `app/globals.css` including empty state, notes expansion animation, and responsive layout

### [ ] 4.0 1RM Progress Chart with Time Filtering

Install Recharts, create the progress chart component with all four lifts displayed as colored lines, implement time period filtering, and ensure dark mode support.

#### 4.0 Proof Artifact(s)

- CLI: `npm ls recharts` shows recharts installed demonstrates dependency installation
- Screenshot: Progress chart showing four colored lines with legend demonstrates chart rendering
- Screenshot: Time period selector showing all options (3mo, 6mo, 1yr, All time) demonstrates filtering UI
- Screenshot: Chart filtered to different time periods showing adjusted data range demonstrates filtering works
- Screenshot: Tooltip on hover showing date, lift, and 1RM value demonstrates interactivity
- Screenshot: Chart in dark mode demonstrates theme support
- Screenshot: Empty chart state with "No data yet" message for user without data demonstrates empty state

#### 4.0 Tasks

- [ ] 4.1 Install recharts package: `npm install recharts`
- [ ] 4.2 Add `transformAMRAPToChartData` function to `lib/statsCalculations.ts` that filters AMRAP history to weeks 1-3 only, calculates theoretical 1RM for each entry, and returns data formatted for Recharts
- [ ] 4.3 Write unit tests for `transformAMRAPToChartData` covering: week 4 exclusion, 1RM calculation, date sorting, and time period filtering
- [ ] 4.4 Create `components/OneRMProgressChart.tsx` as a client component with Recharts `LineChart`, `ResponsiveContainer`, four colored lines (one per lift), legend, and tooltip
- [ ] 4.5 Add time period selector UI to `OneRMProgressChart` with buttons/dropdown for: 3 months, 6 months, 1 year (default), All time
- [ ] 4.6 Implement time period filtering in `OneRMProgressChart` using React state to filter chart data based on selected period
- [ ] 4.7 Update `app/stats/page.tsx` to pass AMRAP history and units to `OneRMProgressChart`
- [ ] 4.8 Add CSS styles for the chart in `app/globals.css` including dark mode colors for lines/grid/legend, time selector styling, and responsive container sizing
- [ ] 4.9 Add empty state display in `OneRMProgressChart` when no data exists for the selected time period
