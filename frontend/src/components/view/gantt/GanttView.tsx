"use client";

import { useState } from "react";
import { Issue, State, TIssuePriorities } from "@/types";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/stores/filterStore";
import IssueModal from "../IssueModal";
import { IssueGanttChart } from "./IssueGanttChart";
interface GanttViewProps {
  issues: Issue[];
  states: State[];
}

export default function GanttView({ issues, states }: GanttViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const {
    statusIds,
    labelIds,
    priorityIds,
    startDate,
    dueDate,
    search,
    cycleIds,
    usersId,
  } = useFilterStore();

  const [range, setRange] = useState<"daily" | "monthly" | "quarterly">(
    "monthly",
  );
  const filteredIssues = issues.filter((issue) => {
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

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">{filteredIssues.length} Issues</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Button
            variant="outline"
            size={"sm"}
            onClick={() => setRange("daily")}
          >
            Daily
          </Button>
          <Button
            variant="outline"
            size={"sm"}
            onClick={() => setRange("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant="outline"
            size={"sm"}
            onClick={() => setRange("quarterly")}
          >
            Quarterly
          </Button>
          <Button variant="ghost" size="icon" onClick={handleFullscreen}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 overflow-hidden",
          isFullscreen && "bg-background",
        )}
      >
        <IssueGanttChart
          issues={filteredIssues}
          states={states}
          onIssueSelect={(issue) => setSelectedIssue(issue)}
          range={range}
        />
      </div>

      {selectedIssue && (
        <IssueModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
}
