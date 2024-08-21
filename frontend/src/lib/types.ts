import { Icons } from "../components/icons";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export type ApiErrorResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  data: [];
};
export type ApiSuccessResponse<T = {}> = {
  success: boolean;
  message: string;
  data: T;
};

export type ApiSuccessResponseList<T> = {
  success: boolean;
  message: string;
  data: { total: number; items: T[] };
};

export type User = {
  _id: string;
  password: string;
  email: string;
  company: {
    name: string;
    address: string;
    phone: string;
    logo: string;
    email: string;
    website: string;
  };
  profile: {
    // firstName: string;
    // lastName: string;
    // phone: string;
    address: string;
  };
  role: string;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
};

export type Supplier = {
  _id: string;
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
};
export type Product = {
  _id: string;
  name: string;
  category: Category;
  supplier: Supplier;
  description?: string;
  price: number;
  quantityInStock: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  _id: string;
  name: string;
  parentCategory?: Category;
  createdAt: Date;
  updatedAt: Date;
};

export type ApiSearchFilter = {
  page?: number;
  limit?: number;
  search?: string;
  noFilters?: boolean;
};

export type POStatus =
  | "Pending"
  | "Accepted"
  | "Received"
  | "Draft"
  | "Canceled";

export type PurchaseOrder = {
  _id: string;
  orderNumber: number;
  supplier: Supplier;
  orderDate: Date;
  status: POStatus;
  items: {
    product: Product;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  orderTotal: number;
  subTotal: number;
  vat: number;
  createdAt: Date;
  updatedAt: Date;
};

export type QueryParams = {
  limit?: number;
  offset?: number;
  [key: string]: string | undefined | number;
};

export type SupplierInvoice = {
  _id: string;
  invoiceNumber: string;
  purchaseOrder: PurchaseOrder;
  totalAmount: number;
  paidAmount: number;
  paymentDate?: Date;
  paymentStatus: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
};
