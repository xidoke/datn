import { ReactNode, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown, RefreshCcw } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Spinner } from "../ui/spinner";
import { useCycleStore } from "@/stores/cycleStore"; // Assume this is a store for managing cycles
import { cn } from "@/lib/utils";
import { TDropdownProps } from "./type";

export interface CycleDropdownProps extends TDropdownProps {
  button?: ReactNode;
  dropdownArrow?: boolean;
  dropdownArrowClassName?: string;
  onChange: (val: string | null) => void;
  projectId: string | undefined;
  value?: string | null;
  size?: "sm" | "default" | "lg" | "icon";
}

const CycleDropdown = ({
  button,
  dropdownArrow = false,
  dropdownArrowClassName,
  onChange,
  projectId,
  value,
  className,
  size = "default",
  placeholder = "Cycle",
}: CycleDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { workspaceSlug } = useParams();
  const { cyclesMap: cycles, fetchCycles, getCycleById } = useCycleStore();

  // convert cycle map to cycle list
  const cyclesList = cycles ? Object.values(cycles) : [];
  const selectedCycle = value ? getCycleById(value) : undefined;

  useEffect(() => {
    const fetchData = async () => {
      if (!cycles && workspaceSlug && projectId) {
        setLoading(true);
        await fetchCycles(workspaceSlug.toString(), projectId);
        setLoading(false);
      }
    };

    if (projectId) fetchData();
  }, [projectId, workspaceSlug, fetchCycles, cycles]);

  const handleSelect = (currentValue: string | null) => {
    onChange(currentValue);
    setIsOpen(false);
  };

  const renderButton = () => {
    switch (size) {
      case "default":
        return (
          <Button
            variant="outline"
            size={size}
            className={cn("p-1 text-muted-foreground", className)}
          >
            {selectedCycle ? (
              <span className="flex items-center gap-1">
                <span className="flex-grow truncate">
                  {selectedCycle.title}
                </span>
              </span>
            ) : (
              placeholder
            )}
            {dropdownArrow && (
              <ChevronsUpDown
                className={cn(
                  "ml-2 h-4 w-4 shrink-0 opacity-50",
                  dropdownArrowClassName,
                )}
              />
            )}
          </Button>
        );
      case "sm":
        return (
          <Button
            variant="outline"
            size={size}
            className={cn("p-1 text-muted-foreground", className)}
          >
            {selectedCycle ? (
              <span className="flex items-center gap-1">
                <span className="flex-grow truncate">
                  {selectedCycle.title}
                </span>
              </span>
            ) : (
              placeholder
            )}
            {dropdownArrow && (
              <ChevronsUpDown
                className={cn(
                  "ml-2 h-4 w-4 shrink-0 opacity-50",
                  dropdownArrowClassName,
                )}
              />
            )}
          </Button>
        );
      case "icon":
        return (
          <Button
            variant="outline"
            size="icon"
            className={cn("h-5 w-fit p-1", className)}
          >
            <div className="flex items-center">
              <RefreshCcw className="h-3 w-3" />
            </div>
            {selectedCycle ? (
              <span className="ml-1 flex items-center gap-1 text-xs font-light">
                <span className="max-w-28 flex-grow truncate">
                  {selectedCycle.title}
                </span>
              </span>
            ) : (
              ""
            )}
            {dropdownArrow && (
              <ChevronsUpDown
                className={cn(
                  "ml-2 h-4 w-4 shrink-0 opacity-50",
                  dropdownArrowClassName,
                )}
              />
            )}
          </Button>
        );
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{button || renderButton()}</PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        {loading ? (
          <div className="flex h-24 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <Command>
            <CommandInput className="text-xs" placeholder="Search cycle..." />
            <CommandList>
              <CommandEmpty>No cycle found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  key="no_cycle"
                  value="no_cycle"
                  onSelect={() => handleSelect(null)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-3 w-3",
                      value === null ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="flex-grow truncate text-xs">No cycle</span>
                </CommandItem>
                {cyclesList?.map((cycle) => (
                  <CommandItem
                    key={cycle.id}
                    value={cycle.title}
                    onSelect={() => handleSelect(cycle.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3 w-3",
                        cycle.id === value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="flex-grow truncate text-xs">
                      {cycle.title}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
};

export { CycleDropdown };
