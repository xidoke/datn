import React, { useState } from "react";
import {
  CalendarCheck2,
  CalendarClock,
  Check,
  ChevronRight,
  ChevronsUpDown,
  Filter,
} from "lucide-react";
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
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/stores/filterStore";
import { Label, State, TIssuePriorities } from "@/types";
import { ISSUE_PRIORITIES } from "@/helpers/constants/issue";
import { CycleGroupIcon, PriorityIcon, StateGroupIcon } from "../icons";
import { useProjectStateStore } from "@/stores/projectStateStore";
import { useProjectLabelStore } from "@/stores/projectLabelStore";
import { TStateGroups } from "../icons/state/helper";
import { DatePicker } from "../ui/date-picker";
import { useCycleStore } from "@/stores/cycleStore";
import { ICycle } from "@/types/cycle";

interface FilterDropdownProps {}

const FilterAllDropdown: React.FC<FilterDropdownProps> = () => {
  const {
    priorityIds,
    statusIds,
    labelIds,
    cycleIds,
    startDate,
    dueDate,
    setFilter,
  } = useFilterStore();
  const { states } = useProjectStateStore();
  const { labels } = useProjectLabelStore();
  const {
    cycles,
    activeCycleId,
    completedCycleIds: compeletedCycleIds,
    upcomingCycleIds,
  } = useCycleStore();
  // convert cycles from object to array
  const cyclesArray = Object.values(cycles);

  const [open, setOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(true);
  const [isStatusOpen, setIsStatusOpen] = useState(true);
  const [isLabelOpen, setIsLabelOpen] = useState(true);
  const [isCycleOpen, setIsCycleOpen] = useState(true);

  const handleSelect = (
    key: "priorityIds" | "statusIds" | "labelIds" | "cycleIds",
    id: string,
  ) => {
    const currentIds = useFilterStore.getState()[key] as string[];
    if (currentIds.includes(id)) {
      setFilter({ [key]: currentIds.filter((item) => item !== id) });
    } else {
      setFilter({ [key]: [...currentIds, id] });
    }
  };

  const renderFilterGroup = (
    title: string,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    items:
      | ICycle[]
      | State[]
      | Label[]
      | { id: string; name: string; color?: string; group?: string }[],
    selectedIds: string[],
    storeKey: "priorityIds" | "statusIds" | "labelIds" | "cycleIds",
  ) => {
    const [showAll, setShowAll] = useState(false); // Trạng thái để theo dõi "View all"
    return (
      <>
        <CommandGroup
          heading={
            <div
              className="flex cursor-pointer items-center justify-between p-2 text-sm font-medium"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span>
                {title} ({selectedIds.length})
              </span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "rotate-90",
                )}
              />
            </div>
          }
        >
          <div className={cn("*: pl-4", !isOpen && "hidden")}>
            {items.map((item, index) => (
              <CommandItem
                key={item.id}
                value={"name" in item ? item.name : item.title}
                onSelect={() => handleSelect(storeKey, item.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedIds.includes(item.id) ? "opacity-100" : "opacity-0",
                  )}
                />
                <div className="flex items-center gap-2">
                  {storeKey === "priorityIds" && (
                    <PriorityIcon priority={item.id as TIssuePriorities} />
                  )}
                  {storeKey === "labelIds" && (
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          "color" in item ? item.color : "transparent",
                      }}
                    />
                  )}
                  {storeKey === "statusIds" && (
                    <StateGroupIcon
                      stateGroup={
                        "group" in item
                          ? (item.group as TStateGroups)
                          : "backlog"
                      }
                      color={"color" in item ? item.color : undefined}
                      className="h-3 w-3"
                    />
                  )}
                  {storeKey === "cycleIds" && (
                    <>
                      {upcomingCycleIds.includes(item.id) && (
                        <CycleGroupIcon
                          cycleGroup={"upcoming"}
                          className="h-5 w-5"
                        />
                      )}
                      {activeCycleId === item.id && (
                        <CycleGroupIcon
                          cycleGroup={"current"}
                          className="h-5 w-5"
                        />
                      )}

                      {compeletedCycleIds.includes(item.id) && (
                        <CycleGroupIcon
                          cycleGroup={"completed"}
                          className="h-5 w-5"
                        />
                      )}
                    </>
                  )}
                  <span>{"name" in item ? item.name : item.title}</span>
                </div>
              </CommandItem>
            ))}
          </div>
        </CommandGroup>
        <CommandSeparator />
      </>
    );
  };

  const totalFilters = priorityIds.length + statusIds.length + labelIds.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between font-normal text-muted-foreground"
          size="sm"
        >
          {totalFilters > 0 ? `Filters: ${totalFilters}` : "Filter"}
          <Filter className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" side="bottom" align="end">
        <Command>
          <CommandInput placeholder="Search filters..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {renderFilterGroup(
              "Priority",
              isPriorityOpen,
              setIsPriorityOpen,
              ISSUE_PRIORITIES.map((p) => ({ id: p.key, name: p.title })),
              priorityIds,
              "priorityIds",
            )}
            {renderFilterGroup(
              "Status",
              isStatusOpen,
              setIsStatusOpen,
              states,
              statusIds,
              "statusIds",
            )}
            {renderFilterGroup(
              "Labels",
              isLabelOpen,
              setIsLabelOpen,
              labels,
              labelIds,
              "labelIds",
            )}
            {renderFilterGroup(
              "Cycles",
              isCycleOpen,
              setIsCycleOpen,
              cyclesArray,
              cycleIds || [],
              "cycleIds",
            )}

            <div className="space-between flex w-full flex-grow">
              <DatePicker
                className="w-1/2"
                size="sm"
                date={startDate}
                onDateChange={(date) =>
                  setFilter({ startDate: date || undefined })
                }
                placeholder="Start Date"
                Icon={CalendarCheck2}
                tooltipHeading="Filter Start Date"
              />
              <DatePicker
                size="sm"
                className="w-1/2"
                date={dueDate}
                onDateChange={(date) =>
                  setFilter({ dueDate: date || undefined })
                }
                placeholder="Due Date"
                Icon={CalendarClock}
                tooltipHeading="Filter Due Date"
              />
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FilterAllDropdown;
