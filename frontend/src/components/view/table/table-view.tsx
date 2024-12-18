"use client";

import React from "react";
import { Issue, Label, State, TIssuePriorities } from "@/types";
import { PriorityDropdown } from "@/components/dropdown/priority";
import { StateDropdown } from "@/components/dropdown/state";
import { AssigneeDropdown } from "@/components/dropdown/assignees";
import { LabelDropdown } from "@/components/dropdown/label";
import useIssueStore from "@/stores/issueStore";
import { useParams } from "next/navigation";
import { CycleDropdown } from "@/components/dropdown/cycle";
import { DatePicker } from "@/components/ui/date-picker";
import { CalendarCheck2, CalendarClock } from "lucide-react";

interface TableViewProps {
  issues: Issue[];
  states: State[];
  labels: Label[];
}

export default function TableView({ issues, states, labels }: TableViewProps) {
  const { updateIssue } = useIssueStore();
  const { workspaceSlug, projectId } = useParams();

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-max border-collapse">
          <thead className="sticky top-0 z-20 bg-background">
            <tr className="border-b">
              {/* Fixed columns */}
              <th className="sticky left-0 z-30 bg-background px-4 py-3 text-left">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Issues</span>
                </div>
              </th>

              {/* Scrollable columns */}
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">State</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Priority</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Assignees</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Labels</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Cycle</span>
                </div>
              </th>

              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Start Date</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Due Date</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} className="group border-b hover:bg-muted/50">
                {/* Fixed columns */}
                <td className="sticky left-0 z-10 bg-background px-4 py-2 group-hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {issue.fullIdentifier}
                    </span>
                    <span className="text-sm">{issue.title}</span>
                  </div>
                </td>

                {/* Scrollable columns */}
                <td className="px-4 py-2">
                  <StateDropdown
                    size="sm"
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
                </td>
                <td className="px-4 py-2">
                  <PriorityDropdown
                    size="sm"
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
                </td>
                <td className="px-4 py-2">
                  <AssigneeDropdown
                    size="sm"
                    projectId={projectId as string}
                    values={issue.assignees.map(
                      (assignee) => assignee.user?.id,
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
                </td>
                <td className="px-4 py-2">
                  <LabelDropdown
                    projectId={projectId as string}
                    placeHolder="Select labels"
                    size="sm"
                    onChange={async (values) => {
                      await updateIssue(
                        workspaceSlug as string,
                        projectId as string,
                        issue.id,
                        { labelIds: values },
                      );
                    }}
                    values={issue.labels.map((label) => label.id)}
                  />
                </td>

                <td className="px-4 py-2">
                  <CycleDropdown
                    projectId={projectId as string}
                    value={issue.cycleId}
                    onChange={async (value) => {
                      await updateIssue(
                        workspaceSlug as string,
                        projectId as string,
                        issue.id,
                        { cycleId: value },
                      );
                    }}
                    size="sm"
                  />
                </td>

                <td className="px-4 py-2">
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
                    // placeholder="start date"
                  />
                </td>

                <td className="px-4 py-2">
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
                    // placeholder="due date"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
