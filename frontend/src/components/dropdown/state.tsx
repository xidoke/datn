import { ReactNode, useEffect, useState } from "react";
import { TDropdownProps } from "./type";
import { useParams } from "next/navigation";
import { useProjectStateStore } from "@/stores/projectStateStore";
import StateGroupIcon from "../state-group-icon";
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

export interface StateDropdownProps extends TDropdownProps {
  button?: ReactNode;
  dropdownArrow?: boolean;
  dropdownArrowClassName?: string;
  onChange: (val: string) => void;
  projectId: string | undefined;
  showDefaultState?: boolean;
  value?: string;
  size?: "icon" | "sm" | "md" | "lg";
}

const StateDropdown = (props: StateDropdownProps) => {
  const {
    button,
    dropdownArrow = false,
    dropdownArrowClassName,
    onChange,
    projectId,
    showDefaultState = false,
    value,
    className,
    size = "sm",
  } = props;

  //   const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [stateLoader, setStateLoader] = useState(false);

  const { workspaceSlug } = useParams();

  //store
  const { states, fetchStates, getStateById } = useProjectStateStore();

  const defaultState = states?.find((state) => state.isDefault);
  const stateValue = !!value
    ? value
    : showDefaultState
      ? defaultState?.id
      : undefined;

  const selectedState = stateValue ? getStateById(stateValue) : undefined;
  const onOpen = async () => {
    if (!states && workspaceSlug && projectId) {
      setStateLoader(true);
      await fetchStates(workspaceSlug.toString(), projectId);
      setStateLoader(false);
    }
  };
  //   const options = states?.map((state) => ({
  //     value: state.id,
  //     query: `${state?.name}`,
  //     content: (
  //       <div className="flex items-center gap-2">
  //         <StateGroupIcon
  //           stateGroup={state.group}
  //           color={state.color}
  //           className="h-3 w-3 flex-shrink-0"
  //         />
  //         <span className="flex-grow truncate">{state?.name}</span>
  //       </div>
  //     ),
  //   }));

  //   const filteredOptions =
  //     query === ""
  //       ? options
  //       : options?.filter((o) =>
  //           o.query.toLowerCase().includes(query.toLowerCase()),
  //         );

  useEffect(() => {
    if (projectId) onOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleSelect = (currentValue: string) => {
    onChange(currentValue);
    setIsOpen(false);
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
              {
                "border-red-600 bg-red-600/10":
                  selectedState?.id === "4",
              },
              className,
            )}
          >
            <div className="flex items-center">
              <StateGroupIcon
                stateGroup={selectedState?.group || "backlog"} // TODO: fix this
                color={selectedState?.color}
                className="h-3 w-3"
              />
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
        );
      case "sm":
        return (
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "p-1",
              className,
            )}
          >
            {selectedState ? (
              <div className="flex items-center gap-1">
                <StateGroupIcon
                  stateGroup={selectedState.group}
                  color={selectedState.color}
                  className="h-3 w-3"
                />
                <span className="flex-grow truncate">{selectedState.name}</span>
              </div>
            ) : (
              "Select state..."
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
        // TODO: add more sizes
      default: return null;
    }
  }
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {button ? (
          button
        ) : (
          renderButton()
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        {stateLoader ? (
          <div className="flex h-24 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <Command>
            <CommandInput className="text-xs" placeholder="Search state..." />
            <CommandList>
              <CommandEmpty>No state found.</CommandEmpty>
              <CommandGroup>
                {states?.map((state) => (
                  <CommandItem
                    key={state.id}
                    value={state.id}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3 w-3",
                        state.id === stateValue ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <StateGroupIcon
                        stateGroup={state.group}
                        color={state.color}
                        className="text-xs"
                      />
                      <span className="flex-grow truncate text-xs">
                        {state.name}
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
export { StateDropdown };
