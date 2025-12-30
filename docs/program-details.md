# Jim Wendler’s 5/3/1 Workout Plan (AI-Agent Friendly)

> **Primary source:** BarBend’s explainer of Jim Wendler’s 5/3/1 program. citeturn2view0
> **Supplemental sources (for the standard % tables + beginner assistance details):** Muscle & Strength and JimWendler.com. citeturn6view0turn4view0

## 1) Purpose (what this plan optimizes for)

**Goal:** long-term, sustainable strength gains using a simple, repeatable progression model built around the main barbell lifts. citeturn2view0

**Core principles to preserve:**
- Prioritize big multi-joint barbell lifts (squat, bench press, deadlift, overhead press). citeturn2view0turn6view0
- Use a conservative **Training Max (TM)** rather than true 1RM to manage fatigue and ensure consistency. citeturn2view0turn6view0
- Progress slowly and consistently; deload regularly. citeturn2view0

---

## 2) Inputs the agent must collect

### Required user inputs
- **1RM (or best estimate) for each main lift**: squat, bench press, deadlift, overhead press. citeturn6view0
- Units: `lb` or `kg`
- Rounding rule (choose one):
  - `round_to_smallest_plate` (recommended)
  - `round_to_2.5lb_or_1kg` (common default)

### Optional but useful inputs
- Training frequency preference: `3_days` (beginner template) vs `4_days` (one main lift per day)
- Time per session: ~45–90 minutes as loads grow. citeturn2view0
- Accessory preferences/equipment available (pull-up bar, dumbbells, bands, etc.). citeturn2view0turn4view0

---

## 3) Key definitions

### Training Max (TM)
- For each lift:
  `TM = 0.90 * 1RM` citeturn2view0turn6view0
- **All working-set percentages are calculated from TM**, not true 1RM. citeturn2view0turn6view0

### AMRAP “+” set
Some 5/3/1 templates use a final “plus” set (e.g., “85% x 5+”) where the lifter performs **at least** the target reps, then continues for additional reps while maintaining solid form (do not grind to failure).

### FSL (First Set Last)
A common add-on is **5×5 at the first working set’s weight** (the “first set” of the day). This is explicitly used in Wendler’s beginner template. citeturn4view0

---

## 4) Program structure

### A) Lift selection (main lifts)
- Squat
- Bench Press
- Deadlift
- Overhead Press citeturn2view0turn6view0

### B) Weekly loading (standard 4-week cycle)
Percentages below are **of TM**. citeturn6view0

**Week 1 (3×5):**
- Set 1: 65% × 5
- Set 2: 75% × 5
- Set 3: 85% × 5 (optionally **5+**) citeturn6view0

**Week 2 (3×3):**
- Set 1: 70% × 3
- Set 2: 80% × 3
- Set 3: 90% × 3 (optionally **3+**) citeturn6view0

**Week 3 (5/3/1):**
- Set 1: 75% × 5
- Set 2: 85% × 3
- Set 3: 95% × 1 (optionally **1+**) citeturn6view0

**Week 4 (Deload):**
- Set 1: 40% × 5
- Set 2: 50% × 5
- Set 3: 60% × 5 citeturn6view0

> Note: BarBend describes regular deloading and cites deloads “every seventh week” in its overview. Use the 4-week deload above as the standard cycle, and optionally schedule an *additional* easy week every 7th week if the user’s recovery demands it. citeturn2view0

---

## 5) Session templates

### Standard 4-day template (common in many 5/3/1 variants)
One main lift per day:
- Day 1: Overhead Press + accessories
- Day 2: Deadlift + accessories
- Day 3: Bench Press + accessories
- Day 4: Squat + accessories

(BarBend notes there are many “flavors” including 4–5 day versions; this is a conventional structure to operationalize that.) citeturn2view0

---

## 6) Accessory work rules (agent should keep it simple)

### Beginner-friendly rule set (Wendler’s categories)
Each training day, pick:
- **1 Push**
- **1 Pull**
- **1 Single-leg/Core**

Do **50–100 total reps** for each category (any set/rep breakdown). citeturn4view0

Big fan of the "go till it hurts then do one more; immediately cut the weight in half and double it" for finishing off the accessories. For example if you were doing leg extensions with 100lbs you would go till it hurts and then do one more rep, immediately drop to 50lbs and do double the reps you just did. citeturn4view0

Examples (non-exhaustive): citeturn4view0
- Push: dips*, push-ups*, DB press/incline, triceps extensions/pushdowns
- Pull: chin-ups/pull-ups*, rows*, face pulls, band pull-aparts, pulldowns, curls
- Shoulder health: dead hangs* (45 sec+), plate halo* (plate halo is a shoulder warm-up and mobility drill where you hold a weight plate (commonly a 45lb/20kg one, though lighter weights like 10-25lb are often used to start) with both hands, raise it to head/chest level, and slowly rotate it in a circular motion around your head—like tracing a "halo." You typically do several reps in one direction, then reverse.), lateral raises, rear delt flyes
- Single-leg/Core: reverse hyper* (this should be done when available on deadlift and squat day), leg extensions*, zercher squats*, ab work, back raises, lunges, step-ups, Bulgarian split squats, swings

* Exercises marked with an asterisk are highly recommended and should be your go to accessory/warm up exercises. citeturn4view0

### Accessory selection heuristics (for the agent)
- Prefer movements the user can do pain-free and consistently.
- Bias toward balancing the main lift patterns (e.g., include pulling volume if benching/pressing a lot).
- Keep total accessory time ~15–25 minutes for most users.

---

## 7) Progression rules (TM increases)

### Default (standard 5/3/1 progression)
After completing a 4-week cycle:
- **Upper body TMs:** +5 lb (or +2.5 kg)
- **Lower body TMs:** +10 lb (or +5 kg) citeturn6view0

### Don’t progress if form collapses
If reps are slow/grindy or technique breaks down, hold TM steady (focus on quality). Wendler explicitly emphasizes “err on the side of too light” and strict form standards for beginners. citeturn4view0

---

## 8) Conditioning and recovery (lightweight guidance)

- Prioritize sleep and nutrition to support heavy compound training. citeturn2view0
- Conditioning can be done on non-lifting days; Wendler suggests some form of running/conditioning on Tue/Thu/Sat/Sun (scaled to goals and recovery). citeturn4view0

---

## 9) Agent-friendly algorithm

### Data model (recommended)
```yaml
user:
  units: lb|kg
  rounding: round_to_smallest_plate|round_to_2.5lb_or_1kg
  schedule: 4_days
  lifts:
    squat: { one_rep_max: number, training_max: number }
    bench: { one_rep_max: number, training_max: number }
    deadlift: { one_rep_max: number, training_max: number }
    press: { one_rep_max: number, training_max: number }

cycle:
  weeks:
    - name: week_1_5s
      sets: [{pct_tm: 0.65, reps: 5}, {pct_tm: 0.75, reps: 5}, {pct_tm: 0.85, reps: "5+"}]
    - name: week_2_3s
      sets: [{pct_tm: 0.70, reps: 3}, {pct_tm: 0.80, reps: 3}, {pct_tm: 0.90, reps: "3+"}]
    - name: week_3_531
      sets: [{pct_tm: 0.75, reps: 5}, {pct_tm: 0.85, reps: 3}, {pct_tm: 0.95, reps: "1+"}]
    - name: week_4_deload
      sets: [{pct_tm: 0.40, reps: 5}, {pct_tm: 0.50, reps: 5}, {pct_tm: 0.60, reps: 5}]
  tm_increase:
    upper_body: { lb: 5, kg: 2.5 }
    lower_body: { lb: 10, kg: 5 }
```

### Pseudocode (plan generation)
```text
1. Collect 1RM for squat/bench/deadlift/press and units.
2. Compute TM for each lift: TM = 0.90 * 1RM.
3. Pick schedule template:
   - 4_days: One main lift per day.
4. For each training day, for each main lift:
   a) Determine current week in 4-week cycle.
   b) For each prescribed set:
      - load = round(TM * pct_tm, rounding_rule)
      - reps = target reps ("+" sets are minimums, stop before technique breakdown)
   c) If beginner_mode: add FSL 5x5 @ first working-set load.
5. Add accessory work:
   - 1 push, 1 pull, 1 single-leg/core; 50–100 total reps each.
6. After week_4 (deload) completes:
   - increase TMs (upper +5lb / +2.5kg; lower +10lb / +5kg)
   - start next cycle at week_1.
```

---

## 10) Output format the agent should produce (per week)

For each training session, generate:
- Main lifts with (set_number, load, reps, pct_of_TM)
- Optional FSL block
- Accessory block (exercise names + rep targets)
- Notes: warm-up reminders, technique priority, recovery cues

Example (template only):
```yaml
session:
  day: 1
  week: week_1_5s
  main_lifts:
    - lift: squat
      working_sets:
        - {set: 1, pct_tm: 0.65, load: "___", reps: 5}
        - {set: 2, pct_tm: 0.75, load: "___", reps: 5}
        - {set: 3, pct_tm: 0.85, load: "___", reps: "5+"}
      supplemental:
        - {type: FSL, sets: 5, reps: 5, load: "same as set_1"}
    - lift: bench
      working_sets: [...]
  accessories:
    push: {exercise: "___", target_total_reps: 50-100}
    pull: {exercise: "___", target_total_reps: 50-100}
    single_leg_or_core: {exercise: "___", target_total_reps: 50-100}
  notes:
    - "Stop '+' sets before form breaks down."
    - "If recovery is poor, reduce accessories or add an extra easy week."
```

---

## 11) Source mapping (what came from where)

- Specific weekly % tables (65/75/85, etc.), TM=90% and +5/+10 progression: Muscle & Strength. citeturn6view0
- Beginner FSL 5×5 add-on and accessory categories (push/pull/single-leg/core, 50–100 reps), plus conditioning note: JimWendler.com. citeturn4view0
