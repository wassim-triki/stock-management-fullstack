import { Role, ROLES } from "@/lib/types";
import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Package,
  Container,
  PackageOpen,
  ShoppingCart,
  Layers,
  Boxes,
  Truck,
  ScrollText,
  Store,
} from "lucide-react";

export type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon?: LucideIcon;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
  roles?: string[];
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string, role: Role): Group[] {
  const menuList: Group[] = [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "/dashboard/suppliers",
          label: "Suppliers",
          active: pathname.includes("/suppliers"),
          icon: Truck,
          submenus: [],
          // Only Admins should see this
          roles: [ROLES.ADMIN, ROLES.MANAGER],
        },
        {
          label: "Invoices",
          href: "/dashboard/invoices",
          active: pathname.includes("/invoices"),
          icon: ScrollText,
          submenus: [],
          // Available to both Admin and Manager roles
          roles: [ROLES.ADMIN, ROLES.MANAGER],
        },
        {
          href: "/dashboard/products",
          label: "Products",
          active: pathname === "/dashboard/products",
          icon: PackageOpen,
          submenus: [],
          // Available to both Admin and Manager roles
          roles: [ROLES.ADMIN, ROLES.MANAGER],
        },
        {
          href: "/dashboard/categories",
          label: "Categories",
          active: pathname === "/dashboard/categories",
          icon: Layers,
          submenus: [],
          // Available to Admins only
          roles: [ROLES.ADMIN, ROLES.MANAGER],
        },
        {
          href: "/dashboard/purchase-orders",
          label: "Purchase Orders",
          active: pathname.includes("/purchase-orders"),
          icon: ShoppingCart,
          submenus: [],
          // Available to both Admin and Manager roles
          roles: [ROLES.ADMIN, ROLES.MANAGER],
        },
        {
          href: "/dashboard/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: [],
          // Only Admins should see this
          roles: [ROLES.ADMIN],
        },
        {
          href: "/dashboard/companies",
          label: "Companies",
          active: pathname.includes("/companies"),
          icon: Store,
          submenus: [],
          // Only Admins should see this
          roles: [ROLES.ADMIN],
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/dashbaord/settings/my-company",
          label: "My Company",
          active: pathname.includes("/my-company"),
          icon: Store,
          submenus: [],
          // Available to all roles
          roles: [ROLES.MANAGER],
        },
        {
          href: "/dashboard/settings/account",
          label: "Account",
          active: pathname.includes("/account"),
          icon: Settings,
          submenus: [],
          // Available to all roles
          roles: [ROLES.ADMIN, ROLES.MANAGER],
        },
      ],
    },
  ];

  // Filter the menu based on the user's role
  return menuList.map((group) => ({
    ...group,
    menus: group.menus.filter((menu) => menu.roles?.includes(role)),
  }));
}
