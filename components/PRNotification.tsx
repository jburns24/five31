'use client';

import { useEffect, useState } from 'react';
import { PRDetails } from '@/lib/prDetection';

export interface PRNotificationProps {
  prDetails: PRDetails;
  lift: string;
  units: 'lbs' | 'kg';
  onClose?: () => void;
  autoHideAfter?: number; // milliseconds, 0 to disable
}

export default function PRNotification({
  prDetails,
  lift,
  units,
  onClose,
  autoHideAfter = 10000, // Default 10 seconds
}: PRNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHideAfter > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoHideAfter);

      return () => clearTimeout(timer);
    }
  }, [autoHideAfter, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible || !prDetails.isPR) {
    return null;
  }

  const formatLiftName = (name: string): string => {
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="pr-notification" role="alert" aria-live="polite">
      <div className="pr-notification__header">
        <span className="pr-notification__emoji">🎉</span>
        <h3 className="pr-notification__title">Personal Record!</h3>
        <button
          className="pr-notification__close"
          onClick={handleClose}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>

      <div className="pr-notification__content">
        <p className="pr-notification__lift">{formatLiftName(lift)}</p>

        {prDetails.repPR && (
          <div className="pr-notification__pr pr-notification__pr--rep">
            <span className="pr-notification__pr-type">💪 Rep PR</span>
            <p className="pr-notification__achievement">
              <strong>+{prDetails.repPR.improvement} reps</strong> at{' '}
              {prDetails.repPR.weight} {units}!
            </p>
            <p className="pr-notification__previous">
              Previous: {prDetails.repPR.previousReps} reps on{' '}
              {formatDate(prDetails.repPR.previousDate)}
              {prDetails.repPR.previousNotes && (
                <span className="pr-notification__notes">
                  {' '}
                  - &quot;{prDetails.repPR.previousNotes}&quot;
                </span>
              )}
            </p>
          </div>
        )}

        {prDetails.oneRMPR && (
          <div className="pr-notification__pr pr-notification__pr--1rm">
            <span className="pr-notification__pr-type">🏆 1RM PR</span>
            <p className="pr-notification__achievement">
              New theoretical 1RM of{' '}
              <strong>
                {prDetails.oneRMPR.current1RM} {units}
              </strong>
              !
            </p>
            <p className="pr-notification__previous">
              Previous: {prDetails.oneRMPR.previous1RM} {units} on{' '}
              {formatDate(prDetails.oneRMPR.previousDate)}
            </p>
            <p className="pr-notification__improvement">
              +{prDetails.oneRMPR.improvement} {units} improvement
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
