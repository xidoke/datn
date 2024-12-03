"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, LucideProps } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip } from "./tooltip-plane";

interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  Icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  tooltipHeading?: string;
}

export function DatePicker({
  date,
  onDateChange,
  minDate,
  maxDate,
  placeholder = "",
  Icon = CalendarIcon,
  tooltipHeading = "Date Picker",
}: DatePickerProps) {
  return (
    <Popover>
      <Tooltip
        tooltipHeading={tooltipHeading}
        tooltipContent={date ? format(date, "PPP") : "None"}
        position="top"
        className="bg-primary"
      >
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            size={"sm"}
            className={cn(
              "w-fit justify-start text-left font-normal mr-2",
              !date && "text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {date ? format(date, "PP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
      </Tooltip>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          disabled={(day) =>
            (minDate && day < minDate) || (maxDate && day > maxDate) || false
          }
        />
      </PopoverContent>
    </Popover>
  );
}
