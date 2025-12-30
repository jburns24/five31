import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// TypeScript interfaces for workout data structures
export interface IWorkoutSet {
  setNumber: number;
  percentage: number;
  weight: number;
  reps: number;
  isAmrap: boolean;
}

export interface ILiftWorkout {
  lift: 'squat' | 'bench' | 'deadlift' | 'overheadPress';
  liftName: string;
  trainingMax: number;
  sets: IWorkoutSet[];
}

export interface IWeek {
  weekNumber: 1 | 2 | 3 | 4;
  weekName: string;
  lifts: ILiftWorkout[];
}

export interface ITrainingMaxValues {
  squat: number;
  bench: number;
  deadlift: number;
  overheadPress: number;
}

// Main WorkoutPlan interface
export interface IWorkoutPlan extends Document {
  userId: Types.ObjectId;
  dateCreated: Date;
  lastUpdated: Date;
  isArchived: boolean;
  units: 'lbs' | 'kg';
  roundingPreference: 'plate' | '2.5';
  trainingMaxValues: ITrainingMaxValues;
  weeklyWorkouts: IWeek[];
}

// Sub-schema for workout sets
const WorkoutSetSchema = new Schema<IWorkoutSet>(
  {
    setNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    reps: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    isAmrap: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { _id: false }
);

// Sub-schema for lift workouts
const LiftWorkoutSchema = new Schema<ILiftWorkout>(
  {
    lift: {
      type: String,
      required: true,
      enum: ['squat', 'bench', 'deadlift', 'overheadPress'],
    },
    liftName: {
      type: String,
      required: true,
    },
    trainingMax: {
      type: Number,
      required: true,
      min: 0,
    },
    sets: {
      type: [WorkoutSetSchema],
      required: true,
    },
  },
  { _id: false }
);

// Sub-schema for weeks
const WeekSchema = new Schema<IWeek>(
  {
    weekNumber: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
    },
    weekName: {
      type: String,
      required: true,
    },
    lifts: {
      type: [LiftWorkoutSchema],
      required: true,
    },
  },
  { _id: false }
);

// Sub-schema for training max values
const TrainingMaxValuesSchema = new Schema<ITrainingMaxValues>(
  {
    squat: {
      type: Number,
      required: true,
      min: 0,
    },
    bench: {
      type: Number,
      required: true,
      min: 0,
    },
    deadlift: {
      type: Number,
      required: true,
      min: 0,
    },
    overheadPress: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

// Main WorkoutPlan schema
const WorkoutPlanSchema = new Schema<IWorkoutPlan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    isArchived: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
    units: {
      type: String,
      required: true,
      enum: ['lbs', 'kg'],
      default: 'lbs',
    },
    roundingPreference: {
      type: String,
      required: true,
      enum: ['plate', '2.5'],
      default: 'plate',
    },
    trainingMaxValues: {
      type: TrainingMaxValuesSchema,
      required: true,
    },
    weeklyWorkouts: {
      type: [WeekSchema],
      required: true,
      validate: {
        validator: function (weeks: IWeek[]) {
          return weeks.length === 4;
        },
        message: 'Workout plan must contain exactly 4 weeks',
      },
    },
  },
  {
    timestamps: {
      createdAt: 'dateCreated',
      updatedAt: 'lastUpdated',
    },
  }
);

// Compound index for efficient queries (find active plan for user)
WorkoutPlanSchema.index({ userId: 1, isArchived: 1 });

// Prevent model recompilation in Next.js hot reload
const WorkoutPlan: Model<IWorkoutPlan> =
  mongoose.models.WorkoutPlan ||
  mongoose.model<IWorkoutPlan>('WorkoutPlan', WorkoutPlanSchema);

export default WorkoutPlan;
