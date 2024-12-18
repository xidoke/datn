"use client";

import React, { useState } from "react";
import { Ban, Check, ChevronsUpDown, SignalHigh } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { TIssuePriorities } from "@/types";

const ISSUE_PRIORITIES = [
  { key: "4", title: "Urgent" },
  { key: "3", title: "High" },
  { key: "2", title: "Medium" },
  { key: "1", title: "Low" },
  { key: "0", title: "None" },
];

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

interface PriorityMultiSelectProps {
  selectedPriorities: TIssuePriorities[];
  onChange: (selected: TIssuePriorities[]) => void;
}

const PriorityMultiSelect: React.FC<PriorityMultiSelectProps> = ({
  selectedPriorities,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (priority: TIssuePriorities) => {
    if (selectedPriorities.includes(priority)) {
      onChange(selectedPriorities.filter((p) => p !== priority));
    } else {
      onChange([...selectedPriorities, priority]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[150px] justify-between"
        >
          {selectedPriorities.length > 0
            ? `Priority: ${selectedPriorities.length} selected`
            : "Select Priority..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[150px] p-0">
        <Command>
          <CommandInput placeholder="Search priority..." />
          <CommandList>
            <CommandEmpty>No priority found.</CommandEmpty>
            <CommandGroup>
              {ISSUE_PRIORITIES.map((priority) => (
                <CommandItem
                  key={priority.key}
                  value={priority.title}
                  onSelect={() =>
                    handleSelect(priority.key as TIssuePriorities)
                  }
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedPriorities.includes(
                        priority.key as TIssuePriorities,
                      )
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <PriorityIcon priority={priority.key as TIssuePriorities} />
                    <span>{priority.title}</span>
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

export default PriorityMultiSelect;
