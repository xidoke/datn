"use client";

import React, { useEffect, useMemo } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Search, CalendarCheck2, CalendarClock } from "lucide-react";
import { AlignLeft, Clock, Circle, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import Column from "./Column";
import IssueModal from "./IssueModal";
import useIssueStore from "@/stores/issueStore";
import { useProjectLabelStore } from "@/stores/projectLabelStore";
import { useProjectStateStore } from "@/stores/projectStateStore";
import { useParams } from "next/navigation";
import { Issue, Label, State, TIssuePriorities } from "@/types";
import FilterDropdown from "@/components/dropdown/filter";
import { useFilterStore } from "@/stores/filterStore";
import { useMemberStore } from "@/stores/member/memberStore";
import PriorityMultiSelect from "@/components/dropdown/priority-multi-select";
import { DatePicker } from "@/components/ui/date-picker";

const stateGroups = [
  { name: "backlog", label: "Backlog", icon: AlignLeft },
  { name: "unstarted", label: "Unstarted", icon: Clock },
  { name: "started", label: "Started", icon: Circle },
  { name: "completed", label: "Completed", icon: CheckCircle2 },
  { name: "cancelled", label: "Cancelled", icon: XCircle },
];

interface KanbanBoardProps {
  issues: Issue[];
  states: State[];
  labels: Label[];
}

export default function KanbanBoard({
  issues,
  states,
  labels,
}: KanbanBoardProps) {
  const { fetchIssues, updateIssue } = useIssueStore();
  const { fetchStates } = useProjectStateStore();
  const { fetchLabels } = useProjectLabelStore();
  const { workspaceMemberIds, workspaceMemberMap } = useMemberStore();
  const {
    statusIds,
    assigneeIds,
    cycleIds,
    labelIds,
    priorityIds,
    startDate,
    dueDate,
    setFilter,
    reset: resetFilter,
  } = useFilterStore();
  const [selectedIssue, setSelectedIssue] = React.useState<Issue | null>(null);
  const [search, setSearch] = React.useState("");

  const issueAfterFilter = issues.filter((issue) => {
    if (
      statusIds.length > 0 &&
      !statusIds.includes(issue.state?.id as string)
    ) {
      return false;
    }

    if (
      labelIds.length > 0 &&
      !issue.labels?.some((label) => labelIds.includes(label.id))
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

    return true;
  });

  const issueAfterSearchandFilter = issueAfterFilter.filter((issue) => {
    if (
      search.length > 0 &&
      !issue.title.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const { workspaceSlug, projectId } = useParams();
  useEffect(() => {
    fetchIssues(workspaceSlug as string, projectId as string);
    fetchStates(workspaceSlug as string, projectId as string);
    fetchLabels(workspaceSlug as string, projectId as string);
  }, [fetchIssues, fetchStates, fetchLabels, workspaceSlug, projectId]);

  const columns = useMemo(() => {
    return stateGroups
      .map((group) => {
        const groupStates = states.filter(
          (state) => state.group === group.name,
        );
        return groupStates.map((state) => ({
          id: state.id,
          icon: group.icon,
          title: state.name,
          issues: issueAfterSearchandFilter.filter(
            (issue) => issue.state?.id === state.id,
          ),
          state,
        }));
      })
      .flat();
  }, [states, issueAfterSearchandFilter]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find(
      (col) => col.id === destination.droppableId,
    );

    if (!sourceColumn || !destColumn) return;

    const issue = issues.find((i) => i.id === draggableId);
    if (!issue) return;

    const newState = states.find((s) => s.id === destColumn.id);
    if (!newState) return;

    updateIssue(workspaceSlug as string, projectId as string, issue.id, {
      stateId: newState.id,
    });
  };

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const handleCloseModal = () => {
    setSelectedIssue(null);
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-end px-4 py-2">
        <div className="flex items-center gap-2">
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
            onDateChange={(date) => setFilter({ startDate: date })}
            placeholder="Start Date"
            Icon={CalendarCheck2}
            tooltipHeading="Filter Start Date"
          />
          <DatePicker
            date={dueDate}
            onDateChange={(date) => setFilter({ dueDate: date })}
            placeholder="Due Date"
            Icon={CalendarClock}
            tooltipHeading="Filter Due Date"
          />
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto scrollbar-thin">
          <div className="flex h-full gap-4 p-4">
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onIssueClick={handleIssueClick}
              />
            ))}
          </div>
        </div>
      </DragDropContext>
      {selectedIssue && (
        <IssueModal issue={selectedIssue} onClose={handleCloseModal} />
      )}
    </div>
  );
}
