"use client";

import React, { useEffect, useMemo } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { CalendarCheck2, CalendarClock } from "lucide-react";
import Column from "./Column";
import IssueModal from "../IssueModal";
import useIssueStore from "@/stores/issueStore";
import { useProjectLabelStore } from "@/stores/projectLabelStore";
import { useProjectStateStore } from "@/stores/projectStateStore";
import { useParams } from "next/navigation";
import { Issue, Label, State, TIssuePriorities } from "@/types";
import { useFilterStore } from "@/stores/filterStore";
import { DatePicker } from "@/components/ui/date-picker";
import { stateGroups, TStateGroups } from "@/components/icons/state/helper";
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
  const { statusIds, labelIds, priorityIds, startDate, dueDate, search } =
    useFilterStore();
  const [selectedIssue, setSelectedIssue] = React.useState<Issue | null>(null);

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
          issues: issueAfterFilter.filter(
            (issue) => issue.state?.id === state.id,
          ),
          state,
        }));
      })
      .flat();
  }, [states, issueAfterFilter]);

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
