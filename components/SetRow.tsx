'use client';

import type { IWorkoutSet } from '@/models/WorkoutPlan';

interface SetRowProps {
  set: IWorkoutSet;
  units: 'lbs' | 'kg';
  completed: boolean;
  disabled: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export default function SetRow({
  set,
  units,
  completed,
  disabled,
  isLoading,
  onClick,
}: SetRowProps) {
  const handleClick = () => {
    if (!disabled && !isLoading) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && !isLoading) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={completed}
      aria-disabled={disabled}
      className={`set-row set-row--clickable ${
        completed ? 'set-row--completed' : ''
      } ${disabled ? 'set-row--disabled' : ''} ${
        isLoading ? 'set-row--loading' : ''
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span className="set-row__completion">
        {completed ? (
          <span className="set-row__checkmark">✓</span>
        ) : (
          <span className="set-row__circle" />
        )}
      </span>
      <span className="set-row__label">Set {set.setNumber}</span>
      <span className={`set-row__weight ${completed ? 'set-row__text--strike' : ''}`}>
        {set.weight} {units}
      </span>
      <span className={`set-row__reps ${completed ? 'set-row__text--strike' : ''}`}>
        × {set.reps}
        {set.isAmrap && <span className="amrap-badge">+</span>}
      </span>
      <span className="set-row__percentage">{set.percentage}%</span>
    </div>
  );
}
