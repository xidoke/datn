"use client";

import React, { useMemo, useState } from "react";
import { startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { Issue, Label, State, TIssuePriorities } from "@/types";
import { Button } from "@/components/ui/button";
import { Maximize2, CalendarCheck2, CalendarClock } from "lucide-react";
import GanttTimeline from "./GanttTimeline";
import GanttSidebar from "./GanttSidebar";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/stores/filterStore";
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
  const {
    statusIds,
    labelIds,
    priorityIds,
    startDate,
    dueDate,
    search,
    cycleIds,
    setFilter,
    usersId,
  } = useFilterStore();

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
        usersId.length > 0 &&
        !issue.assignees?.some((assignee) =>
          usersId.includes(assignee.workspaceMember.user.id),
        )
      ) {
        return false;
      }

      if (cycleIds.length > 0 && !cycleIds.includes(issue.cycleId as string)) {
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
  }, [
    issues,
    statusIds,
    labelIds,
    priorityIds,
    startDate,
    dueDate,
    search,
    cycleIds,
    usersId,
  ]);

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
