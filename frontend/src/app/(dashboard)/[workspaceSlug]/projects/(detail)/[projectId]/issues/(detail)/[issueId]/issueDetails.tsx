"use client";

import React, { useState } from "react";
import { CalendarCheck2, CalendarClock } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_BASE_URL } from "@/helpers/common.helper";
import { CycleDropdown } from "@/components/dropdown/cycle";
import { IssueDropdown } from "@/components/dropdown/issue";
import { IssueFilesList } from "@/components/view/issue-files-list";
import { SubIssuesList } from "@/components/view/sub-issue-list";

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
  const { getIssueById, updateIssue, fetchIssueById } = useIssueStore();
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

      {/* Sub-issues */}
      <div>
        <SubIssuesList parentIssueId={issue.id} />
      </div>

      {/* Files */}
      <div>
        <IssueFilesList
          issue={issue}
          onUpdate={() => {
            fetchIssueById(
              workspaceSlug as string,
              projectId as string,
              issueId,
            );
          }}
        />
      </div>

      {/* Properties */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Properties
        </h3>

        <div className="space-y-4">
          {/* State */}
          <div className="flex items-center gap-4">
            <span className="w-24 text-sm text-muted-foreground">State</span>
            <StateDropdown
              size="sm"
              projectId={projectId as string}
              value={issue.stateId}
              onChange={async (value) => {
                await handleUpdateIssue({ stateId: value });
              }}
            />
          </div>

          {/* Assignees */}
          <div className="flex items-center gap-4">
            <span className="w-24 text-sm text-muted-foreground">
              Assignees
            </span>
            <AssigneeDropdown
              size="sm"
              projectId={projectId as string}
              values={issue.assignees.map(
                (assignee) => assignee?.workspaceMember?.user?.id,
              )}
              onChange={async (values) => {
                await updateIssue(
                  workspaceSlug as string,
                  projectId as string,
                  issue.id,
                  { assigneeIds: values },
                );
              }}
            />
          </div>

          {/* Priority */}
          <div className="flex items-center gap-4">
            <span className="w-24 text-sm text-muted-foreground">Priority</span>
            <PriorityDropdown
              size="sm"
              onChange={async (newPriority) => {
                await handleUpdateIssue({ priority: +newPriority });
              }}
              value={issue.priority.toString() as TIssuePriorities}
            />
          </div>

          {/* Dates */}
          <div className="flex items-center gap-4">
            <span className="w-24 text-sm text-muted-foreground">
              Start date
            </span>
            <DatePicker
              size="sm"
              date={issue.startDate}
              Icon={CalendarCheck2}
              onDateChange={(date) => {
                handleUpdateIssue({ startDate: date });
              }}
              maxDate={issue.dueDate}
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="w-24 text-sm text-muted-foreground">Due date</span>
            <DatePicker
              size="sm"
              date={issue.dueDate}
              Icon={CalendarClock}
              onDateChange={(date) => {
                handleUpdateIssue({ dueDate: date });
              }}
              minDate={issue.startDate}
            />
          </div>

          {/* Labels */}
          <div className="flex items-center gap-4">
            <span className="w-24 text-sm text-muted-foreground">Labels</span>
            <LabelDropdown
              size="sm"
              projectId={projectId as string}
              placeHolder="Add labels"
              onChange={async (values) => {
                await handleUpdateIssue({ labelIds: values });
              }}
              values={issue.labels.map((label) => label.id)}
              maxDisplayedLabels={7}
            />
          </div>

          {/* Cycle */}
          <div className="flex items-center gap-4">
            <span className="w-24 text-sm text-muted-foreground">Cycle</span>
            <CycleDropdown
              size="sm"
              projectId={projectId as string}
              value={issue.cycleId}
              onChange={async (value) => {
                await handleUpdateIssue({ cycleId: value });
              }}
            />
          </div>

          {/* Parent */}
          <div className="flex items-center gap-4 overflow-y-auto">
            <span className="w-24 text-sm text-muted-foreground">
              Parent issue
            </span>

            <IssueDropdown
              size="sm"
              projectId={projectId as string}
              value={issue.parentId}
              onChange={async (value) => {
                await handleUpdateIssue({ parentId: value });
              }}
            />
          </div>

          {/* Creator */}
          <div className="flex items-center gap-4 overflow-y-auto">
            <span className="w-24 text-sm text-muted-foreground">Creator</span>

            <Avatar>
              <AvatarImage
                className="h-8 w-8"
                src={API_BASE_URL + issue.creator?.avatarUrl}
              />
              <AvatarFallback>
                {(issue.creator.firstName?.charAt(0).toUpperCase() ??
                  "" + issue.creator.lastName?.charAt(0).toUpperCase() ??
                  "") ||
                  issue.creator.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
}
