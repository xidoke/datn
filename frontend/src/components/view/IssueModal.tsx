"use client";

import React, { useState, useEffect, Suspense } from "react";
import { CalendarCheck2, CalendarClock, Maximize2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Issue, TIssuePriorities } from "@/types";
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";
import useIssueStore, { IssueUpdateDto } from "@/stores/issueStore";
import { useParams } from "next/navigation";
import { StateDropdown } from "@/components/dropdown/state";
import { PriorityDropdown } from "@/components/dropdown/priority";
import { DatePicker } from "@/components/ui/date-picker";
import { LabelDropdown } from "@/components/dropdown/label";
import { AssigneeDropdown } from "@/components/dropdown/assignees";
import Link from "next/link";
import Comments from "@/components/comment/comments";
import { IssueDropdown } from "../dropdown/issue";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { SubIssuesList } from "./sub-issue-list";

interface IssueModalProps {
  issue: Issue;
  onClose: () => void;
}

export default function IssueModal({ issue, onClose }: IssueModalProps) {
  const [localIssue, setLocalIssue] = useState(issue);
  const [description, setDescription] = useState(issue.description || "");
  const [isEditing, setIsEditing] = useState(false);
  const { updateIssue } = useIssueStore();
  const { workspaceSlug, projectId } = useParams();

  useEffect(() => {
    setLocalIssue(issue);
    setDescription(issue.description || "");
  }, [issue]);

  const handleUpdateIssue = async (updateData: Partial<IssueUpdateDto>) => {
    await updateIssue(
      workspaceSlug as string,
      projectId as string,
      localIssue.id,
      updateData,
    );
    setLocalIssue({
      ...localIssue,
      ...updateData,
    });
  };

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="z-50 w-full sm:max-w-none md:w-[50%]">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b px-6 py-4">
            {/* link to detail page */}
            <Link
              href={`/${workspaceSlug}/projects/${projectId}/issues/${issue.id}`}
            >
              <div className="flex items-center gap-2">
                <Maximize2 size={16} />
                <span className="text-xs text-muted-foreground">
                  {localIssue.fullIdentifier}
                </span>
              </div>
            </Link>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-base font-medium">
                {localIssue.fullIdentifier}: {localIssue.title}
              </SheetTitle>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-auto">
            <div className="space-y-6 p-6">
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
                          setDescription(localIssue.description || "");
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
                <SubIssuesList parentIssueId={localIssue.id} />
              </div>
              {/* Properties */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Properties
                </h3>

                <div className="space-y-4">
                  {/* State */}
                  <div className="flex items-center gap-4">
                    <span className="w-24 text-sm text-muted-foreground">
                      State
                    </span>
                    <StateDropdown
                      size="sm"
                      projectId={projectId as string}
                      value={localIssue.stateId}
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
                      size="icon"
                      projectId={projectId as string}
                      values={localIssue.assignees.map(
                        (assignee) => assignee?.workspaceMember?.user?.id,
                      )}
                      onChange={async (values) => {
                        const updatedAssignees = values.map((id) => ({
                          user: { id },
                        }));
                        await updateIssue(
                          workspaceSlug as string,
                          projectId as string,
                          issue.id,
                          { assigneeIds: values },
                        );
                        setLocalIssue((prev) => ({
                          ...prev,
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          assignees: updatedAssignees as any, //TODO: Fix this
                        }));
                      }}
                    />
                  </div>

                  {/* Priority */}
                  <div className="flex items-center gap-4">
                    <span className="w-24 text-sm text-muted-foreground">
                      Priority
                    </span>
                    <PriorityDropdown
                      size="sm"
                      onChange={async (newPriority) => {
                        await handleUpdateIssue({ priority: +newPriority });
                      }}
                      value={localIssue.priority.toString() as TIssuePriorities}
                    />
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-4">
                    <span className="w-24 text-sm text-muted-foreground">
                      Start date
                    </span>
                    <DatePicker
                      size="sm"
                      date={localIssue.startDate}
                      Icon={CalendarCheck2}
                      onDateChange={(date) => {
                        handleUpdateIssue({ startDate: date });
                      }}
                      maxDate={localIssue.dueDate}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="w-24 text-sm text-muted-foreground">
                      Due date
                    </span>
                    <DatePicker
                      size="sm"
                      date={localIssue.dueDate}
                      Icon={CalendarClock}
                      onDateChange={(date) => {
                        handleUpdateIssue({ dueDate: date });
                      }}
                      minDate={localIssue.startDate}
                    />
                  </div>

                  {/* Labels */}
                  <div className="flex items-center gap-4">
                    <span className="w-24 text-sm text-muted-foreground">
                      Labels
                    </span>
                    <LabelDropdown
                      size="sm"
                      projectId={projectId as string}
                      placeHolder="Add labels"
                      onChange={async (values) => {
                        await handleUpdateIssue({ labelIds: values });

                        setLocalIssue((prev) => ({
                          ...prev,
                          labels: values.map((id) => ({
                            id,
                            name: "",
                            color: "", //TODO: Fix this
                          })),
                        }));
                      }}
                      values={localIssue.labels.map((label) => label.id)}
                      maxDisplayedLabels={2}
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
                      value={localIssue.parentId}
                      onChange={async (value) => {
                        await handleUpdateIssue({ parentId: value });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Activity
                </h3>
                {/* Activity content */}
                <Suspense fallback={<div>Loading comments...</div>}>
                  <Comments
                    issueId={issue.id}
                    projectId={projectId as string}
                    workspaceSlug={workspaceSlug as string}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
