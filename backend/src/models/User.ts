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
      required: [true, "Password can't be blank"],
      select: false, // Prevent password from being returned in queries
      minlength: [6, 'Please use a minimum of 6 characters'],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Email can't be blank"],
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Please use a valid email address',
      ],
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
    resetPasswordExpire: { type: Date }, // Updated to use Date instead of String
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
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords during login
UserSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate signed JWT token
UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Method to generate password reset token and expire date
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash the token and store it in the database
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expiration time (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Export the User model
export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
