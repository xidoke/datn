"use client";

import { ReactNode, useState } from "react";
import { TDropdownProps } from "./type";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Ban, Check, ChevronsUpDown, SignalHigh } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { TIssuePriorities } from "@/types";

// Define the priority options
const ISSUE_PRIORITIES = [
  { key: "4", title: "Urgent" },
  { key: "3", title: "High" },
  { key: "2", title: "Medium" },
  { key: "1", title: "Low" },
  { key: "0", title: "None" },
];

export interface PriorityDropdownProps extends TDropdownProps {
  button?: ReactNode;
  dropdownArrow?: boolean;
  dropdownArrowClassName?: string;
  highlightUrgent?: boolean;
  onChange: (val: TIssuePriorities) => void;
  value: TIssuePriorities | undefined | null;
}

const PriorityIcon = ({ priority }: { priority: TIssuePriorities }) => {
  switch (priority) {
    case "4":
      return <SignalHigh className="h-3 w-3 text-red-600" />;
    case "3":
      return <SignalHigh className="h-3 w-3 text-orange-500" />;
    case "2":
      return <SignalHigh className="h-3 w-3 text-yellow-500" />;
    case "1":
      return <SignalHigh className="h-3 w-3 text-blue-500" />;
    default:
      return <Ban className="h-3 w-3 text-gray-400" />;
  }
};

const PriorityDropdown = (props: PriorityDropdownProps) => {
  const {
    button,
    dropdownArrow = false,
    dropdownArrowClassName,
    highlightUrgent = true,
    onChange,
    value,
    className,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const selectedPriority = ISSUE_PRIORITIES.find((p) => p.key === value);

  const handleSelect = (currentValue: TIssuePriorities) => {
    onChange(currentValue);
    setIsOpen(false);
  };

  const priorityClasses = {
    4: "bg-red-600/10 text-red-600 border-red-600 hover:bg-red-600/20 hover:text-red-600",
    3: "bg-orange-500/20 text-orange-500 border-orange-500 hover:bg-orange-600/40 hover:text-orange-500",
    2: "bg-yellow-500/20 text-yellow-500 border-yellow-500 hover:bg-yellow-500/40 hover:text-yellow-500",
    1: "bg-blue-500/20 text-blue-500 border-blue-500 hover:bg-blue-500/40 hover:text-blue-500",
    0: "bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200 hover:text-gray-600",
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {button ? (
          button
        ) : (
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "p-1",
              priorityClasses[value ?? "0"],
              {
                "border-red-600 bg-red-600/10":
                  value === "4" && highlightUrgent,
              },
              className,
            )}
          >
            <div className="flex items-center gap-1">
              <PriorityIcon priority={value ?? "0"} />
              {selectedPriority?.key === "0" ? null : (
                <span className="flex-grow truncate">
                  {selectedPriority?.title ?? "select priority"}
                </span>
              )}
            </div>
            {dropdownArrow && (
              <ChevronsUpDown
                className={cn(
                  "ml-2 h-4 w-4 shrink-0 opacity-50",
                  dropdownArrowClassName,
                )}
              />
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput className="text-xs" placeholder="Search priority..." />
          <CommandList>
            <CommandEmpty>No priority found.</CommandEmpty>
            <CommandGroup>
              {ISSUE_PRIORITIES.map((priority) => (
                <CommandItem
                  key={priority.key}
                  value={priority.key}
                  onSelect={() =>
                    handleSelect(priority.key as TIssuePriorities)
                  }
                >
                  <Check
                    className={cn(
                      "mr-2 h-3 w-3",
                      priority.key === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <PriorityIcon priority={priority.key as TIssuePriorities} />
                    <span className="flex-grow truncate text-xs">
                      {priority.title}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { PriorityDropdown };
