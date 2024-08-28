import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Currency, QueryParams } from "./types";

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

export const buildQueryParamsString = (
  queryParams: QueryParams | undefined,
): string => {
  if (!queryParams) return "";
  const params: string[] = [];

  Object.keys(queryParams).forEach((key) => {
    const value = queryParams[key];
    if (value !== undefined) {
      params.push(`${key}=${value}`);
    }
  });

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

  if (seconds === 0) {
    return "Now";
  }

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

// Declare 'capitalize' method on 'String' interface
interface String {
  capitalize(): string;
}

// Add 'capitalize' method to 'String' prototype
export const capitalize = function (string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export function getDirtyValues<
  DirtyFields extends Record<string, unknown>,
  Values extends Partial<Record<keyof DirtyFields, unknown>>,
>(dirtyFields: DirtyFields, values: Values): Partial<Values> {
  const dirtyValues = Object.keys(dirtyFields).reduce((prev, key) => {
    // Unsure when RFH sets this to `false`, but omit the field if so.
    if (!dirtyFields[key]) return prev;

    return {
      ...prev,
      [key]:
        typeof dirtyFields[key] === "object"
          ? getDirtyValues(
              dirtyFields[key] as DirtyFields,
              values[key] as Values,
            )
          : values[key],
    };
  }, {});

  return dirtyValues;
}

export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    currencyDisplay: "code",
  }).format(amount);
}
