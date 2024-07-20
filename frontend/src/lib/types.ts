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
  error: {
    message: string;
    details?: string;
  };
};
export type ApiSuccessResponse = {
  success: boolean;
  payload: {
    message: string;
    data?: object;
  };
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
  _id: number;
  name: string;
  email: string;
  phone: string;
};
export type Product = {
  _id: number;
  name: string;
  price: number;
  description: string;
};
