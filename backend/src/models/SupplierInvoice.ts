import mongoose, { Model, Schema } from 'mongoose';
import { ISupplierInvoice } from '../types/types';

export enum PaymentStatus {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
  PARTIALLY_PAID = 'Partially Paid',
  OVERDUE = 'Overdue',
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
      ref: 'User', // Reference to the manager who owns this product
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
  },
  { timestamps: true }
);
export const SupplierInvoice: Model<ISupplierInvoice> =
  mongoose.model<ISupplierInvoice>('SupplierInvoice', SupplierInvoiceSchema);
