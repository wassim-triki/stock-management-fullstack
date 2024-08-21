// models/User.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IUser } from '../types/types';

export enum ROLES {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  USER = 'User',
}

export type Role = ROLES.ADMIN | ROLES.MANAGER | ROLES.USER;
// Define the User schema
const UserSchema: Schema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Can't be blank"],
      select: false,
      minlength: [6, 'Please use a minimum of 6 characters'],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Can't be blank"],
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please use a valid address'],
      unique: true,
      index: true,
    },
    company: {
      name: { type: String },
      logo: { type: String },
      address: { type: String },
      website: { type: String },
      phone: { type: String },
      email: {
        type: String,
        lowercase: true,
        match: [
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          'Please use a valid address',
        ],
      },
    },
    profile: {
      // firstName: { type: String },
      // lastName: { type: String },
      // phone: { type: String },
      address: { type: String },
    },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: String },
    role: {
      type: String,
      enum: ROLES,
      default: ROLES.MANAGER,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.pre<IUser>('save', async function (next) {
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
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
