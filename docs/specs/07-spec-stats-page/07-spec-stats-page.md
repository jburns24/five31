# 07-spec-stats-page.md

## Introduction/Overview

This specification defines a new `/stats` page that consolidates user performance data into a single, dedicated view. The page will display the user's theoretical 1RM values (moved from the Account page), their heaviest recorded AMRAP sets per lift with associated notes, and a progress chart showing 1RM trends over time. This provides users with a centralized location to track their strength training progress and achievements.

## Goals

1. Provide a dedicated stats page at `/stats` accessible from main navigation and the Account page
2. Relocate the theoretical 1RM card from the Account page to the Stats page
3. Display the heaviest recorded AMRAP set for each lift (squat, bench, deadlift, overhead press) with date and expandable notes
4. Visualize 1RM progress over time using an interactive line chart with all four lifts
5. Support time period filtering (3 months, 6 months, 1 year, all time) for the progress chart
6. Handle empty states gracefully with placeholder content

## User Stories

1. **As a lifter**, I want to see my theoretical 1RM values on a dedicated Stats page so that my Account page stays focused on settings and profile information.

2. **As a lifter**, I want to see my heaviest recorded AMRAP set for each lift so that I can track my peak performances and remember what I achieved on those days.

3. **As a lifter**, I want to view notes from my best lifting sessions so that I can recall what contributed to my peak performance.

4. **As a lifter**, I want to see a graph of my 1RM progress over time so that I can visualize my strength gains across weeks and months.

5. **As a lifter**, I want to filter the progress chart by time period so that I can focus on recent progress or view my entire training history.

6. **As a lifter**, I want to access my Stats page from the main navigation so that I can quickly check my progress from anywhere in the app.

## Demoable Units of Work

### Unit 1: Stats Page Navigation and Structure

**Purpose:** Create the Stats page route and make it accessible from navigation, establishing the page structure and authentication requirements.

**Functional Requirements:**
- The system shall create a new page at `/stats` that requires authentication
- The system shall add a "Stats" link to both desktop and mobile navigation menus
- The system shall add a link to the Stats page from the Account page
- The system shall redirect unauthenticated users to the home page
- The system shall display a page title "Stats" or "My Stats"
- The system shall use the existing page layout patterns consistent with other authenticated pages

**Proof Artifacts:**
- Screenshot: Desktop navigation showing "Stats" link demonstrates navigation integration
- Screenshot: Mobile navigation showing "Stats" link demonstrates mobile navigation integration
- Screenshot: Account page showing link to Stats page demonstrates cross-linking
- Screenshot: Stats page rendered with page structure demonstrates page creation

### Unit 2: Theoretical 1RM Card Migration

**Purpose:** Move the theoretical 1RM display from the Account page to the Stats page, consolidating performance data in one location.

**Functional Requirements:**
- The system shall display the theoretical 1RM section on the Stats page showing calculated 1RM for each lift
- The system shall remove the theoretical 1RM section from the Account page
- The system shall calculate theoretical 1RM using the existing Epley formula from AMRAP history
- The system shall display "No data yet" placeholder for lifts without AMRAP history
- The system shall show the user's preferred units (lbs/kg) from their profile

**Proof Artifacts:**
- Screenshot: Stats page showing theoretical 1RM section with values for each lift demonstrates migration
- Screenshot: Account page without theoretical 1RM section demonstrates removal
- Screenshot: Stats page with empty state for user without AMRAP history demonstrates placeholder

### Unit 3: Heaviest AMRAP Records Display

**Purpose:** Show each lift's heaviest recorded AMRAP set with date and expandable notes, highlighting peak performances.

**Functional Requirements:**
- The system shall display a section showing the heaviest AMRAP record for each lift (squat, bench, deadlift, overhead press)
- The system shall determine "heaviest" by the highest weight lifted (regardless of reps achieved)
- The system shall display the weight, reps achieved, and date for each heaviest AMRAP
- The system shall show a "View notes" expandable link/button when notes exist for the record
- The system shall expand inline to show notes when the user clicks "View notes"
- The system shall collapse notes when the user clicks again (toggle behavior)
- The system shall display "No data yet" placeholder for lifts without AMRAP history
- The system shall query from the user's global AMRAP history stored in the User model

**Proof Artifacts:**
- Screenshot: Heaviest AMRAP section showing all four lifts with weight, reps, and date demonstrates display
- Screenshot: Expanded notes view for a lift with notes demonstrates expandable notes
- Screenshot: Lift card without "View notes" button when no notes exist demonstrates conditional display
- Screenshot: Empty state placeholder for user without data demonstrates graceful degradation

### Unit 4: 1RM Progress Chart

**Purpose:** Visualize 1RM progress over time with an interactive chart showing all four lifts and time period filtering.

**Functional Requirements:**
- The system shall display a line chart showing theoretical 1RM progress for all four lifts
- The system shall use Recharts library for chart rendering
- The system shall display four colored lines (one per lift) with a legend identifying each
- The system shall calculate data points from AMRAP sets in weeks 1, 2, and 3 only (excluding week 4 deload)
- The system shall use the Epley formula to calculate theoretical 1RM for each data point
- The system shall provide time period selector with options: 3 months, 6 months, 1 year, All time
- The system shall default to showing 1 year of data
- The system shall filter chart data based on the selected time period
- The system shall display date on the x-axis and weight (1RM) on the y-axis
- The system shall show the user's preferred units (lbs/kg) on the y-axis label
- The system shall display a tooltip on hover showing the exact date, lift, and 1RM value
- The system shall display "No data yet" placeholder when no AMRAP data exists in the selected time period
- The system shall support dark mode styling consistent with the existing theme

**Proof Artifacts:**
- Screenshot: Progress chart showing four colored lines with legend demonstrates chart rendering
- Screenshot: Time period selector showing all options demonstrates filtering UI
- Screenshot: Chart filtered to 3 months showing reduced data range demonstrates filtering works
- Screenshot: Tooltip on hover showing data point details demonstrates interactivity
- Screenshot: Chart in dark mode demonstrates theme support
- Screenshot: Empty chart state with "No data yet" message demonstrates empty state handling

## Non-Goals (Out of Scope)

1. **Editing AMRAP history**: Users cannot edit or delete past AMRAP records from this page
2. **Workout generation from Stats**: The Stats page is read-only and does not include workout generation functionality
3. **Sharing or exporting stats**: No social sharing or data export features
4. **Comparison with other users**: No leaderboards or user comparisons
5. **Goal setting**: No feature to set target 1RM goals or track progress toward them
6. **Additional chart types**: Only line charts; no bar charts, pie charts, or other visualizations
7. **Custom date range picker**: Only preset time periods, no custom date range selection

## Design Considerations

- Match existing page styling patterns (header, card layouts, spacing)
- Use the existing dark mode theme variables for all new components
- Chart colors should be distinguishable and accessible (consider colorblind-friendly palette)
- Suggested lift colors: Squat (blue), Bench (green), Deadlift (red/orange), Overhead Press (purple)
- Mobile-responsive layout: chart should be readable on mobile devices
- Expandable notes should have smooth animation consistent with other UI interactions
- Empty states should be helpful, not discouraging (friendly copy, not error-like styling)

## Repository Standards

- Follow existing Next.js App Router patterns for page creation
- Use server components for data fetching, client components for interactive elements (chart, expandable notes)
- API endpoints follow existing patterns in `app/api/` directory
- Component files go in `components/` directory
- Follow existing TypeScript interface patterns from `models/User.ts`
- Use existing CSS patterns from `globals.css` for styling
- Follow existing navigation patterns from `DesktopNav.tsx` and `MobileNav.tsx`

## Technical Considerations

- **Recharts dependency**: Install `recharts` package for chart rendering
- **Data aggregation**: May need a new API endpoint or enhance existing queries to aggregate AMRAP data for the chart
- **Performance**: For users with large AMRAP histories, consider query optimization with date filtering at the database level
- **Responsive chart**: Recharts `ResponsiveContainer` should be used for mobile compatibility
- **Date formatting**: Use consistent date formatting with existing patterns in the codebase

## Security Considerations

- Ensure Stats page only shows data for the authenticated user (same pattern as other protected pages)
- API endpoints must validate user session before returning AMRAP data
- No sensitive data beyond what's already stored in AMRAP history

## Success Metrics

1. **Stats page loads successfully** for authenticated users with and without AMRAP history
2. **Theoretical 1RM values match** the calculations previously shown on the Account page
3. **Heaviest AMRAP records are accurate** - correctly identifies the highest weight for each lift
4. **Chart renders all data points** from AMRAP history within the selected time period
5. **Navigation works consistently** from both main nav and Account page link
6. **Dark mode styling** is consistent with the rest of the application

## Open Questions

No open questions at this time.
