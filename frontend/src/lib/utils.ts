import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ApiSearchFilter } from "./types";

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

export const buildQueryParams = (filter: ApiSearchFilter): string => {
  const params: string[] = [];

  if (filter.limit) params.push(`limit=${filter.limit}`);
  if (filter.page) params.push(`page=${filter.page}`);
  if (filter.search) params.push(`search=${filter.search}`);
  if (filter.noFilters) params.push(`noFilters=${filter.noFilters}`);

  return params.join("&");
};
