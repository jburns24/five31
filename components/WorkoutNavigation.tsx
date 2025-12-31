'use client';

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

export default function WorkoutNavigation({
  currentWeek,
  currentLift,
  onWeekChange,
  onLiftChange,
}: WorkoutNavigationProps) {
  return (
    <div className="workout-navigation">
      <div className="workout-navigation__controls">
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
