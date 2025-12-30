'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OneRMCard from './OneRMCard';
import ConfirmDialog from './ConfirmDialog';
import type { IOneRM } from '@/models/User';

interface AccountOneRMSectionProps {
  initialData?: IOneRM;
}

export default function AccountOneRMSection({
  initialData,
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

  return (
    <>
      <OneRMCard
        initialData={initialData}
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
