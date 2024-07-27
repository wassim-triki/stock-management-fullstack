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

// utils/dateUtils.ts

/**
 * Formats a date to MM/DD/YYYY
 * @param dateString The date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

/**
 * Formats a date to "time ago"
 * @param dateString The date string to format
 * @returns Formatted "time ago" string
 */
export const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
};
