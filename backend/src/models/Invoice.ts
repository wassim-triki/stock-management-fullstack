import mongoose, { Schema, Model } from 'mongoose';
import { IInvoice } from '../types/types';

export enum InvoiceType {
  Supplier = 'Supplier',
  Client = 'Client',
}

export enum PaymentStatus {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
  PARTIALLY_PAID = 'Partially Paid',
  OVERDUE = 'Overdue',
}

const InvoiceSchema: Schema = new Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
    },
    purchaseOrder: {
      type: Schema.Types.ObjectId,
      ref: 'PurchaseOrder',
      // required: true,
    },
    invoiceType: {
      type: String,
      enum: InvoiceType,
      required: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Reference to manager handling the invoice
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
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
    paymentDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Pre-save hook for invoice number generation, if necessary

export const Invoice: Model<IInvoice> = mongoose.model<IInvoice>(
  'Invoice',
  InvoiceSchema
);
