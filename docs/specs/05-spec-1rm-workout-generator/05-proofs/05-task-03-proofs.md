# 05-task-03-proofs.md

## Task 3.0: Implement 1RM Tracker Card on Account Page

### Code: components/OneRMCard.tsx

The OneRMCard component includes:

**Client Component Features:**
- `'use client'` directive for React hooks
- State management for all four lift inputs
- Unit selector (lbs/kg) with radio buttons
- Real-time validation with inline error messages
- Disabled button state when form is invalid
- Pre-fill from existing 1RM data via useEffect

**Validation Logic:**
- All fields required
- Values must be greater than 0
- Maximum: 2000 lbs or 900 kg based on selected units
- Inline error messages for each field

### Code: components/ConfirmDialog.tsx

Reusable confirmation dialog component:
- Modal overlay with backdrop click to cancel
- Title and message props
- Customizable button text
- Smooth animations (fadeIn, slideIn)

### Code: components/AccountOneRMSection.tsx

Client wrapper component that:
- Manages dialog state
- Handles API calls
- Redirects to /workout on success
- Shows error banner on failure

### Code: app/account/page.tsx Integration

```tsx
import AccountOneRMSection from '@/components/AccountOneRMSection'
import type { IOneRM } from '@/models/User'

// In the component:
const oneRMData: IOneRM | undefined = user.oneRM ? {
  squat: user.oneRM.squat,
  bench: user.oneRM.bench,
  deadlift: user.oneRM.deadlift,
  overheadPress: user.oneRM.overheadPress,
  units: user.oneRM.units,
  roundingPreference: user.oneRM.roundingPreference,
} : undefined

// In the return:
<AccountOneRMSection initialData={oneRMData} />
```

### CSS Styles Added

The following style classes were added to globals.css:

**1RM Card Styles:**
- `.onerm-card` - Card container
- `.onerm-description` - Description text
- `.onerm-units`, `.onerm-units-options`, `.onerm-unit-option` - Unit selector
- `.onerm-form`, `.onerm-field` - Form layout
- `.onerm-input-wrapper`, `.onerm-unit` - Input with unit suffix
- `.onerm-error`, `.onerm-input-error` - Error states
- `.onerm-generate-button` - Generate button with disabled state
- `.onerm-error-banner` - Error message banner

**Confirm Dialog Styles:**
- `.confirm-dialog-backdrop` - Modal overlay
- `.confirm-dialog` - Dialog box with animations
- `.confirm-dialog-title`, `.confirm-dialog-message` - Text content
- `.confirm-dialog-actions`, `.confirm-dialog-button` - Action buttons

### Build Verification

```
> npm run build

  ▲ Next.js 14.2.35
   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types    
 ✓ Generating static pages (6/6)
 ✓ Finalizing page optimization    

Route (app)                              Size     First Load JS
├ ƒ /account                             2.33 kB         104 kB
```

### Verification

- ✅ OneRMCard created as client component with 'use client'
- ✅ State management for all inputs and validation errors
- ✅ Number input fields for all four lifts
- ✅ Unit selector (radio buttons) defaulting to 'lbs'
- ✅ Client-side validation with bounds checking
- ✅ Inline validation error messages
- ✅ Generate Workout button with disabled state
- ✅ useEffect hook for pre-filling existing data
- ✅ CSS styles following existing patterns
- ✅ Account page fetches and passes 1RM data
- ✅ AccountOneRMSection integrates OneRMCard
- ✅ ConfirmDialog component for user confirmation
- ✅ Build passes with no TypeScript errors
