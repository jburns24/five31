# 06 Questions Round 2 - Workout Page Tracking

## Follow-up: AMRAP Data Storage

In Question 6, you selected option (A) to store completion tracking directly in the WorkoutPlan model, but you didn't select an option for AMRAP records storage.

Since you want to:
- Track PR history (comparing current AMRAP to previous AMRAPs at the same weight)
- Show when the previous PR was set and notes from that PR
- Auto-increment 1RM based on AMRAP performance when generating new plans
- Calculate theoretical 1RM on-demand from AMRAP data

**Question: Where should AMRAP records be stored to support PR tracking across multiple workout plans?**

- [x] (A) Store in User model as an array of AMRAP history records (global history across all plans)
  - Pros: Easy PR comparison, survives plan archiving
  - Cons: User model grows over time

- [ ] (B) Store in WorkoutPlan model only (AMRAP data lives with the plan)
  - Pros: Clean separation, archived plans keep their AMRAP data
  - Cons: Harder to compare across plans for PR detection

- [ ] (C) Both - Store AMRAP in WorkoutPlan AND copy to User model for history/PR tracking
  - Pros: Best for PR detection, maintains history
  - Cons: Data duplication, more complex sync logic

- [ ] (D) Create separate WorkoutHistory/AMRAPHistory collection
  - Pros: Clean architecture, dedicated PR tracking
  - Cons: Additional model complexity

- [ ] (E) Other (describe)

**Related question: What defines a PR?**

- [ ] (A) More reps at the exact same weight (e.g., 5 reps at 200 lbs → 6 reps at 200 lbs)
- [ ] (B) Higher calculated 1RM regardless of weight used (e.g., 5 reps at 200 lbs → 4 reps at 210 lbs could be a PR)
- [x] (C) Both scenarios count as PRs but display differently
- [ ] (D) Other (describe)

Additional notes:
