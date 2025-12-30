# 05-task-04-proofs.md

## Task 4.0: Build Workout Generation API and User Flow

### Code: app/api/workout/generate/route.ts

The API route implements the following:

**Authentication:**
```typescript
const session = await getServerSession(authOptions);
if (!session || !session.user?.email) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**Request Validation:**
- All four lift values required
- Values must be positive numbers
- Maximum values: 2000 lbs or 900 kg
- Units: 'lbs' or 'kg'
- Rounding preference: 'plate' or '2.5'

**Database Operations:**
```typescript
// Update user's 1RM values
const user = await User.findOneAndUpdate(
  { email: session.user.email },
  { oneRM: { squat, bench, deadlift, overheadPress, units, roundingPreference } },
  { new: true }
);

// Archive existing active workout plans
await WorkoutPlan.updateMany(
  { userId: user._id, isArchived: false },
  { isArchived: true }
);

// Generate and save new workout plan
const workoutPlanData = generateWorkoutPlan(
  { squat, bench, deadlift, overheadPress },
  units,
  roundingPreference
);

const newWorkoutPlan = new WorkoutPlan({
  userId: user._id,
  units,
  roundingPreference,
  trainingMaxValues: workoutPlanData.trainingMaxValues,
  weeklyWorkouts: workoutPlanData.weeks,
});

await newWorkoutPlan.save();
```

**Error Handling:**
- 401: Unauthorized (not authenticated)
- 400: Validation errors (missing fields, invalid values)
- 404: User not found
- 500: Server errors

**Success Response:**
```json
{
  "success": true,
  "workoutPlanId": "<ObjectId>",
  "message": "Workout plan generated successfully"
}
```

### Code: components/ConfirmDialog.tsx

Reusable modal dialog with:
- `isOpen`: Controls visibility
- `title`: Dialog title
- `message`: Warning/confirmation text
- `onConfirm`: Callback for confirm action
- `onCancel`: Callback for cancel action
- Backdrop click to cancel
- Keyboard accessible buttons

### Code: components/AccountOneRMSection.tsx

Client-side integration:
- Manages dialog visibility state
- Calls `/api/workout/generate` with fetch POST
- Handles success: redirects to `/workout`
- Handles error: displays error banner
- Loading state during generation

### Build Verification

```
> npm run build

Route (app)                              Size     First Load JS
├ ƒ /account                             2.33 kB         104 kB
└ ƒ /api/workout/generate                0 B                0 B

✓ Compiled successfully
```

### Test Suite Status

```
Test Suites: 1 passed, 1 total
Tests:       45 passed, 45 total
```

### Verification

- ✅ ConfirmDialog component created with all required props
- ✅ Dialog UI with modal overlay and buttons
- ✅ CSS styling for dialog added to globals.css
- ✅ Dialog integrated via AccountOneRMSection wrapper
- ✅ Confirmation message matches spec requirements
- ✅ API route created at /api/workout/generate
- ✅ Session validation with 401 for unauthenticated
- ✅ Request body validation for all fields
- ✅ Database connection via connectDB()
- ✅ User model update with 1RM values
- ✅ Archive existing active workout plans
- ✅ Generate workout plan using calculator
- ✅ Save new WorkoutPlan to database
- ✅ Success response with workout plan ID
- ✅ Error handling with appropriate status codes
- ✅ Client-side API call with fetch POST
- ✅ Success redirect to /workout
- ✅ Error display to user
- ✅ Build passes with no errors
