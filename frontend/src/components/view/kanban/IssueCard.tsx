"use client";

import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Calendar, MoreHorizontal, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import useIssueStore from "@/stores/issueStore";
import { Issue, Label } from "@/types";
import { useParams } from "next/navigation";
import { useProjectLabelStore } from "@/stores/projectLabelStore";
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
  const { labels: projectLabels } = useProjectLabelStore();

  const [isLabelPopoverOpen, setIsLabelPopoverOpen] = useState(false);
  const { workspaceSlug, projectId } = useParams();
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  const { id, fullIdentifier, title, assignees, labels, dueDate, priority } =
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
                {assignees && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>{assignees[0]}</AvatarFallback>
                  </Avatar>
                )}
              </div>
              <h3 className="text-sm font-medium leading-tight">{title}</h3>
              {labels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {labels.map((label) => (
                    <Badge
                      key={label.id}
                      className="h-5 rounded-sm text-[11px] font-medium"
                      style={{
                        backgroundColor: `${label.color}20`,
                        color: label.color,
                      }}
                      variant="secondary"
                    >
                      {label.name}
                    </Badge>
                  ))}
                </div>
              )}
              <PriorityDropdown
                onChange={() => {}}
                value={issue.priority.toString()}
              />
              {/* <LabelDropdown
                projectId={projectId as string}
                onChange={() => {}}
                values={labels.map((label) => label.id)}
                maxDisplayedLabels={3}
              /> */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{dueDate}</span>
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
