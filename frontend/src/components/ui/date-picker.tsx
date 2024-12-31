"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, LucideProps, X } from "lucide-react";

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
  className?: string;
  clearIconClassName?: string;
  date: string | undefined | null;
  onDateChange: (date: string | undefined | null) => void;
  minDate?: string | null;
  maxDate?: string | null;
  isClearable?: boolean;
  disabled?: boolean;
  placeholder?: string;
  Icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  tooltipHeading?: string;
  size?: "verySmall" | "sm" | "default" | "lg";
}

export function DatePicker({
  date,
  onDateChange,
  minDate,
  maxDate,
  placeholder = "",
  disabled = false,
  className = "",
  clearIconClassName = "",
  isClearable = true,
  Icon = CalendarIcon,
  tooltipHeading = "Date Picker",
  size = "default",
}: DatePickerProps) {
  const isDateSelected = date && date.toString().trim() !== "";

  return (
    <Popover>
      <Tooltip
        tooltipHeading={tooltipHeading}
        tooltipContent={date ? format(date, "PPP") : "None"}
        position="top"
      >
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            size={size}
            className={cn(
              "w-fit justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className,
            )}
          >
            <Icon className="mr-1 h-3 w-3" />
            {date ? format(date, "PP") : <span>{placeholder}</span>}

            {isClearable && !disabled && isDateSelected && (
              <X
                className={cn("h-2.5 w-2.5 flex-shrink-0", clearIconClassName)}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDateChange(null);
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
      </Tooltip>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date ? new Date(date) : undefined}
          onSelect={(day) => onDateChange(day ? day.toISOString() : undefined)}
          initialFocus
          disabled={(day) =>
            (minDate && day < new Date(minDate)) ||
            (maxDate && day > new Date(maxDate)) ||
            false
          }
        />
      </PopoverContent>
    </Popover>
  );
}
