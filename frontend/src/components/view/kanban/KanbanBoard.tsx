"use client";

import React, { useEffect, useMemo } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Plus, Search } from "lucide-react";
import { AlignLeft, Clock, Circle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Column from "./Column";
import IssueModal from "./IssueModal";
import { Issue } from "../../../app/kanban/_types/kanban";
import useIssueStore from "@/stores/issueStore";
import { useProjectLabelStore } from "@/stores/projectLabelStore";
import { useProjectStateStore } from "@/stores/projectStateStore";
import { useParams } from "next/navigation";

const stateGroups = [
  { name: "backlog", label: "Backlog", icon: AlignLeft },
  { name: "unstarted", label: "Unstarted", icon: Clock },
  { name: "started", label: "Started", icon: Circle },
  { name: "completed", label: "Completed", icon: CheckCircle2 },
  { name: "cancelled", label: "Cancelled", icon: XCircle },
];

export default function KanbanBoard() {
  const { issues, fetchIssues, updateIssue } = useIssueStore();
  const { states, fetchStates } = useProjectStateStore();
  const { labels, fetchLabels } = useProjectLabelStore();
  const [selectedIssue, setSelectedIssue] = React.useState<Issue | null>(null);

  const { workspaceSlug, projectId } = useParams();
  useEffect(() => {
    fetchIssues(workspaceSlug as string, projectId as string); // Replace with actual project ID
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
          ...state,
          icon: group.icon,
          issues: issues.filter((issue) => issue.state.id === state.id),
          state, // Add the state object to pass to Column
        }));
      })
      .flat();
  }, [states, issues]);

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

    updateIssue(workspaceSlug as string, projectId as string, issue.id, { stateId: newState.id });
  };

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const handleCloseModal = () => {
    setSelectedIssue(null);
  };

  return (
    <div className="flex h-screen flex-col bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="w-64 border-gray-700 bg-gray-800 pl-8 text-sm"
              placeholder="Tìm kiếm công việc..."
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px] border-gray-700 bg-gray-800 text-sm">
              <SelectValue placeholder="Lọc theo nhãn" />
            </SelectTrigger>
            <SelectContent>
              {labels.map((label) => (
                <SelectItem key={label.id} value={label.id}>
                  {label.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Thêm công việc
        </Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto">
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
