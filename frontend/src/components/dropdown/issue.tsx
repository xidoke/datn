import { ReactNode, useEffect, useState } from "react";
import { TDropdownProps } from "./type";
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
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import useIssueStore from "@/stores/issueStore";

export interface IssueDropdownProps extends TDropdownProps {
  button?: ReactNode;
  dropdownArrow?: boolean;
  dropdownArrowClassName?: string;
  onChange: (val: string|null) => void;
  projectId: string | undefined;
  value?: string | null;
  size?: "sm" | "default" | "lg";
}
const IssueDropdown = (props: IssueDropdownProps) => {
  const {
    button,
    dropdownArrow = false,
    dropdownArrowClassName,
    onChange,
    projectId,
    value,
    className,
    size = "default",
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [issueLoader, setIssueLoader] = useState(false);

  const { workspaceSlug } = useParams();

  // store
  const { issues, fetchIssues, getIssueById } = useIssueStore();

  const selectedIssue = value ? getIssueById(value) : undefined;

  const onOpen = async () => {
    if (!issues && workspaceSlug && projectId) {
      setIssueLoader(true);
      await fetchIssues(workspaceSlug.toString(), projectId);
      setIssueLoader(false);
    }
  };

  useEffect(() => {
    if (projectId) onOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleSelect = (currentValue: string) => {
    onChange(currentValue === "none" ? null : currentValue); // Xử lý "None"
    setIsOpen(false);
  };

  const renderButton = () => {
    switch (size) {
      case "sm":
        return (
          <Button variant="outline" size="sm" className={cn("p-1", className)}>
            {selectedIssue ? (
              <div className="flex items-center gap-1">
                <span className="flex-grow truncate">
                  {selectedIssue.fullIdentifier}
                </span>
              </div>
            ) : (
              "Select parent issue..."
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
          <Button variant="outline" className={cn(className)}>
            {selectedIssue ? (
              <div className="flex items-center gap-1">
                <span className="flex-grow truncate">
                  {selectedIssue.fullIdentifier}
                </span>
              </div>
            ) : (
              "Select parent issue..."
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
      <PopoverContent className="max-h-[300px] w-[300px] overflow-y-auto p-0">
        {issueLoader ? (
          <div className="flex h-24 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <Command>
            <CommandInput className="text-xs" placeholder="Search issue..." />
            <div className="touch-auto overflow-y-auto">
              <CommandList className="max-h-[250px]">
                <CommandEmpty>No issue found.</CommandEmpty>
                <CommandGroup>
                  {/* Tùy chọn None */}
                  <CommandItem value="none" onSelect={handleSelect}>
                    <Check
                      className={cn(
                        "mr-2 h-3 w-3",
                        value === null ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <span className="flex-grow truncate text-xs">None</span>
                    </div>
                  </CommandItem>
                  {/* Hiển thị danh sách issues */}
                  {issues?.map((issue) => (
                    <CommandItem
                      key={issue.id}
                      value={issue.id}
                      onSelect={handleSelect}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-3 w-3",
                          issue.id === value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <span className="flex-grow truncate text-xs">
                          {issue.fullIdentifier}: {issue.title}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </div>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
};

export { IssueDropdown };
