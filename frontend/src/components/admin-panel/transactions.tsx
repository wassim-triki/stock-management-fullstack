"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InvoiceType } from "@/lib/types";
import { formatCurrency, getInitials } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { Ban, Rabbit, TicketX } from "lucide-react";
import { format } from "path";
import { ScrollArea } from "../ui/scroll-area";
export type Transaction = {
  party: any;
  type: InvoiceType;
  amount: number;
};
interface TransactionsProps {
  transactions: Transaction[];
}
export function Transactions({ transactions }: TransactionsProps) {
  const { currency } = useAuth();
  return (
    <ScrollArea className="h-full">
      <div className="max-h-[300px] space-y-8">
        {transactions.length ? (
          [...transactions].map((tx, idx) => (
            <div key={idx} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{getInitials(tx.party.name)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {tx.party.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tx.party.email}
                </p>
              </div>
              <div
                className={`ml-auto font-medium ${tx.type === InvoiceType.Supplier && "text-red-500"} `}
              >
                {tx.type === InvoiceType.Client ? "+" : "-"}{" "}
                {currency && formatCurrency(tx.amount, currency)}
              </div>
            </div>
          ))
        ) : (
          <div className="grid h-full place-content-center py-[25%]">
            <Rabbit className="h-14 w-14 text-muted-foreground/80" />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
