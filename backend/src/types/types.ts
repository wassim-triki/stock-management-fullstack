import mongoose, { Document } from 'mongoose';
import { Role } from '../utils/constants';
import config from '../config/config';

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

export enum HttpCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
export class ErrorResponse extends Error {
  success: boolean;
  data: [];
  statusCode: HttpCode;
  stack?: string | undefined;

  constructor(message: string, statusCode: HttpCode) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.data = [];
    this.stack = config.environment === 'production' ? undefined : this.stack;
  }
}

export type User = {
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
};

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
export interface IPurchaseOrder extends Document {
  orderNumber: string;
  supplier: ISupplier;
  orderDate: Date;
  status: string;
  orderTotal: number;
  items: IPurchaseOrderItem[];
  createdAt: Date;
  updatedAt: Date;
  vat: number;
  subTotal: number;
}
export interface IPurchaseOrderItem {
  product: IProduct;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface ISupplier extends Document {
  name: string;
  email: string;
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

export interface ICategory extends Document {
  name: string;
  parentCategory?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
export interface IProduct extends Document {
  name: string;
  category: mongoose.Types.ObjectId;
  supplier: string;
  description?: string;
  quantityInStock: number;
  // reorderLevel: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
