'use client';

import { useCallback } from 'react';

export type LiftType = 'squat' | 'bench' | 'deadlift' | 'overheadPress';

interface WorkoutNavigationProps {
  currentWeek: number;
  currentLift: LiftType;
  onWeekChange: (week: number) => void;
  onLiftChange: (lift: LiftType) => void;
}

const LIFT_OPTIONS: { value: LiftType; label: string }[] = [
  { value: 'squat', label: 'Squat' },
  { value: 'bench', label: 'Bench Press' },
  { value: 'deadlift', label: 'Deadlift' },
  { value: 'overheadPress', label: 'Overhead Press' },
];

const WEEK_OPTIONS = [1, 2, 3, 4];

// Helper to get the index of current workout in the sequence
function getWorkoutIndex(week: number, lift: LiftType): number {
  const liftIndex = LIFT_OPTIONS.findIndex((l) => l.value === lift);
  return (week - 1) * 4 + liftIndex;
}

// Helper to get week and lift from index
function getWorkoutFromIndex(index: number): { week: number; lift: LiftType } {
  const week = Math.floor(index / 4) + 1;
  const liftIndex = index % 4;
  return { week, lift: LIFT_OPTIONS[liftIndex].value };
}

export default function WorkoutNavigation({
  currentWeek,
  currentLift,
  onWeekChange,
  onLiftChange,
}: WorkoutNavigationProps) {
  const handlePrev = useCallback(() => {
    const currentIndex = getWorkoutIndex(currentWeek, currentLift);
    if (currentIndex > 0) {
      const { week, lift } = getWorkoutFromIndex(currentIndex - 1);
      onWeekChange(week);
      onLiftChange(lift);
    }
  }, [currentWeek, currentLift, onWeekChange, onLiftChange]);

  const handleNext = useCallback(() => {
    const currentIndex = getWorkoutIndex(currentWeek, currentLift);
    if (currentIndex < 15) {
      // 16 total workouts (4 weeks × 4 lifts)
      const { week, lift } = getWorkoutFromIndex(currentIndex + 1);
      onWeekChange(week);
      onLiftChange(lift);
    }
  }, [currentWeek, currentLift, onWeekChange, onLiftChange]);

  const currentIndex = getWorkoutIndex(currentWeek, currentLift);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === 15;

  return (
    <div className="workout-navigation">
      <div className="workout-navigation__controls">
        {/* Prev Arrow */}
        <button
          className="workout-navigation__arrow"
          onClick={handlePrev}
          disabled={isFirst}
          aria-label="Previous workout"
        >
          ←
        </button>

        {/* Week Dropdown */}
        <div className="workout-navigation__week">
          <label htmlFor="week-select" className="workout-navigation__label">
            Week
          </label>
          <select
            id="week-select"
            className="workout-navigation__select"
            value={currentWeek}
            onChange={(e) => onWeekChange(Number(e.target.value))}
          >
            {WEEK_OPTIONS.map((week) => (
              <option key={week} value={week}>
                Week {week}
              </option>
            ))}
          </select>
        </div>

        {/* Next Arrow */}
        <button
          className="workout-navigation__arrow"
          onClick={handleNext}
          disabled={isLast}
          aria-label="Next workout"
        >
          →
        </button>
      </div>

      {/* Lift Tabs */}
      <div className="workout-navigation__tabs" role="tablist">
        {LIFT_OPTIONS.map((lift) => (
          <button
            key={lift.value}
            role="tab"
            aria-selected={currentLift === lift.value}
            className={`workout-navigation__tab ${
              currentLift === lift.value ? 'workout-navigation__tab--active' : ''
            }`}
            onClick={() => onLiftChange(lift.value)}
          >
            {lift.label}
          </button>
        ))}
      </div>
    </div>
  );
}
