/**
 * v0 by Vercel.
 * @see https://v0.dev/t/E1J9tn1WSrk
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Component({
  selectedCurrency,
  setSelectedCurrency,
}: {
  selectedCurrency: any;
  setSelectedCurrency: any;
}) {
  const currencies = [
    { name: "United States Dollar", symbol: "USD" },
    { name: "Euro", symbol: "EUR" },
    { name: "Japanese Yen", symbol: "JPY" },
    { name: "British Pound Sterling", symbol: "GBP" },
    { name: "Australian Dollar", symbol: "AUD" },
    { name: "Canadian Dollar", symbol: "CAD" },
    { name: "Swiss Franc", symbol: "CHF" },
    { name: "Chinese Yuan", symbol: "CNY" },
    { name: "Swedish Krona", symbol: "SEK" },
    { name: "New Zealand Dollar", symbol: "NZD" },
  ];
  return (
    <div className="w-full max-w-md">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>
              {selectedCurrency?.symbol} - {selectedCurrency?.name}
            </span>
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          {currencies.map((currency, index) => (
            <DropdownMenuItem
              key={index}
              onSelect={() => setSelectedCurrency(currency)}
              className="flex items-center justify-between"
            >
              <span>
                {currency.symbol} - {currency.name}
              </span>
              {selectedCurrency?.symbol === currency.symbol && (
                <CheckIcon className="h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function CheckIcon(props: { className: string }) {
  const { className } = props;
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ChevronDownIcon(props: { className: string }) {
  const { className } = props;
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
