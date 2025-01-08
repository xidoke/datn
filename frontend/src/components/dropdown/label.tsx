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
import { Badge } from "../ui/badge";

export interface LabelDropdownProps extends TDropdownProps {
  button?: ReactNode;
  dropdownArrow?: boolean;
  dropdownArrowClassName?: string;
  onChange: (val: string[]) => void;
  projectId: string | undefined;
  values: string[];
  showCount?: boolean;
  maxDisplayedLabels?: number;
  size?: "icon" | "sm" | "default" | "lg";
  placeHolder?: string;
}

const LabelDropdown = (props: LabelDropdownProps) => {
  const {
    button,
    dropdownArrow = false,
    dropdownArrowClassName,
    onChange,
    projectId,
    values,
    showCount = false,
    maxDisplayedLabels = Infinity,
    size = "default",
    placeHolder = "Select labels",
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
        <>
          <span className="text-xs text-muted-foreground">
            <Tag className="mr-1 inline-block h-3 w-3" />
            {placeHolder ?? null}
          </span>
        </>
      );
    }

    if (
      selectedLabels.length > maxDisplayedLabels ||
      (showCount && selectedLabels.length > 1)
    ) {
      return (
        <div className="flex items-center gap-1">
          <div className="mr-1 h-2 w-2 rounded-full bg-primary" />
          <span>{selectedLabels.length} labels</span>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap items-center gap-1">
        {selectedLabels.map((label) => (
          <Badge
            key={label?.id}
            style={{
              backgroundColor: `${label?.color}20`,
              color: label?.color,
            }}
            className={`h-6 rounded-sm text-[11px] font-medium hover:bg-primary`}
            variant="secondary"
          >
            {label?.name}
          </Badge>
        ))}
      </div>
    );
  };

  const renderButton = () => {
    switch (size) {
      case "icon":
        return (
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-5 w-5 min-w-fit",
              // hide button ,just show badge when label is selected
              {
                "h-fit w-fit border-none hover:bg-transparent":
                  selectedLabels.length > 0,
              },
            )}
          >
            {renderLabelContent()}
          </Button>
        );
      case "sm":
        return (
          <Button variant="outline" size="sm" className="p-1">
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
        );
      case "default":
        return (
          <Button variant="outline" size="default" className="p-2">
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
        );
      case "lg":
        return (
          <Button variant="outline" size="lg" className="p-3">
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
        );
      default:
        return (
          <Button variant="outline" size="sm" className="p-1">
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
        );
    }
  };
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {button ? button : renderButton()}
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
