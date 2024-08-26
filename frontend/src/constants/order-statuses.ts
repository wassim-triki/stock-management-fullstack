import { OrderStatuses } from "@/lib/types";
import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { CircleDashedIcon } from "lucide-react";

export const OrderStatusesWithIcons = [
  {
    name: OrderStatuses.Draft,
    icon: CircleDashedIcon,
  },
  {
    name: OrderStatuses.Pending,
    icon: StopwatchIcon,
  },
  {
    name: OrderStatuses.Accepted,
    icon: CircleIcon,
  },
  {
    name: OrderStatuses.Delivered,
    icon: CheckCircledIcon,
  },
  {
    name: OrderStatuses.Canceled,
    icon: CrossCircledIcon,
  },
];
