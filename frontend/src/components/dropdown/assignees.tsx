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

export interface AssigneeDropdownProps extends TDropdownProps {
  button?: ReactNode;
  dropdownArrow?: boolean;
  dropdownArrowClassName?: string;
  onChange: (val: string[]) => void;
  projectId: string | undefined;
  values: string[];
  showCount?: boolean;
  maxDisplayedAssignees?: number;
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
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [assigneeLoader, setAssigneeLoader] = useState(false);
  const [assignees, setAssignees] = useState<WorkspaceMember[]>([]);

  const { fetchWorkspaceMembers } = useMemberStore();
  const { workspaceSlug } = useParams();

  const onOpen = async () => {
    if (!assignees.length && workspaceSlug && projectId) {
      setAssigneeLoader(true);
      // Simulating API call to fetch assignees
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
          <span>Select assignees</span>
        </div>
      );
    }

    return (
      <AvatarGroup limit={maxDisplayedAssignees}>
        <AvatarGroupList>
          {selectedAssignees.map((assignee) => (
            <Avatar key={assignee.id}>
              <AvatarImage
                src={API_BASE_URL + assignee.user?.avatarUrl}
                alt={assignee.user?.email}
              />
              <AvatarFallback>{assignee.user?.email.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroupList>
        <AvatarOverflowIndicator />
      </AvatarGroup>
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
        )}
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
                        values.includes(assignee.id)
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
