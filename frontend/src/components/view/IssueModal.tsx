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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { API_BASE_URL } from "@/helpers/common.helper";

interface IssueModalProps {
  issue: Issue;
  onClose: () => void;
}

export default function IssueModal({ issue, onClose }: IssueModalProps) {
  const issueId = issue.id;
  const { issues } = useIssueStore();
  const issueModal = issues.find((i) => i.id === issueId);



  if (!issueModal) {
    return null;
  }

  const [description, setDescription] = useState(issueModal?.description || "");
  const [isEditing, setIsEditing] = useState(false);

  const { updateIssue } = useIssueStore();
  const { workspaceSlug, projectId } = useParams();

  // useEffect(() => {
  //   setLocalIssue(issue);
  //   setDescription(issue.description || "");
  // }, [issue]);

  const handleUpdateIssue = async (updateData: Partial<IssueUpdateDto>) => {
    await updateIssue(
      workspaceSlug as string,
      projectId as string,
      issueModal.id,
      updateData,
    );
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
                  {issueModal.fullIdentifier}
                </span>
              </div>
            </Link>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-base font-medium">
                {issueModal.fullIdentifier}: {issueModal.title}
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
                          setDescription(issueModal.description || "");
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
                <SubIssuesList parentIssueId={issueModal.id} />
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
                      value={issueModal.stateId}
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
                      values={issueModal.assignees.map(
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
                      value={issueModal.priority.toString() as TIssuePriorities}
                    />
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-4">
                    <span className="w-24 text-sm text-muted-foreground">
                      Start date
                    </span>
                    <DatePicker
                      size="sm"
                      date={issueModal.startDate}
                      Icon={CalendarCheck2}
                      onDateChange={(date) => {
                        handleUpdateIssue({ startDate: date });
                      }}
                      maxDate={issueModal.dueDate}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="w-24 text-sm text-muted-foreground">
                      Due date
                    </span>
                    <DatePicker
                      size="sm"
                      date={issueModal.dueDate}
                      Icon={CalendarClock}
                      onDateChange={(date) => {
                        handleUpdateIssue({ dueDate: date });
                      }}
                      minDate={issueModal.startDate}
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

                      }}
                      values={issueModal.labels.map((label) => label.id)}
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
                      value={issueModal.parentId}
                      onChange={async (value) => {
                        await handleUpdateIssue({ parentId: value });
                      }}
                    />
                  </div>

                  {/* Creator */}
                  <div className="flex items-center gap-4 overflow-y-auto">
                    <span className="w-24 text-sm text-muted-foreground">
                      Creator
                    </span>

                    <Avatar>
                      <AvatarImage
                        className="h-8 w-8"
                        src={API_BASE_URL + issueModal.creator?.avatarUrl}
                      />
                      <AvatarFallback>
                        {(issueModal.creator.firstName
                          ?.charAt(0)
                          .toUpperCase() ??
                          "" +
                            issueModal.creator.lastName
                              ?.charAt(0)
                              .toUpperCase() ??
                          "") ||
                          issueModal.creator.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
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
