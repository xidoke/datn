"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getDay, getDaysInMonth, isSameDay } from "date-fns";
import {
  CalendarCheck2,
  CalendarClock,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Check, ChevronsUpDown } from "lucide-react";
import { type ReactNode, createContext, useContext, useState } from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Issue, State, TIssuePriorities } from "@/types";
import { useFilterStore } from "@/stores/filterStore";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import FilterDropdown from "@/components/dropdown/filter";
import IssueModal from "../kanban/IssueModal";
import { DatePicker } from "@/components/ui/date-picker";
import PriorityMultiSelect from "@/components/dropdown/priority-multi-select";

export type CalendarState = {
  month: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  year: number;
  setMonth: (month: CalendarState["month"]) => void;
  setYear: (year: CalendarState["year"]) => void;
};

export const useCalendar = create<CalendarState>()(
  devtools((set) => ({
    month: new Date().getMonth() as CalendarState["month"],
    year: new Date().getFullYear(),
    setMonth: (month: CalendarState["month"]) => set(() => ({ month })),
    setYear: (year: CalendarState["year"]) => set(() => ({ year })),
  })),
);

type CalendarContextProps = {
  locale: Intl.LocalesArgument;
};

const CalendarContext = createContext<CalendarContextProps>({
  locale: "en-US",
});

type ComboboxProps = {
  value: string;
  setValue: (value: string) => void;
  data: {
    value: string;
    label: string;
  }[];
  labels: {
    button: string;
    empty: string;
    search: string;
  };
  className?: string;
};

export const monthsForLocale = (
  localeName: Intl.LocalesArgument,
  monthFormat: Intl.DateTimeFormatOptions["month"] = "long",
) => {
  const format = new Intl.DateTimeFormat(localeName, { month: monthFormat })
    .format;

  return [...new Array(12).keys()].map((m) =>
    format(new Date(Date.UTC(2024, m % 12))),
  );
};

export const daysForLocale = (locale: Intl.LocalesArgument) => {
  const weekdays: string[] = [];
  const baseDate = new Date(2024, 0, 7); // Starting with a Sunday

  for (let i = 0; i < 7; i++) {
    weekdays.push(
      new Intl.DateTimeFormat(locale, { weekday: "short" }).format(baseDate),
    );
    baseDate.setDate(baseDate.getDate() + 1);
  }

  return weekdays;
};

const Combobox = ({
  value,
  setValue,
  data,
  labels,
  className,
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className={cn("w-40 justify-between", className)}
        >
          {value
            ? data.find((item) => item.value === value)?.label
            : labels.button}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0">
        <Command
          filter={(value, search) => {
            const label = data.find((item) => item.value === value)?.label;

            return label?.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput placeholder={labels.search} />
          <CommandList>
            <CommandEmpty>{labels.empty}</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

type OutOfBoundsDayProps = {
  day: number;
};

const OutOfBoundsDay = ({ day }: OutOfBoundsDayProps) => (
  <div className="relative h-full w-full bg-secondary p-1 text-xs text-muted-foreground">
    {day}
  </div>
);

export type CalendarBodyProps = {
  issues: Issue[];
  children: (props: { issue: Issue }) => ReactNode;
};

export const CalendarBody = ({ issues, children }: CalendarBodyProps) => {
  const { month, year } = useCalendar();
  const daysInMonth = getDaysInMonth(new Date(year, month, 1));
  const firstDay = getDay(new Date(year, month, 1));
  const days: ReactNode[] = [];

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const prevMonthDays = getDaysInMonth(new Date(prevMonthYear, prevMonth, 1));
  const prevMonthDaysArray = Array.from(
    { length: prevMonthDays },
    (_, i) => i + 1,
  );

  for (let i = 0; i < firstDay; i++) {
    const day = prevMonthDaysArray[prevMonthDays - firstDay + i];

    if (day) {
      days.push(<OutOfBoundsDay key={`prev-${i}`} day={day} />);
    }
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const issuesForDay = issues.filter((issue) => {
      if (!issue.dueDate) return false;
      return isSameDay(new Date(issue.dueDate), new Date(year, month, day));
    });

    days.push(
      <div
        key={day}
        className="relative flex h-full w-full flex-col gap-1 p-1 text-xs text-muted-foreground"
      >
        {day}
        <div>
          {issuesForDay.slice(0, 3).map((issue) => children({ issue }))}
        </div>
        {issuesForDay.length > 3 && (
          <span className="block text-xs text-muted-foreground">
            +{issuesForDay.length - 3} more
          </span>
        )}
      </div>,
    );
  }

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;
  const nextMonthDays = getDaysInMonth(new Date(nextMonthYear, nextMonth, 1));
  const nextMonthDaysArray = Array.from(
    { length: nextMonthDays },
    (_, i) => i + 1,
  );

  const remainingDays = 7 - ((firstDay + daysInMonth) % 7);
  if (remainingDays < 7) {
    for (let i = 0; i < remainingDays; i++) {
      const day = nextMonthDaysArray[i];

      if (day) {
        days.push(<OutOfBoundsDay key={`next-${i}`} day={day} />);
      }
    }
  }

  return (
    <div className="grid flex-grow grid-cols-7">
      {days.map((day, index) => (
        <div
          key={index}
          className={cn(
            "relative aspect-square overflow-hidden border-r border-t",
            index % 7 === 6 && "border-r-0",
          )}
        >
          {day}
        </div>
      ))}
    </div>
  );
};

export type CalendarDatePickerProps = {
  className?: string;
  children: ReactNode;
};

export const CalendarDatePicker = ({
  className,
  children,
}: CalendarDatePickerProps) => (
  <div className={cn("flex items-center gap-1", className)}>{children}</div>
);

export type CalendarMonthPickerProps = {
  className?: string;
};

export const CalendarMonthPicker = ({
  className,
}: CalendarMonthPickerProps) => {
  const { month, setMonth } = useCalendar();
  const { locale } = useContext(CalendarContext);

  const monthNames = monthsForLocale(locale);

  return (
    <Combobox
      className={className}
      value={monthNames[month]}
      setValue={(value) =>
        setMonth(monthNames.indexOf(value) as CalendarState["month"])
      }
      data={monthNames.map((monthName) => ({
        value: monthName,
        label: monthName,
      }))}
      labels={{
        button: "Select month",
        empty: "No month found",
        search: "Search month",
      }}
    />
  );
};
export type CalendarYearPickerProps = {
  className?: string;
  start: number;
  end: number;
};

export const CalendarYearPicker = ({
  className,
  start,
  end,
}: CalendarYearPickerProps) => {
  const { year, setYear } = useCalendar();

  return (
    <Combobox
      className={className}
      value={year.toString()}
      setValue={(value) => setYear(Number.parseInt(value))}
      data={Array.from({ length: end - start + 1 }, (_, i) => ({
        value: (start + i).toString(),
        label: (start + i).toString(),
      }))}
      labels={{
        button: "Select year",
        empty: "No year found",
        search: "Search year",
      }}
    />
  );
};

export type CalendarDatePaginationProps = {
  className?: string;
};

export const CalendarDatePagination = ({
  className,
}: CalendarDatePaginationProps) => {
  const { month, year, setMonth, setYear } = useCalendar();

  const handlePreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth((month - 1) as CalendarState["month"]);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth((month + 1) as CalendarState["month"]);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button onClick={() => handlePreviousMonth()} variant="ghost" size="icon">
        <ChevronLeftIcon size={16} />
      </Button>
      <Button onClick={() => handleNextMonth()} variant="ghost" size="icon">
        <ChevronRightIcon size={16} />
      </Button>
    </div>
  );
};

export type CalendarDateProps = {
  children: ReactNode;
};

export const CalendarDate = ({ children }: CalendarDateProps) => (
  <div className="flex items-center justify-between p-3">{children}</div>
);

export type CalendarHeaderProps = {
  className?: string;
};

export const CalendarHeader = ({ className }: CalendarHeaderProps) => {
  const { locale } = useContext(CalendarContext);

  return (
    <div className={cn("grid flex-grow grid-cols-7", className)}>
      {daysForLocale(locale).map((day) => (
        <div key={day} className="p-3 text-right text-xs text-muted-foreground">
          {day}
        </div>
      ))}
    </div>
  );
};

export type CalendarItemProps = {
  issue: Issue;
  className?: string;
  onClick?: () => void;
};

export const CalendarItem = ({
  issue,
  className,
  onClick,
}: CalendarItemProps) => (
  <div
    className={cn("flex items-center gap-2", className)}
    key={issue.id}
    onClick={() => {
      if (onClick) {
        onClick();
      }
    }}
  >
    <div
      className="h-2 w-2 shrink-0 rounded-full"
      style={{
        backgroundColor: issue.state?.color,
      }}
    />
    <span className="truncate">
      {issue.fullIdentifier}: {issue.title}
    </span>
  </div>
);

export type CalendarProviderProps = {
  locale?: Intl.LocalesArgument;
  children: ReactNode;
  className?: string;
};

export const CalendarProvider = ({
  locale,
  children,
  className,
}: CalendarProviderProps) => (
  <CalendarContext.Provider value={{ locale }}>
    <div className={cn("relative flex flex-col", className)}>{children}</div>
  </CalendarContext.Provider>
);

interface CalendarViewProps {
  issues: Issue[];
  states: State[];
  labels: { id: string; name: string }[];
}

const CalendarView: React.FC<CalendarViewProps> = ({
  issues,
  states,
  labels,
}) => {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [search, setSearch] = useState("");
  const { statusIds, labelIds, priorityIds, startDate, dueDate, setFilter } =
    useFilterStore();

  const issueAfterFilter = issues.filter((issue) => {
    if (
      statusIds.length > 0 &&
      !statusIds.includes(issue.state?.id as string)
    ) {
      return false;
    }

    if (
      labelIds.length > 0 &&
      !issue.labels?.some((label) => labelIds.includes(label.id))
    ) {
      return false;
    }

    if (
      priorityIds.length > 0 &&
      !priorityIds.includes(issue.priority.toString() as TIssuePriorities)
    ) {
      return false;
    }

    if (
      startDate &&
      issue.startDate &&
      new Date(issue.startDate) < new Date(startDate)
    ) {
      return false;
    }

    if (
      dueDate &&
      issue.dueDate &&
      new Date(issue.dueDate) > new Date(dueDate)
    ) {
      return false;
    }

    return true;
  });

  const issueAfterSearchandFilter = issueAfterFilter.filter((issue) => {
    if (
      search.length > 0 &&
      !issue.title.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleCloseModal = () => {
    setSelectedIssue(null);
  };

  return (
    <CalendarProvider locale="en-US" className="flex h-screen flex-col">
      <div className="flex items-center justify-between px-4 py-2">
        <h1 className="text-2xl font-bold">Calendar View</h1>
        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="w-44 pl-8 text-sm"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <FilterDropdown
            label="Status"
            options={states}
            selectedIds={statusIds}
            onChange={(selected) => setFilter({ statusIds: selected })}
          />
          <FilterDropdown
            label="Labels"
            options={labels}
            selectedIds={labelIds}
            onChange={(selected) => setFilter({ labelIds: selected })}
          />
          <PriorityMultiSelect
            selectedPriorities={priorityIds}
            onChange={(selected) => setFilter({ priorityIds: selected })}
          />
          <DatePicker
            date={startDate}
            onDateChange={(date) => setFilter({ startDate: date ?? undefined })}
            placeholder="Start Date"
            Icon={CalendarCheck2}
            tooltipHeading="Filter Start Date"
          />
          <DatePicker
            date={dueDate}
            onDateChange={(date) => setFilter({ dueDate: date ?? undefined })}
            placeholder="Due Date"
            Icon={CalendarClock}
            tooltipHeading="Filter Due Date"
          />
        </div>
      </div>
      <CalendarDate>
        <CalendarDatePicker>
          <CalendarMonthPicker />
          <CalendarYearPicker start={2020} end={2030} />
        </CalendarDatePicker>
        <CalendarDatePagination />
      </CalendarDate>
      <CalendarHeader />
      <CalendarBody issues={issueAfterSearchandFilter}>
        {({ issue }) => (
          <CalendarItem
            key={issue.id}
            issue={issue}
            className="cursor-pointer hover:bg-primary/10"
            onClick={() => setSelectedIssue(issue)}
          />
        )}
      </CalendarBody>
      {selectedIssue && (
        <IssueModal issue={selectedIssue} onClose={handleCloseModal} />
      )}
    </CalendarProvider>
  );
};

export default CalendarView;
