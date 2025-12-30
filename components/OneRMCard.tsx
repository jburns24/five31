'use client';

import { useState, useEffect } from 'react';
import type { IOneRM } from '@/models/User';

interface OneRMCardProps {
  initialData?: IOneRM;
  onGenerateWorkout: (data: IOneRM) => Promise<void>;
  isGenerating?: boolean;
}

interface ValidationErrors {
  squat?: string;
  bench?: string;
  deadlift?: string;
  overheadPress?: string;
}

export default function OneRMCard({
  initialData,
  onGenerateWorkout,
  isGenerating = false,
}: OneRMCardProps) {
  const [squat, setSquat] = useState<string>('');
  const [bench, setBench] = useState<string>('');
  const [deadlift, setDeadlift] = useState<string>('');
  const [overheadPress, setOverheadPress] = useState<string>('');
  const [units, setUnits] = useState<'lbs' | 'kg'>('lbs');
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Pre-fill form with existing data
  useEffect(() => {
    if (initialData) {
      if (initialData.squat) setSquat(initialData.squat.toString());
      if (initialData.bench) setBench(initialData.bench.toString());
      if (initialData.deadlift) setDeadlift(initialData.deadlift.toString());
      if (initialData.overheadPress)
        setOverheadPress(initialData.overheadPress.toString());
      if (initialData.units) setUnits(initialData.units);
    }
  }, [initialData]);

  // Validation function
  const validateField = (
    name: string,
    value: string
  ): string | undefined => {
    const numValue = parseFloat(value);
    const maxValue = units === 'lbs' ? 2000 : 900;

    if (!value || value.trim() === '') {
      return `${name} is required`;
    }
    if (isNaN(numValue)) {
      return `${name} must be a number`;
    }
    if (numValue <= 0) {
      return `${name} must be greater than 0`;
    }
    if (numValue > maxValue) {
      return `${name} cannot exceed ${maxValue} ${units}`;
    }
    return undefined;
  };

  // Validate all fields
  const validateAll = (): boolean => {
    const newErrors: ValidationErrors = {
      squat: validateField('Squat', squat),
      bench: validateField('Bench', bench),
      deadlift: validateField('Deadlift', deadlift),
      overheadPress: validateField('Overhead Press', overheadPress),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  // Check if form is valid for button state
  const isFormValid = (): boolean => {
    const fields = [squat, bench, deadlift, overheadPress];
    const maxValue = units === 'lbs' ? 2000 : 900;

    return fields.every((field) => {
      const num = parseFloat(field);
      return field && !isNaN(num) && num > 0 && num <= maxValue;
    });
  };

  // Handle generate workout button click
  const handleGenerateClick = async () => {
    if (!validateAll()) return;

    const data: IOneRM = {
      squat: parseFloat(squat),
      bench: parseFloat(bench),
      deadlift: parseFloat(deadlift),
      overheadPress: parseFloat(overheadPress),
      units,
      roundingPreference: 'plate',
    };

    await onGenerateWorkout(data);
  };

  // Handle input change with real-time validation clearing
  const handleInputChange = (
    setter: (value: string) => void,
    fieldName: keyof ValidationErrors,
    value: string
  ) => {
    setter(value);
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }
  };

  return (
    <div className="onerm-card">
      <h2>1RM Tracker</h2>
      <p className="onerm-description">
        Enter your one-rep max for each lift to generate a personalized 5/3/1
        workout plan.
      </p>

      <div className="onerm-units">
        <label className="onerm-units-label">Units:</label>
        <div className="onerm-units-options">
          <label className="onerm-unit-option">
            <input
              type="radio"
              name="units"
              value="lbs"
              checked={units === 'lbs'}
              onChange={() => setUnits('lbs')}
            />
            <span>Pounds (lbs)</span>
          </label>
          <label className="onerm-unit-option">
            <input
              type="radio"
              name="units"
              value="kg"
              checked={units === 'kg'}
              onChange={() => setUnits('kg')}
            />
            <span>Kilograms (kg)</span>
          </label>
        </div>
      </div>

      <div className="onerm-form">
        <div className="onerm-field">
          <label htmlFor="squat">Squat</label>
          <div className="onerm-input-wrapper">
            <input
              type="number"
              id="squat"
              value={squat}
              onChange={(e) =>
                handleInputChange(setSquat, 'squat', e.target.value)
              }
              placeholder={`Enter weight in ${units}`}
              min="1"
              max={units === 'lbs' ? 2000 : 900}
              className={errors.squat ? 'onerm-input-error' : ''}
            />
            <span className="onerm-unit">{units}</span>
          </div>
          {errors.squat && (
            <span className="onerm-error">{errors.squat}</span>
          )}
        </div>

        <div className="onerm-field">
          <label htmlFor="bench">Bench Press</label>
          <div className="onerm-input-wrapper">
            <input
              type="number"
              id="bench"
              value={bench}
              onChange={(e) =>
                handleInputChange(setBench, 'bench', e.target.value)
              }
              placeholder={`Enter weight in ${units}`}
              min="1"
              max={units === 'lbs' ? 2000 : 900}
              className={errors.bench ? 'onerm-input-error' : ''}
            />
            <span className="onerm-unit">{units}</span>
          </div>
          {errors.bench && (
            <span className="onerm-error">{errors.bench}</span>
          )}
        </div>

        <div className="onerm-field">
          <label htmlFor="deadlift">Deadlift</label>
          <div className="onerm-input-wrapper">
            <input
              type="number"
              id="deadlift"
              value={deadlift}
              onChange={(e) =>
                handleInputChange(setDeadlift, 'deadlift', e.target.value)
              }
              placeholder={`Enter weight in ${units}`}
              min="1"
              max={units === 'lbs' ? 2000 : 900}
              className={errors.deadlift ? 'onerm-input-error' : ''}
            />
            <span className="onerm-unit">{units}</span>
          </div>
          {errors.deadlift && (
            <span className="onerm-error">{errors.deadlift}</span>
          )}
        </div>

        <div className="onerm-field">
          <label htmlFor="overheadPress">Overhead Press</label>
          <div className="onerm-input-wrapper">
            <input
              type="number"
              id="overheadPress"
              value={overheadPress}
              onChange={(e) =>
                handleInputChange(
                  setOverheadPress,
                  'overheadPress',
                  e.target.value
                )
              }
              placeholder={`Enter weight in ${units}`}
              min="1"
              max={units === 'lbs' ? 2000 : 900}
              className={errors.overheadPress ? 'onerm-input-error' : ''}
            />
            <span className="onerm-unit">{units}</span>
          </div>
          {errors.overheadPress && (
            <span className="onerm-error">{errors.overheadPress}</span>
          )}
        </div>
      </div>

      <button
        className="onerm-generate-button"
        onClick={handleGenerateClick}
        disabled={!isFormValid() || isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Workout'}
      </button>
    </div>
  );
}
