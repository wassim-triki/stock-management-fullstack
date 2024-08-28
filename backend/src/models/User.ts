import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IUser } from '../types/types';
import { Company } from './Company'; // Import the Company model
const currencies = require('../utils/currencies.json');
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
    profile: {
      firstName: { type: String },
      lastName: { type: String },
      address: { type: String },
      currency: {
        symbol: { type: String, default: currencies.USD.symbol },
        name: { type: String, default: currencies.USD.name },
        code: { type: String, default: currencies.USD.code },
        locale: { type: String, default: currencies.USD.locale },
      },
    },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: String },
    role: {
      type: String,
      enum: ROLES,
      default: ROLES.MANAGER,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company', // Reference to the Company model
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

// Password hashing
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

// Methods for user actions
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

// Export the User model
export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
