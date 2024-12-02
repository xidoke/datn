"use client";

import { ReactNode, useEffect, useState } from "react";
import { TDropdownProps } from "./type";
import { useParams } from "next/navigation";
import { useProjectLabelStore } from "@/stores/projectLabelStore";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown, Tag } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

export interface LabelDropdownProps extends TDropdownProps {
  button?: ReactNode;
  dropdownArrow?: boolean;
  dropdownArrowClassName?: string;
  onChange: (val: string[]) => void;
  projectId: string | undefined;
  values: string[];
  showCount?: boolean;
  maxDisplayedLabels?: number;
}

const LabelDropdown = (props: LabelDropdownProps) => {
  const {
    button,
    dropdownArrow = false,
    dropdownArrowClassName,
    onChange,
    projectId,
    values,
    className,
    showCount = false,
    maxDisplayedLabels = Infinity,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [labelLoader, setLabelLoader] = useState(false);

  const { workspaceSlug } = useParams();

  // store
  const { labels, fetchLabels, getLabelById } = useProjectLabelStore();

  const onOpen = async () => {
    if (!labels && workspaceSlug && projectId) {
      setLabelLoader(true);
      await fetchLabels(workspaceSlug.toString(), projectId);
      setLabelLoader(false);
    }
  };

  useEffect(() => {
    if (projectId) onOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleSelect = (currentValue: string) => {
    const newValues = values.includes(currentValue)
      ? values.filter((v) => v !== currentValue)
      : [...values, currentValue];
    onChange(newValues);
  };

  const selectedLabels = values.map((v) => getLabelById(v)).filter(Boolean);

  const renderLabelContent = () => {
    if (selectedLabels.length === 0) {
      return (
        <div className="flex items-center gap-1">
          <Tag className="h-3 w-3" />
          <span>Select labels</span>
        </div>
      );
    }

    if (
      selectedLabels.length > maxDisplayedLabels ||
      (showCount && selectedLabels.length > 1)
    ) {
      return (
        <div className="flex items-center gap-1">
          <div
            className="mr-1 h-2 w-2 rounded-full bg-primary"
          />
          <span>{selectedLabels.length} labels</span>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap items-center gap-1">
        {selectedLabels.map((label) => (
          <Button
            key={label?.id}
            variant="secondary"
            size="sm"
            className="h-6 px-2 py-0 text-xs"
            asChild
          >
            <div>
                <div
                  className="mr-1 h-2 w-2 rounded-full"
                  style={{ backgroundColor: label?.color }}
                />
                {label?.name}
            </div>
          </Button>
        ))}
      </div>
    );
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
              "h-auto min-h-[28px] p-1",
              {
                "border-0": selectedLabels.length > 0 && selectedLabels.length <= maxDisplayedLabels,
              },
              className,
            )}
          >
            {renderLabelContent()}
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
        {labelLoader ? (
          <div className="flex h-24 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <Command>
            <CommandInput className="text-xs" placeholder="Search label..." />
            <CommandList>
              <CommandEmpty>No label found.</CommandEmpty>
              <CommandGroup>
                {labels?.map((label) => (
                  <CommandItem
                    key={label.id}
                    value={label.name}
                    onSelect={() => handleSelect(label.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3 w-3",
                        values.includes(label.id) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: label.color }}
                      />
                      <span className="flex-grow truncate text-xs">
                        {label.name}
                      </span>
                    </div>
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

export { LabelDropdown };
