import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Container,
  Boxes,
  Truck,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
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
          submenus: [
            // {
            //   href: "/posts",
            //   label: "All Posts",
            //   active: pathname === "/posts"
            // },
            // {
            //   href: "/posts/new",
            //   label: "New Post",
            //   active: pathname === "/posts/new"
            // }
          ],
        },
        {
          href: "/dashboard/products",
          label: "Products",
          active: pathname.includes("/products"),
          icon: Boxes,
          submenus: [
            // {
            //   href: "/posts",
            //   label: "All Posts",
            //   active: pathname === "/posts"
            // },
            // {
            //   href: "/posts/new",
            //   label: "New Post",
            //   active: pathname === "/posts/new"
            // }
          ],
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
          href: "/users",
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
