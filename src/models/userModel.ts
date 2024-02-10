import mongoose, { Schema, Document } from 'mongoose';
import securePassword from '../middlewares/securePassword';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  mobileCountryCode?: string;
  mobile: string;
  password: string;
  profileImage?: string;
  role: 'User' | 'Manager' | 'Admin';
  status?: 'Active' | 'Inactive';
  loginAttempts?: number;
  lastLoginAttempt?: Date | null;
}

const userSchema: Schema = new Schema({
  // const userSchema = new mongoose.Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'firstName is required'],
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: [true, 'lastName is required'],
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    maxLength: 250,
  },
  username: {
    type: String,
    required: [true, 'username is required'],
    unique: true,
    maxLength: 50,
  },
  mobileCountryCode: {
    type: String,
    default: '+91',
  },
  mobile: {
    type: String,
    required: [true, 'mobile is required'],
    unique: true,
    maxLength: 15,
  },
  password: {
    type: String,
  },
  profileImage: String,
  role: {
    type: String,
    enum: ['User', 'Manager', 'Admin'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  }
}, {
  timestamps: true,
});

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const hashedPassword = await securePassword(this.password);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.error(error);
  }
});
export default mongoose.model<IUser>('Users', userSchema);
