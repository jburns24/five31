'use client';

import { useState, useCallback, FormEvent, KeyboardEvent } from 'react';

export interface AMRAPDialogProps {
  isOpen: boolean;
  lift: string;
  weight: number;
  units: 'lbs' | 'kg';
  expectedReps: number;
  onSubmit: (reps: number, notes: string) => Promise<void>;
  onCancel: () => void;
}

export default function AMRAPDialog({
  isOpen,
  lift,
  weight,
  units,
  expectedReps,
  onSubmit,
  onCancel,
}: AMRAPDialogProps) {
  const [reps, setReps] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Calculate minimum expected reps (50% of target for warning)
  const minExpectedReps = Math.floor(expectedReps / 2);

  const handleRepsChange = useCallback(
    (value: string) => {
      setReps(value);
      const numericReps = parseInt(value, 10);
      if (!isNaN(numericReps) && numericReps < minExpectedReps) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    },
    [minExpectedReps]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const numericReps = parseInt(reps, 10);
      if (isNaN(numericReps) || numericReps < 0) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(numericReps, notes);
        setHasSubmitted(true);
      } catch (error) {
        console.error('Failed to submit AMRAP:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [reps, notes, onSubmit]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    },
    [onCancel]
  );

  if (!isOpen) {
    return null;
  }

  const formatLiftName = (name: string): string => {
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div
      className="amrap-dialog-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="amrap-dialog-title"
      onKeyDown={handleKeyDown}
    >
      <div className="amrap-dialog">
        <h2 id="amrap-dialog-title" className="amrap-dialog__title">
          🎯 Record AMRAP Performance
        </h2>

        <div className="amrap-dialog__set-info">
          <p>
            <strong>{formatLiftName(lift)}</strong> at{' '}
            <strong>
              {weight} {units}
            </strong>
          </p>
          <p className="amrap-dialog__target">
            Target: {expectedReps}+ reps
          </p>
        </div>

        <form onSubmit={handleSubmit} className="amrap-dialog__form">
          <div className="amrap-dialog__field">
            <label htmlFor="amrap-reps" className="amrap-dialog__label">
              Reps Completed
            </label>
            <input
              id="amrap-reps"
              type="number"
              min="0"
              max="50"
              value={reps}
              onChange={(e) => handleRepsChange(e.target.value)}
              className="amrap-dialog__input"
              placeholder={`e.g., ${expectedReps}`}
              disabled={isSubmitting || hasSubmitted}
              autoFocus
              required
            />
            {showWarning && (
              <p className="amrap-dialog__warning">
                ⚠️ Reps seem low - expected {expectedReps}+, got {reps}
              </p>
            )}
          </div>

          <div className="amrap-dialog__field">
            <label htmlFor="amrap-notes" className="amrap-dialog__label">
              Notes (optional)
            </label>
            <textarea
              id="amrap-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="amrap-dialog__textarea"
              placeholder="How did it feel? Any issues?"
              rows={3}
              disabled={isSubmitting || hasSubmitted}
            />
          </div>

          <div className="amrap-dialog__actions">
            <button
              type="button"
              onClick={onCancel}
              className="amrap-dialog__button amrap-dialog__button--cancel"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="amrap-dialog__button amrap-dialog__button--submit"
              disabled={isSubmitting || hasSubmitted || reps === ''}
            >
              {isSubmitting ? 'Saving...' : hasSubmitted ? 'Saved!' : 'Record AMRAP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
