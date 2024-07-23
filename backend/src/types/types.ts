import { Document } from 'mongoose';
import { Role } from '../utils/constants';

// export class SuccessResponse<T> {
//   success: boolean;
//   message: string;
//   data?: T | { total: number; items: T[] };

//   constructor(message: string, data?: T | T[]) {
//     this.success = true;
//     this.message = message;
//     this.data = Array.isArray(data)
//       ? { total: data.length, items: data }
//       : data;
//   }
// }
export class SuccessResponse<T = {}> {
  success: boolean;
  message: string;
  data?: T;

  constructor(message: string, data?: T) {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}
export class SuccessResponseList<T> {
  success: boolean;
  message: string;
  data: { total: number; items: T[] };

  constructor(message: string, items: T[]) {
    this.success = true;
    this.message = message;
    this.data = {
      total: items.length,
      items,
    };
  }
}

export type ApiSuccessResponseList<T> = {
  success: boolean;
  message: string;
  data: { total: number; items: T[] };
};

export class ErrorResponse extends Error {
  success: boolean;
  data: [];
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.data = [];
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
