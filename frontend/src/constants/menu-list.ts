import { Role, ROLES } from "@/lib/types";
import {
  LayoutGrid,
  Users,
  Settings,
  PackageOpen,
  Truck,
  HandCoins,
  Layers,
  ShoppingCart,
  Store,
  LucideIcon,
} from "lucide-react";

export type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon?: LucideIcon;
  roles?: Role[]; // Optional roles for submenus
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[]; // Allow submenus to be optional
  roles?: Role[]; // Optional roles for individual menus
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
  roles?: Role[]; // Optional roles for the entire group
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
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "/dashboard/clients",
          label: "Clients",
          active: pathname.includes("/clients"),
          icon: Users,
          submenus: [],
        },
        {
          href: "/dashboard/suppliers",
          label: "Suppliers",
          active: pathname.includes("/suppliers"),
          icon: Truck,
          submenus: [],
        },
        {
          label: "Invoices",
          href: "/dashboard/invoices",
          active: pathname.includes("/invoices"),
          icon: HandCoins,
          submenus: [],
        },
        {
          href: "/dashboard/products",
          label: "Products",
          active: pathname === "/dashboard/products",
          icon: PackageOpen,
          submenus: [],
        },
        {
          href: "/dashboard/categories",
          label: "Categories",
          active: pathname === "/dashboard/categories",
          icon: Layers,
          submenus: [],
        },
        {
          href: "/dashboard/purchase-orders",
          label: "Purchase Orders",
          active: pathname.includes("/purchase-orders"),
          icon: ShoppingCart,
          submenus: [],
        },
      ],
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    {
      groupLabel: "Admin",
      menus: [
        {
          href: "/dashboard/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: [],
          roles: [ROLES.ADMIN], // Only Admins should see this
        },
        {
          href: "/dashboard/companies",
          label: "Companies",
          active: pathname.includes("/companies"),
          icon: Store,
          submenus: [],
          roles: [ROLES.ADMIN], // Only Admins should see this
        },
      ],
      roles: [ROLES.ADMIN],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/dashboard/settings/my-company",
          label: "My Company",
          active: pathname.includes("/my-company"),
          icon: Store,
          roles: [ROLES.MANAGER], // Only Managers
          submenus: [],
        },
        {
          href: "/dashboard/settings/account",
          label: "Account",
          active: pathname.includes("/account"),
          icon: Settings,
          roles: [ROLES.ADMIN, ROLES.MANAGER], // Available to all roles
          submenus: [],
        },
      ],
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
  ];

  // Filter the menu based on the user's role
  return menuList
    .filter((group) => {
      // Return groups that have roles undefined (visible to all) or match the user's role
      return !group.roles || group.roles.includes(role);
    })
    .map((group) => ({
      ...group,
      menus: group.menus.filter((menu) => {
        // Check if the menu has roles and if the user's role matches or if no roles are defined
        return !menu.roles || menu.roles.includes(role);
      }),
    }))
    .filter((group) => group.menus.length > 0); // Remove groups that have no visible menus after filtering
}
