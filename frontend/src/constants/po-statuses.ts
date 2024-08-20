import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { CircleDashedIcon } from "lucide-react";

export const PO_STATUSES = [
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
  {
    name: "Canceled",
    icon: CrossCircledIcon,
  },
];
