import mongoose, { Document } from 'mongoose';
import config from '../config/config';
import { PaymentStatus } from '../models/Invoice';
import { Role, ROLES } from '../models/User';
import { OrderStatuses, OrderType } from '../models/PurchaseOrder';

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

export interface ICompany extends Document {
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type User = {
  password: string;
  email: string;
  company: mongoose.Types.ObjectId;
  profile: {
    firstName: string;
    lastName: string;
    currency: ICurrency;
    address: string;
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
  company: mongoose.Types.ObjectId;
  profile: {
    firstName: string;
    lastName: string;
    address: string;
    currency: ICurrency;
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
  status: OrderStatuses;
  orderType: OrderType;
  orderTotal: number;
  receiptDate: Date | null;
  items: IPurchaseOrderItem[];
  createdAt: Date;
  user: mongoose.Types.ObjectId;
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
  user: mongoose.Types.ObjectId;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export interface ICategory extends Document {
  name: string;
  parentCategory?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
export interface IProduct extends Document {
  name: string;
  category: mongoose.Types.ObjectId;
  supplier: string;
  description?: string;
  user: mongoose.Types.ObjectId;
  quantityInStock: number;
  // reorderLevel: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  purchaseOrder: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  totalAmount: number;
  paidAmount: number;
  paymentDate: Date;
  paymentStatus: PaymentStatus;
  dueDate: Date;
  client: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClient extends Document {
  name: string;
  email: string;
  user: mongoose.Types.ObjectId;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export interface ICurrency {
  symbol: string;
  name: string;
  code: string;
  locale: string;
}
