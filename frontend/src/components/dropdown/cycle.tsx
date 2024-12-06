import { ReactNode, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
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

export interface CycleDropdownProps {
  button?: ReactNode;
  dropdownArrow?: boolean;
  dropdownArrowClassName?: string;
  onChange: (val: string) => void;
  projectId: string | undefined;
  value?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
}

const CycleDropdown = ({
  button,
  dropdownArrow = false,
  dropdownArrowClassName,
  onChange,
  projectId,
  value,
  className,
  size = "sm",
}: CycleDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { workspaceSlug } = useParams();
  const { cycles, fetchCycles, getCycleById } = useCycleStore();

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

  const handleSelect = (currentValue: string) => {
    onChange(currentValue);
    setIsOpen(false);
  };

  const renderButton = () => {
    return (
      <Button variant="outline" size={size} className={cn("p-1", className)}>
        {selectedCycle ? (
          <span className="flex items-center gap-1">
            <span className="flex-grow truncate">{selectedCycle.title}</span>
          </span>
        ) : (
          "Select a cycle..."
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
