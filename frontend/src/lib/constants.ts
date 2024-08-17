import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { CircleDashedIcon } from "lucide-react";

export const queryKeys = {
  users: "users",
  suppliers: "suppliers",
  totalSuppliers: "totalSuppliers",
  totalUsers: "totalUsers",
  auth: "auth",
  categories: "categories",
  totalCategoreis: "totalCategoreis",
  products: "products",
  totalProducts: "totalProducts",
  purchaseOrders: "purchaseOrders",
  totalPurchaseOrders: "totalPurchaseOrders",
};

export const PO_STATUSES = [
  // {
  //   value: "backlog",
  //   label: "Backlog",
  //   icon: QuestionMarkCircledIcon,
  // },
  {
    name: "Draft",
    icon: CircleDashedIcon,
  },
  {
    name: "Pending",
    icon: StopwatchIcon,
  },
  {
    name: "Accepted",
    icon: CircleIcon,
  },
  {
    name: "Received",
    icon: CheckCircledIcon,
  },
  // {
  //   name: "Canceled",
  //   icon: CrossCircledIcon,
  // },
];

export const ROLES = [
  { _id: "admin", name: "Admin" },
  // { _id: "user", name: "pants" },
  { _id: "manager", name: "Manager" },
];
