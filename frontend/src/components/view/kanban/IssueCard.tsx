"use client";

import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { CalendarCheck2, CalendarClock, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useIssueStore from "@/stores/issueStore";
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
import { DeleteIssueDialog } from "@/components/issues/delete-issue-dialog";
import { EditIssueDialog } from "@/components/issues/edit-issue-dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { AssigneeDropdown } from "@/components/dropdown/assignees";
import { StateDropdown } from "@/components/dropdown/state";
import { CycleDropdown } from "@/components/dropdown/cycle";

interface IssueCardProps {
  issue: Issue;
  index: number;
  onClick: () => void;
  isSelected?: boolean;
}

export default function IssueCard({
  issue,
  index,
  onClick,
  isSelected = false,
}: IssueCardProps) {
  const { updateIssue } = useIssueStore();

  const { workspaceSlug, projectId } = useParams();
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  const { id, fullIdentifier, title, assignees, labels, dueDate, startDate } =
    issue;

  const handleInnerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div>
      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="group cursor-pointer rounded-sm border-[1px] border-secondary bg-background text-placeholder transition-colors hover:border-muted"
            onClick={onClick}
          >
            <CardContent className="space-y-2 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {fullIdentifier}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      onClick={handleInnerClick}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={handleInnerClick}>
                    <DropdownMenuItem>
                      <EditIssueDialog issue={issue} />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsOpenDeleteDialog(true);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="line-clamp-1 w-full text-sm text-foreground">
                <span>{title}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 whitespace-nowrap pt-1.5"></div>

              <div
                className="flex flex-wrap items-center gap-2 py-2"
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
                      id,
                      { labelIds: values },
                    );
                  }}
                  values={labels.map((label) => label.id)}
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
                      id,
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
                      id,
                      { priority: +newPriority },
                    );
                  }}
                  value={issue.priority.toString() as TIssuePriorities}
                />
                <DatePicker
                  date={startDate}
                  Icon={CalendarCheck2}
                  onDateChange={(date) => {
                    updateIssue(
                      workspaceSlug as string,
                      projectId as string,
                      id,
                      {
                        startDate: date,
                      },
                    );
                  }}
                  maxDate={issue.dueDate}
                  size="verySmall"
                  // placeholder="start date"
                />
                <DatePicker
                  date={dueDate}
                  Icon={CalendarClock}
                  onDateChange={(date) => {
                    updateIssue(
                      workspaceSlug as string,
                      projectId as string,
                      id,
                      {
                        dueDate: date,
                      },
                    );
                  }}
                  minDate={issue.startDate}
                  size="verySmall"
                  // placeholder="due date"
                />
                {/* cycle */}
                <CycleDropdown
                  projectId={projectId as string}
                  value={issue.cycleId}
                  onChange={async (value) => {
                    await updateIssue(
                      workspaceSlug as string,
                      projectId as string,
                      id,
                      { cycleId: value },
                    );
                  }}
                  size="sm"
                />
                <AssigneeDropdown
                  size="icon"
                  projectId={projectId as string}
                  values={assignees.map(
                    (assignee) => assignee?.workspaceMember?.user?.id,
                  )}
                  onChange={async (values) => {
                    console.log(values);
                    await updateIssue(
                      workspaceSlug as string,
                      projectId as string,
                      id,
                      { assigneeIds: values },
                    );
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground"></div>
            </CardContent>
          </Card>
        )}
      </Draggable>
      <DeleteIssueDialog
        issue={issue}
        workspaceSlug={workspaceSlug as string}
        projectId={projectId as string}
        isOpen={isOpenDeleteDialog}
        handleClose={() => setIsOpenDeleteDialog(false)}
      />
    </div>
  );
}
