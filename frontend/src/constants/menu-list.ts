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
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
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
        },
        {
          href: "#",
          label: "Stock",
          active: pathname.includes("/stock"),
          icon: Boxes,
          submenus: [
            {
              href: "/dashboard/stock/products",
              label: "Products",
              active: pathname === "/dashboard/stock/products",
              icon: PackageOpen,
            },
            {
              href: "/dashboard/stock/categories",
              label: "Categories",
              active: pathname === "/dashboard/stock/categories",
              icon: Layers,
            },
            // {
            //   href: "/posts/new",
            //   label: "New Post",
            //   active: pathname === "/posts/new"
            // }
          ],
        },
        {
          href: "/dashboard/purchase-orders",
          label: "Purchase Orders",
          active: pathname.includes("/purchase-orders"),
          icon: ShoppingCart,
          submenus: [],
        },

        // {
        //   href: "",
        //   label: "Posts",
        //   active: pathname.includes("/posts"),
        //   icon: SquarePen,
        //   submenus: [
        //     // {
        //     //   href: "/posts",
        //     //   label: "All Posts",
        //     //   active: pathname === "/posts"
        //     // },
        //     // {
        //     //   href: "/posts/new",
        //     //   label: "New Post",
        //     //   active: pathname === "/posts/new"
        //     // }
        //   ],
        // },
        // {
        //   href: "/categories",
        //   label: "Categories",
        //   active: pathname.includes("/categories"),
        //   icon: Bookmark,
        //   submenus: [],
        // },
        // {
        //   href: "/tags",
        //   label: "Tags",
        //   active: pathname.includes("/tags"),
        //   icon: Tag,
        //   submenus: [],
        // },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/dashboard/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: [],
        },
        {
          href: "/account",
          label: "Account",
          active: pathname.includes("/account"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
