import mongoose, { Document, Model, Schema } from 'mongoose';

// TypeScript interface for 1RM data
export interface IOneRM {
  squat?: number;
  bench?: number;
  deadlift?: number;
  overheadPress?: number;
  units?: 'lbs' | 'kg';
  roundingPreference?: 'plate' | '2.5';
}

// TypeScript interface for User document
export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  image: string;
  oneRM?: IOneRM;
  createdAt: Date;
  updatedAt: Date;
}

// Sub-schema for 1RM data
const OneRMSchema = new Schema<IOneRM>(
  {
    squat: {
      type: Number,
      min: [1, 'Squat must be at least 1'],
      max: [2000, 'Squat cannot exceed 2000 lbs or 900 kg'],
    },
    bench: {
      type: Number,
      min: [1, 'Bench must be at least 1'],
      max: [2000, 'Bench cannot exceed 2000 lbs or 900 kg'],
    },
    deadlift: {
      type: Number,
      min: [1, 'Deadlift must be at least 1'],
      max: [2000, 'Deadlift cannot exceed 2000 lbs or 900 kg'],
    },
    overheadPress: {
      type: Number,
      min: [1, 'Overhead Press must be at least 1'],
      max: [2000, 'Overhead Press cannot exceed 2000 lbs or 900 kg'],
    },
    units: {
      type: String,
      enum: ['lbs', 'kg'],
      default: 'lbs',
    },
    roundingPreference: {
      type: String,
      enum: ['plate', '2.5'],
      default: 'plate',
    },
  },
  { _id: false }
);

// Mongoose schema definition
const UserSchema = new Schema<IUser>(
  {
    googleId: {
      type: String,
      required: [true, 'Google ID is required'],
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    image: {
      type: String,
      required: false,
      trim: true,
    },
    oneRM: {
      type: OneRMSchema,
      required: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Prevent model recompilation in Next.js hot reload
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
