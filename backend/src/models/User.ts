import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { model, Schema, Model, Document } from 'mongoose';

// Declare point type
export interface IPoint extends Document {
  type: string;
  coordinates: number[];
}

// Generate point schema
const PointSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

// Declare user type
export interface IUser extends Document {
  generateAuthToken(): string;
  getResetPasswordToken(): string;
  getSignedToken(): string;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: string | undefined;
  matchPassword(password: string): boolean | PromiseLike<boolean>;
  username: string;
  password: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar: string;
    bio: string;
    phone: string;
    gender: string;
    address: {
      street1: string;
      street2: string;
      city: string;
      state: string;
      country: string;
      zip: string;
      location: IPoint;
    };
  };
  active: boolean;
}

// Define user schema
const UserSchema: Schema = new Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Can't be blank"],
    index: true,
  },
  password: {
    type: String,
    required: [true, "Can't be blank"],
    select: false,
    minlength: [8, 'Please use a minimum of 8 characters'],
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "Can't be blank"],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please use a valid address'],
    unique: true,
    index: true,
  },
  profile: {
    firstName: { type: String },
    lastName: { type: String },
    avatar: { type: String },
    bio: { type: String },
    phone: { type: String },
    gender: { type: String },
    address: {
      street1: { type: String },
      street2: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zip: { type: String },
      location: { type: PointSchema },
    },
  },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: String },
  active: { type: Boolean, default: true },
});

UserSchema.pre<IUser>('save', async function (next: any) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

UserSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
  return resetToken;
};

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};

export const User: Model<IUser> = model<IUser>('User', UserSchema);
