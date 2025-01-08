"use client";

import React, { useMemo, useState } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";
import { Issue, Label, State, TIssuePriorities } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, Search, CalendarCheck2, CalendarClock } from "lucide-react";
import GanttTimeline from "./GanttTimeline";
import GanttSidebar from "./GanttSidebar";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import FilterDropdown from "@/components/dropdown/filter";
import { useFilterStore } from "@/stores/filterStore";
import PriorityMultiSelect from "@/components/dropdown/priority-multi-select";
import { DatePicker } from "@/components/ui/date-picker";
import IssueModal from "../IssueModal";

interface GanttViewProps {
  issues: Issue[];
  states: State[];
  labels: Label[];
}

type ViewMode = "week" | "month" | "quarter";

export default function GanttView({ issues, states, labels }: GanttViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [search, setSearch] = useState("");
  const { statusIds, labelIds, priorityIds, startDate, dueDate, setFilter } =
    useFilterStore();

  const dateRange = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (
        statusIds.length > 0 &&
        !statusIds.includes(issue.state?.id as string)
      ) {
        return false;
      }
      if (
        labelIds.length > 0 &&
        !issue.labels.some((label) => labelIds.includes(label.id))
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
      if (search && !issue.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [issues, statusIds, labelIds, priorityIds, startDate, dueDate, search]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const handleCloseModal = () => {
    setSelectedIssue(null);
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">{filteredIssues.length} Issues</span>
          <div className="flex items-center rounded-md border bg-background p-1">
            <Button
              variant={viewMode === "week" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("week")}
            >
              Week
            </Button>
            <Button
              variant={viewMode === "month" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("month")}
            >
              Month
            </Button>
            <Button
              variant={viewMode === "quarter" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("quarter")}
            >
              Quarter
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="w-64 pl-8 text-sm"
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
            onDateChange={(date) => setFilter({ startDate: date || undefined })}
            placeholder="Start Date"
            Icon={CalendarCheck2}
            tooltipHeading="Filter Start Date"
          />
          <DatePicker
            date={dueDate}
            onDateChange={(date) => setFilter({ dueDate: date || undefined })}
            placeholder="Due Date"
            Icon={CalendarClock}
            tooltipHeading="Filter Due Date"
          />
          <Button variant="ghost" size="icon" onClick={handleFullscreen}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-1 overflow-hidden",
          isFullscreen && "bg-background",
        )}
      >
        <div className="w-1/4 min-w-[300px] border-r">
          <GanttSidebar
            issues={filteredIssues}
            onIssueClick={handleIssueClick}
          />
        </div>
        <div className="flex-1 overflow-x-auto">
          <GanttTimeline
            issues={filteredIssues}
            dateRange={dateRange}
            viewMode={viewMode}
          />
        </div>
      </div>
      {selectedIssue && (
        <IssueModal issue={selectedIssue} onClose={handleCloseModal} />
      )}
    </div>
  );
}
