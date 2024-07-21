import { Document } from 'mongoose';
import { Role } from '../utils/constants';

// utils/response.ts
export class SuccessResponse<T> {
  success: boolean;
  payload: {
    message: string;
    data?: T;
  };

  constructor(message: string, data?: T) {
    this.success = true;
    this.payload = { message, data };
  }
}

export class ErrorResponse extends Error {
  success: boolean;
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    if (details) {
      this.details = details;
    }
  }
}

export interface IUser extends Document {
  getResetPasswordToken(): string;
  getSignedToken(): string;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: string | undefined;
  matchPassword(password: string): boolean | PromiseLike<boolean>;
  password: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export interface ISupplier extends Document {
  companyName: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}
