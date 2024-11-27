"use client";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Calendar, PlusCircle, Tag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { useProjectLabelStore } from "../../../app/kanban/_stores/projectLabelStore";
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

interface IssueCardProps {
  issue: Issue;
  index: number;
  onClick: () => void;
}

export default function IssueCard({ issue, index, onClick }: IssueCardProps) {
  const { labels: projectLabels } = useProjectLabelStore();
  const { updateIssue } = useIssueStore();
  const [isLabelPopoverOpen, setIsLabelPopoverOpen] = useState(false);
  const { workspaceSlug, projectId } = useParams();

  const handleLabelToggle = (e: React.MouseEvent, label: Label) => {
    e.stopPropagation();
    const updatedLabels = issue.labels?.some((l) => l.id === label.id)
      ? issue.labels.filter((l) => l.id !== label.id)
      : [...(issue.labels || []), label];

    updateIssue(workspaceSlug as string, projectId as string, issue.id, {
      labelIds: updatedLabels.map((l) => l.id),
    });
  };

  const handleLabelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLabelPopoverOpen(true);
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setIsLabelPopoverOpen(open);
  };

  return (
    <Draggable draggableId={issue.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className="group cursor-pointer rounded-md border border-gray-700 bg-gray-800/50 p-2.5 transition-colors hover:bg-gray-800"
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-medium text-gray-400">
                {issue.fullIdentifier}
              </span>
              {issue.assignee && (
                <Avatar className="h-5 w-5 border-2 border-gray-800 group-hover:border-gray-700">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt={issue.assignee}
                  />
                  <AvatarFallback className="text-[10px]">
                    {issue.assignee[0]}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <h3 className="text-sm font-medium leading-tight text-gray-200">
              {issue.title}
            </h3>
            <div className="flex items-center gap-1">
              {issue.labels?.slice(0, 2).map((label) => (
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
              {(issue.labels?.length ?? 0) > 2 && (
                <Badge
                  className="h-5 rounded-sm bg-gray-700 text-[11px] font-medium text-gray-300"
                  variant="secondary"
                >
                  +{issue.labels!.length - 2}
                </Badge>
              )}
              <Popover
                open={isLabelPopoverOpen}
                onOpenChange={handlePopoverOpenChange}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full bg-gray-700 hover:bg-gray-600"
                    onClick={handleLabelClick}
                  >
                    <PlusCircle className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-64"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-2">
                    <h4 className="font-medium">Add/Remove Labels</h4>
                    {projectLabels?.map((label) => (
                      <div
                        key={label.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`label-${label.id}`}
                          checked={
                            issue.labels?.some((l) => l.id === label.id) ??
                            false
                          }
                          onCheckedChange={(checked) => {
                            handleLabelToggle(event as React.MouseEvent, label);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label
                          htmlFor={`label-${label.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {label.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {
                  <span>
                    {issue.startDate &&
                      new Date(issue.startDate).toLocaleDateString()}
                    {issue.startDate &&
                      issue.dueDate &&
                      " - " + new Date(issue.dueDate).toLocaleDateString()}
                  </span>
                }
                <span>
                  updated: {new Date(issue.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
