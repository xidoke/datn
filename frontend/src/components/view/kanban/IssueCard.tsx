"use client";

import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import {
  Calendar,
  CalendarCheck2,
  CalendarClock,
  MoreHorizontal,
} from "lucide-react";
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

  return (
    <div>
      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="group cursor-pointer bg-card transition-colors hover:bg-accent"
          >
            <CardContent className="space-y-3 p-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {fullIdentifier}
                </span>
              </div>
              <h3 className="text-sm font-medium leading-tight">{title}</h3>
              <LabelDropdown
                projectId={projectId as string}
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
              <br />
              <div className="flex gap-2">
                <PriorityDropdown
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
                <AssigneeDropdown
                  projectId={projectId as string}
                  values={assignees.map((assignee) => assignee.user?.id)}
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
                // placeholder="due date"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{typeof dueDate}</span>
                  </div>
                )}
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
