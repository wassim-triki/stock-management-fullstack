import mongoose, { Model, Schema } from 'mongoose';
import { IInvoice } from '../types/types';

export enum PaymentStatus {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
  PARTIALLY_PAID = 'Partially Paid',
  OVERDUE = 'Overdue',
}

export enum InvoiceType {
  SUPPLIER = 'Supplier',
  CLIENT = 'Client',
}

const SupplierInvoiceSchema: Schema = new Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
    },
    purchaseOrder: {
      type: Schema.Types.ObjectId,
      ref: 'PurchaseOrder',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the manager who owns this invoice
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    paymentDate: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: PaymentStatus,
      default: PaymentStatus.UNPAID,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    // New field to determine if the invoice is for a client or a supplier
    invoiceType: {
      type: String,
      enum: InvoiceType,
      required: true,
    },
    // Either client or supplier, based on invoiceType
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
    },
  },
  { timestamps: true }
);

export const SupplierInvoice: Model<IInvoice> = mongoose.model<IInvoice>(
  'SupplierInvoice',
  SupplierInvoiceSchema
);
