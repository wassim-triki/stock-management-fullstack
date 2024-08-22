// components/SingleDatePicker.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import * as React from "react";

interface SingleDatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedDate?: Date;
  onDateChange?: (date: Date | undefined) => void;
  fromDate?: Date;
}

export function SingleDatePicker({
  className,
  selectedDate,
  onDateChange,
  fromDate,
}: SingleDatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(selectedDate);

  React.useEffect(() => {
    if (onDateChange) {
      onDateChange(date);
    }
  }, [date]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "ws-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "LLL dd, y") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="single"
            fromDate={fromDate}
            selected={date}
            onSelect={setDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
