import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(fullName: string): string {
  if (!fullName) return "";

  const names = fullName.split(" ");
  let initials = "";

  for (const name of names) {
    if (name && name[0]) {
      initials += name[0].toUpperCase();
    }
  }

  return initials;
}
