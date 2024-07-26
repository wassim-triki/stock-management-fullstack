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
