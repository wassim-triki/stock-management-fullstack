import { Icons } from "../components/icons";
export type Option = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export interface DataTableSearchableColumn<TData> {
  id: keyof TData;
  title: string;
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: Option[];
}

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}
// Define the Role type
export type Role = "Manager" | "Admin" | "User";

// Define role constants
export const ROLES = {
  MANAGER: "Manager" as Role,
  ADMIN: "Admin" as Role,
  USER: "User" as Role,
};

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

export type Company = {
  _id: string;
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
};
export type Currency = {
  name: string;
  symbol: string;
  code: string;
  locale: string;
};
export type User = {
  _id: string;
  password?: string;
  email: string;
  company?: Company;
  profile: {
    firstName: string;
    lastName: string;
    currency: Currency;
    address: string;
  };
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
};

export type Supplier = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
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
  user: User;
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

export enum OrderStatuses {
  Pending = "Pending",
  Accepted = "Accepted",
  Delivered = "Delivered",
  Draft = "Draft",
  Canceled = "Canceled",
}
export enum OrderType {
  Supplier = "Supplier",
  Client = "Client",
}
export enum InvoiceType {
  Supplier = "Supplier",
  Client = "Client",
}

export enum PaymentStatus {
  PAID = "Paid",
  UNPAID = "Unpaid",
  PARTIALLY_PAID = "Partially Paid",
  OVERDUE = "Overdue",
}

export type OrderStatus = keyof typeof OrderStatuses;

export const orderStatuses = Object.keys(OrderStatuses) as OrderStatus[];

export type PurchaseOrder = {
  _id: string;
  orderNumber: number;
  supplier?: Supplier;
  client?: Client;
  orderType: OrderType;
  orderDate: Date;
  status: OrderStatuses;
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

export type Invoice = {
  _id: string;
  invoiceNumber: string;
  purchaseOrder: PurchaseOrder;
  totalAmount: number;
  paidAmount: number;
  paymentDate: Date;
  paymentStatus: PaymentStatus;
  dueDate: Date;
  invoiceType: InvoiceType;
  client: Client;
  supplier: Supplier;
  createdAt: Date;
  updatedAt: Date;
};

export type Client = {
  _id: string;
  name: string;
  email: string;
  user: User;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
};
