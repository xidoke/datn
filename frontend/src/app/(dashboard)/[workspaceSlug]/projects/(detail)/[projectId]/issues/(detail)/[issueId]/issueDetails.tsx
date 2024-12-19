"use client";

import React, { useState } from "react";
import { Link2, CalendarCheck2, CalendarClock } from "lucide-react";
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";
import { StateDropdown } from "@/components/dropdown/state";
import { PriorityDropdown } from "@/components/dropdown/priority";
import { DatePicker } from "@/components/ui/date-picker";
import { LabelDropdown } from "@/components/dropdown/label";
import { AssigneeDropdown } from "@/components/dropdown/assignees";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useIssueStore from "@/stores/issueStore";
import { TIssuePriorities } from "@/types";

interface IssueDetailProps {
  workspaceSlug: string;
  projectId: string;
  issueId: string;
}

export default function IssueDetail({
  workspaceSlug,
  projectId,
  issueId,
}: IssueDetailProps) {
  const { getIssueById, updateIssue } = useIssueStore();
  const issue = getIssueById(issueId);

  const [description, setDescription] = useState(issue?.description || "");
  const [isEditing, setIsEditing] = useState(false);

  if (!issue) {
    return <div>Issue not found. Please ensure the data is loaded.</div>;
  }

  const handleUpdateIssue = async (updateData: Partial<typeof issue>) => {
    await updateIssue(workspaceSlug, projectId, issue.id, updateData);
  };
  return (
    <div className="space-y-6">
      {/* Issue header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium">
            {issue.fullIdentifier}: {issue.title}
          </h1>
          <Link
            href={`/${workspaceSlug}/projects/${projectId}/issues/${issue.id}`}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link2 size={16} />
              <span>{issue.fullIdentifier}</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Description
        </h3>
        {isEditing ? (
          <div className="space-y-2">
            <AutoResizeTextarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a more detailed description..."
              className="w-full"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDescription(issue.description || "");
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={async () => {
                  await handleUpdateIssue({ description });
                  setIsEditing(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="min-h-[100px] cursor-pointer whitespace-pre-wrap text-sm"
            onClick={() => setIsEditing(true)}
          >
            {description || "Click to add description"}
          </div>
        )}
      </div>

      {/* Properties */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Properties
        </h3>

        {/* State */}
        <div className="flex items-center gap-4">
          <span className="w-24 text-sm text-muted-foreground">State</span>
          <StateDropdown
            size="sm"
            projectId={projectId}
            value={issue.stateId}
            onChange={async (value) => {
              await handleUpdateIssue({ stateId: value });
            }}
          />
        </div>

        {/* Assignees */}
        <div className="flex items-center gap-4">
          <span className="w-24 text-sm text-muted-foreground">Assignees</span>
          <AssigneeDropdown
            size="icon"
            projectId={projectId}
            values={issue.assignees.map(
              (assignee) => assignee.workspaceMember?.user?.id,
            )}
            onChange={async (values) => {
              await handleUpdateIssue({ assigneeIds: values });
            }}
          />
        </div>

        {/* Priority */}
        <div className="flex items-center gap-4">
          <span className="w-24 text-sm text-muted-foreground">Priority</span>
          <PriorityDropdown
            size="sm"
            value={issue.priority.toString() as TIssuePriorities}
            onChange={async (newPriority) => {
              await handleUpdateIssue({ priority: +newPriority });
            }}
          />
        </div>

        {/* Dates */}
        <div className="flex items-center gap-4">
          <span className="w-24 text-sm text-muted-foreground">Start date</span>
          <DatePicker
            date={issue.startDate}
            Icon={CalendarCheck2}
            onDateChange={(date) => handleUpdateIssue({ startDate: date })}
            maxDate={issue.dueDate}
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="w-24 text-sm text-muted-foreground">Due date</span>
          <DatePicker
            date={issue.dueDate}
            Icon={CalendarClock}
            onDateChange={(date) => handleUpdateIssue({ dueDate: date })}
            minDate={issue.startDate}
          />
        </div>

        {/* Labels */}
        <div className="flex items-center gap-4">
          <span className="w-24 text-sm text-muted-foreground">Labels</span>
          <LabelDropdown
            projectId={projectId}
            placeHolder="Add labels"
            values={issue.labels.map((label) => label.id)}
            onChange={async (values) => {
              await handleUpdateIssue({ labelIds: values });
            }}
            maxDisplayedLabels={2}
          />
        </div>
      </div>
    </div>
  );
}
