"use client";

import React from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Issue, TIssuePriorities } from "@/types";
import { useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PriorityDropdown } from "@/components/dropdown/priority";
import { LabelDropdown } from "@/components/dropdown/label";
import { EditIssueDialog } from "@/components/issues/edit-issue-dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { AssigneeDropdown } from "@/components/dropdown/assignees";
import { StateDropdown } from "@/components/dropdown/state";
import { CycleDropdown } from "@/components/dropdown/cycle";
import useIssueStore from "@/stores/issueStore";
import { CalendarCheck2, CalendarClock } from "lucide-react";

interface IssueListItemProps {
  issue: Issue;
  onClick: () => void;
}

export default function IssueListItem({ issue, onClick }: IssueListItemProps) {
  const { updateIssue } = useIssueStore();
  const { workspaceSlug, projectId } = useParams();

  const handleInnerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="group flex items-center gap-4 p-4 hover:bg-muted/50"
      onClick={onClick}
    >
      <div className="flex min-w-[200px] items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {issue.fullIdentifier}
        </span>
        <span className="line-clamp-1 text-sm">{issue.title}</span>
      </div>

      <div
        className="ml-auto flex items-center gap-2"
        onClick={handleInnerClick}
      >
        <LabelDropdown
          projectId={projectId as string}
          placeHolder=""
          size="icon"
          onChange={async (values) => {
            await updateIssue(
              workspaceSlug as string,
              projectId as string,
              issue.id,
              { labelIds: values },
            );
          }}
          values={issue.labels.map((label) => label.id)}
          maxDisplayedLabels={2}
        />
        <StateDropdown
          size="icon"
          projectId={projectId as string}
          value={issue.stateId}
          onChange={async (value) => {
            await updateIssue(
              workspaceSlug as string,
              projectId as string,
              issue.id,
              { stateId: value },
            );
          }}
        />
        <PriorityDropdown
          size="icon"
          onChange={async (newPriority) => {
            await updateIssue(
              workspaceSlug as string,
              projectId as string,
              issue.id,
              { priority: +newPriority },
            );
          }}
          value={issue.priority.toString() as TIssuePriorities}
        />
        <DatePicker
          date={issue.startDate}
          Icon={CalendarCheck2}
          onDateChange={(date) => {
            updateIssue(
              workspaceSlug as string,
              projectId as string,
              issue.id,
              {
                startDate: date,
              },
            );
          }}
          maxDate={issue.dueDate}
          size="verySmall"
        />
        <DatePicker
          date={issue.dueDate}
          Icon={CalendarClock}
          onDateChange={(date) => {
            updateIssue(
              workspaceSlug as string,
              projectId as string,
              issue.id,
              {
                dueDate: date,
              },
            );
          }}
          minDate={issue.startDate}
          size="verySmall"
        />
        <CycleDropdown
          projectId={projectId as string}
          value={issue.cycleId}
          onChange={async (value) => {
            await updateIssue(
              workspaceSlug as string,
              projectId as string,
              issue.id,
              {
                cycleId: value,
              },
            );
          }}
          size="sm"
        />
        <AssigneeDropdown
          size="icon"
          projectId={projectId as string}
          values={issue.assignees.map((assignee) => assignee.workspaceMember.user?.id)}
          onChange={async (values) => {
            await updateIssue(
              workspaceSlug as string,
              projectId as string,
              issue.id,
              { assigneeIds: values },
            );
          }}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <EditIssueDialog issue={issue} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
