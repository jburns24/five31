'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OneRMCard from './OneRMCard';
import ConfirmDialog from './ConfirmDialog';
import type { IOneRM } from '@/models/User';
import type { LiftType, IncrementResult } from '@/lib/autoIncrementLogic';

const LIFT_DISPLAY_NAMES: Record<LiftType, string> = {
  squat: 'Squat',
  bench: 'Bench Press',
  deadlift: 'Deadlift',
  overheadPress: 'Overhead Press',
};

interface AccountOneRMSectionProps {
  initialData?: IOneRM;
  suggestedData?: IOneRM;
  progressionDetails?: IncrementResult[];
  fromCompletedPlan?: boolean;
}

export default function AccountOneRMSection({
  initialData,
  suggestedData,
  progressionDetails = [],
  fromCompletedPlan = false,
}: AccountOneRMSectionProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pendingData, setPendingData] = useState<IOneRM | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateWorkout = async (data: IOneRM) => {
    setPendingData(data);
    setIsDialogOpen(true);
    setError(null);
  };

  const handleConfirm = async () => {
    if (!pendingData) return;

    setIsDialogOpen(false);
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/workout/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pendingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate workout');
      }

      // Redirect to workout page on success
      router.push('/workout');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsGenerating(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setPendingData(null);
  };

  // Use suggested data if coming from completed plan
  const displayData = fromCompletedPlan && suggestedData ? suggestedData : initialData;

  // Separate lifts into passed and failed
  const passedLifts = progressionDetails.filter((d) => d.increased);
  const failedLifts = progressionDetails.filter((d) => !d.increased && d.targetReps > 0);
  const noDataLifts = progressionDetails.filter((d) => d.targetReps === 0);

  return (
    <>
      {fromCompletedPlan && suggestedData && (
        <div className="onerm-progression-banner">
          <h3>Cycle Complete - 1RM Progression</h3>

          {passedLifts.length > 0 && (
            <div className="progression-section progression-success">
              <h4>Progressing</h4>
              <ul>
                {passedLifts.map((detail) => (
                  <li key={detail.lift}>
                    <strong>{LIFT_DISPLAY_NAMES[detail.lift]}</strong>: {detail.currentOneRM} → {detail.newOneRM} {initialData?.units || 'lbs'}
                    <span className="progression-reason">
                      (All AMRAP targets met)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {failedLifts.length > 0 && (
            <div className="progression-section progression-failed">
              <h4>🔄 Repeating at same weight</h4>
              <ul>
                {failedLifts.map((detail) => (
                  <li key={detail.lift}>
                    <strong>{LIFT_DISPLAY_NAMES[detail.lift]}</strong>: {detail.currentOneRM} {initialData?.units || 'lbs'}
                    <span className="progression-reason">
                      (Missed target: got {detail.actualReps} reps, needed {detail.targetReps}+)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {noDataLifts.length > 0 && (
            <div className="progression-section progression-nodata">
              <h4>⚪ No data</h4>
              <ul>
                {noDataLifts.map((detail) => (
                  <li key={detail.lift}>
                    <strong>{LIFT_DISPLAY_NAMES[detail.lift]}</strong>: {detail.currentOneRM} {initialData?.units || 'lbs'}
                    <span className="progression-reason">
                      (No AMRAP recorded this cycle)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="progression-note">
            💡 In 5/3/1, you must hit all target reps (5+, 3+, 1+) throughout the cycle to progress.
            Missing any target means repeating at the same weight next cycle.
          </p>
        </div>
      )}

      <OneRMCard
        initialData={displayData}
        onGenerateWorkout={handleGenerateWorkout}
        isGenerating={isGenerating}
      />

      {error && (
        <div className="onerm-error-banner">
          {error}
        </div>
      )}

      <ConfirmDialog
        isOpen={isDialogOpen}
        title="Generate Workout Plan"
        message="This will create a new 4-week workout plan based on your 1RM values. Any unfinished workout cycle will be archived and a new one generated. Continue?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
