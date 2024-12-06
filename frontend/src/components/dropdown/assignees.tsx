"use client";

import { ReactNode, useEffect, useState } from "react";
import { TDropdownProps } from "./type";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown, User } from "lucide-react";
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
  AvatarGroupList,
  AvatarOverflowIndicator,
} from "../ui/avatar";
import { useMemberStore } from "@/stores/member/memberStore";
import { WorkspaceMember } from "@/types";
import { API_BASE_URL } from "@/helpers/common.helper";
import { Tooltip } from "../ui/tooltip-plane";

export interface AssigneeDropdownProps extends TDropdownProps {
  button?: ReactNode;
  dropdownArrow?: boolean;
  dropdownArrowClassName?: string;
  onChange: (val: string[]) => void;
  projectId: string | undefined;
  values: string[];
  showCount?: boolean;
  maxDisplayedAssignees?: number;
  size?: "icon" | "sm" | "md" | "lg";
}

const AssigneeDropdown = (props: AssigneeDropdownProps) => {
  const {
    button,
    dropdownArrow = false,
    dropdownArrowClassName,
    onChange,
    projectId,
    values,
    className,
    showCount = false,
    maxDisplayedAssignees = 3,
    size = "sm",
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [assigneeLoader, setAssigneeLoader] = useState(false);
  const [assignees, setAssignees] = useState<WorkspaceMember[]>([]);

  const { fetchWorkspaceMembers } = useMemberStore();
  const { workspaceSlug } = useParams();

  const onOpen = async () => {
    if (!assignees.length && workspaceSlug && projectId) {
      setAssigneeLoader(true);
      const members = await fetchWorkspaceMembers(workspaceSlug as string);
      setAssignees(members);
      setAssigneeLoader(false);
    }
  };

  useEffect(() => {
    if (projectId) onOpen();
  }, [projectId]);

  const handleSelect = (currentValue: string) => {
    const newValues = values.includes(currentValue)
      ? values.filter((v) => v !== currentValue)
      : [...values, currentValue];
    onChange(newValues);
  };

  const selectedAssignees = assignees.filter((a) => values.includes(a.user.id));

  const renderAssigneeContent = () => {
    if (selectedAssignees.length === 0) {
      return (
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
        </div>
      );
    }

    return (
      <AvatarGroup limit={maxDisplayedAssignees}>
        <AvatarGroupList>
          {selectedAssignees.map((assignee) => (
            <Tooltip
              tooltipContent={assignee.user?.email}
              className="border-[1px] bg-background"
              key={assignee.id}
            >
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={API_BASE_URL + assignee.user?.avatarUrl}
                  alt={assignee.user?.email}
                />
                <AvatarFallback>
                  {assignee.user?.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Tooltip>
          ))}
        </AvatarGroupList>
        <AvatarOverflowIndicator className="h-5 w-5" />
      </AvatarGroup>
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
              "h-5 w-5 p-1",
              className,
              {
                "ml-1": selectedAssignees.length > 0,
              },
              {
                "ml-3": selectedAssignees.length > 1,
              },
              {
                "ml-4": selectedAssignees.length > 2,
              },
            )}
          >
            {renderAssigneeContent()}
            {showCount && selectedAssignees.length > 0 && (
              <span className="ml-1 text-xs font-medium">
                ({selectedAssignees.length})
              </span>
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
            size="sm"
            className={cn(
              "h-auto min-h-[28px] p-1 hover:bg-background",
              {
                "border-0": selectedAssignees.length > 0,
              },
              className,
            )}
          >
            {renderAssigneeContent()}
            {showCount && selectedAssignees.length > 0 && (
              <span className="ml-1 text-xs font-medium">
                ({selectedAssignees.length})
              </span>
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
      default:
        return (
          <Button
            variant="outline"
            size="default"
            className={cn(
              "h-auto min-h-[32px] p-1 hover:bg-background",
              {
                "border-0": selectedAssignees.length > 0,
              },
              className,
            )}
          >
            {renderAssigneeContent()}
            {showCount && selectedAssignees.length > 0 && (
              <span className="ml-1 text-xs font-medium">
                ({selectedAssignees.length})
              </span>
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
      <PopoverTrigger asChild>
        {button ? button : renderButton()}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        {assigneeLoader ? (
          <div className="flex h-24 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <Command>
            <CommandInput
              className="text-xs"
              placeholder="Search assignee..."
            />
            <CommandList>
              <CommandEmpty>No assignee found.</CommandEmpty>
              <CommandGroup>
                {assignees.map((assignee) => (
                  <CommandItem
                    key={assignee.id}
                    value={assignee.user?.email}
                    onSelect={() => handleSelect(assignee.userId)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3 w-3",
                        values.includes(assignee.user.id)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={API_BASE_URL + assignee.user?.avatarUrl}
                          alt={assignee.user?.email}
                        />
                        <AvatarFallback>
                          {assignee.user?.email.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">
                          {assignee.user?.email}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {assignee.user?.email}
                        </span>
                      </div>
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

export { AssigneeDropdown };
