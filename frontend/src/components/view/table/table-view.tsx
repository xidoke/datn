"use client";

import React, { useState, useMemo } from "react";
import { Issue, Label, State, TIssuePriorities } from "@/types";
import { PriorityDropdown } from "@/components/dropdown/priority";
import { StateDropdown } from "@/components/dropdown/state";
import { AssigneeDropdown } from "@/components/dropdown/assignees";
import { LabelDropdown } from "@/components/dropdown/label";
import useIssueStore from "@/stores/issueStore";
import { useParams } from "next/navigation";
import { CycleDropdown } from "@/components/dropdown/cycle";
import { DatePicker } from "@/components/ui/date-picker";
import { CalendarCheck2, CalendarClock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import FilterDropdown from "@/components/dropdown/filter";
import { useFilterStore } from "@/stores/filterStore";
import PriorityMultiSelect from "@/components/dropdown/priority-multi-select";
import IssueModal from "../kanban/IssueModal";

interface TableViewProps {
  issues: Issue[];
  states: State[];
  labels: Label[];
}

export default function TableView({ issues, states, labels }: TableViewProps) {
  const { updateIssue } = useIssueStore();
  const { workspaceSlug, projectId } = useParams();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [search, setSearch] = useState("");
  const { statusIds, labelIds, priorityIds, startDate, dueDate, setFilter } =
    useFilterStore();

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (
        statusIds.length > 0 &&
        !statusIds.includes(issue.state?.id as string)
      ) {
        return false;
      }
      if (
        labelIds.length > 0 &&
        !issue.labels.some((label) => labelIds.includes(label.id))
      ) {
        return false;
      }
      if (
        priorityIds.length > 0 &&
        !priorityIds.includes(issue.priority.toString() as TIssuePriorities)
      ) {
        return false;
      }
      if (
        startDate &&
        issue.startDate &&
        new Date(issue.startDate) < new Date(startDate)
      ) {
        return false;
      }
      if (
        dueDate &&
        issue.dueDate &&
        new Date(issue.dueDate) > new Date(dueDate)
      ) {
        return false;
      }
      if (search && !issue.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [issues, statusIds, labelIds, priorityIds, startDate, dueDate, search]);

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const handleCloseModal = () => {
    setSelectedIssue(null);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-end gap-2 p-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="w-64 pl-8 text-sm"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <FilterDropdown
          label="Status"
          options={states}
          selectedIds={statusIds}
          onChange={(selected) => setFilter({ statusIds: selected })}
        />
        <FilterDropdown
          label="Labels"
          options={labels}
          selectedIds={labelIds}
          onChange={(selected) => setFilter({ labelIds: selected })}
        />
        <PriorityMultiSelect
          selectedPriorities={priorityIds}
          onChange={(selected) => setFilter({ priorityIds: selected })}
        />
        <DatePicker
          date={startDate}
          onDateChange={(date) => setFilter({ startDate: date || undefined })}
          placeholder="Start Date"
          Icon={CalendarCheck2}
          tooltipHeading="Filter Start Date"
        />
        <DatePicker
          date={dueDate}
          onDateChange={(date) => setFilter({ dueDate: date || undefined })}
          placeholder="Due Date"
          Icon={CalendarClock}
          tooltipHeading="Filter Due Date"
        />
      </div>
      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-max border-collapse">
          <thead className="sticky top-0 z-20 bg-backdrop">
            <tr className="border-b *:px-4 *:py-3 *:text-center">
              {/* Fixed columns */}
              <th className="sticky left-0 z-30 px-4 py-3 text-left">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Issues</span>
                </div>
              </th>

              {/* Scrollable columns */}
              {[
                "State",
                "Priority",
                "Assignees",
                "Labels",
                "Cycle",
                "Start Date",
                "Due Date",
              ].map((key) => (
                <th className="" key={key}>
                  <div className="flex items-center gap-2">
                    <span className="mx-auto text-sm font-medium">{key}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue) => (
              <tr
                key={issue.id}
                className="group cursor-pointer border-b *:border *:bg-background"
              >
                {/* Fixed columns */}
                <td
                  className="sticky left-0 z-10 border-r px-4 py-2"
                  onClick={() => handleIssueClick(issue)}
                >
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
                      (assignee) => assignee.workspaceMember.user?.id,
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
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedIssue && (
        <IssueModal issue={selectedIssue} onClose={handleCloseModal} />
      )}
    </div>
  );
}
