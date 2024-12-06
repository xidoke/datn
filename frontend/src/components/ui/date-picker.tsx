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
  date: string | undefined;
  onDateChange: (date: string| undefined) => void;
  minDate?: string;
  maxDate?: string;
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
  Icon = CalendarIcon,
  tooltipHeading = "Date Picker",
  size = "default"
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
            size={size}
            className={cn(
              "w-fit justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <Icon className="h-3 w-3 mr-1" />
            {date ? format(date, "PP") : <span>{placeholder}</span>}
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
            (minDate && day < new Date(minDate)) || (maxDate && day > new Date(maxDate)) || false
          }
        />
      </PopoverContent>
    </Popover>
  );
}
