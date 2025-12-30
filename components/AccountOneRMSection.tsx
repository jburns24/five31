'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OneRMCard from './OneRMCard';
import ConfirmDialog from './ConfirmDialog';
import type { IOneRM } from '@/models/User';
import type { LiftType } from '@/lib/autoIncrementLogic';

interface AccountOneRMSectionProps {
  initialData?: IOneRM;
  suggestedData?: IOneRM;
  theoretical1RMs?: Partial<Record<LiftType, number>>;
  fromCompletedPlan?: boolean;
}

export default function AccountOneRMSection({
  initialData,
  suggestedData,
  theoretical1RMs,
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

  return (
    <>
      {fromCompletedPlan && suggestedData && (
        <div className="onerm-progression-banner">
          <h3>🎯 Suggested 1RM Progression</h3>
          <p>
            Based on your AMRAP performance, we&apos;ve calculated suggested
            increases. Lifts where you met the target reps have been increased.
          </p>
        </div>
      )}

      {theoretical1RMs && Object.keys(theoretical1RMs).length > 0 && (
        <div className="theoretical-1rm-section">
          <h3>📊 Theoretical 1RM (from AMRAP data)</h3>
          <div className="theoretical-1rm-grid">
            {theoretical1RMs.squat && (
              <div className="theoretical-1rm-item">
                <span className="lift-name">Squat</span>
                <span className="lift-value">
                  {theoretical1RMs.squat} {initialData?.units || 'lbs'}
                </span>
              </div>
            )}
            {theoretical1RMs.bench && (
              <div className="theoretical-1rm-item">
                <span className="lift-name">Bench</span>
                <span className="lift-value">
                  {theoretical1RMs.bench} {initialData?.units || 'lbs'}
                </span>
              </div>
            )}
            {theoretical1RMs.deadlift && (
              <div className="theoretical-1rm-item">
                <span className="lift-name">Deadlift</span>
                <span className="lift-value">
                  {theoretical1RMs.deadlift} {initialData?.units || 'lbs'}
                </span>
              </div>
            )}
            {theoretical1RMs.overheadPress && (
              <div className="theoretical-1rm-item">
                <span className="lift-name">OHP</span>
                <span className="lift-value">
                  {theoretical1RMs.overheadPress} {initialData?.units || 'lbs'}
                </span>
              </div>
            )}
          </div>
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
