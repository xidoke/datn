"use client";

import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useIssueStore, Issue } from "@/stores/issue/issueStore";
import { useProjectStateStore} from "@/stores/projectStateStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { IssueModal } from "./_components/issue-modal";
import { State } from "@/types/state";

const IssueCard: React.FC<{ issue: Issue; index: number }> = ({
  issue,
  index,
}) => (
  <Draggable draggableId={issue.id} index={index}>
    {(provided) => (
      <Card
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="mb-2 cursor-pointer"
      >
        <CardContent className="p-2">
          <h3 className="font-medium">{issue.title}</h3>
          <p className="text-sm text-muted-foreground">{issue.description}</p>
          <div className="mt-2 flex space-x-1">
            {issue.labels.map((label) => (
              <span
                key={label.id}
                className="rounded-full px-2 py-1 text-xs"
                style={{
                  backgroundColor: label.color,
                  color: "white",
                }}
              >
                {label.name}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    )}
  </Draggable>
);

const StateColumn: React.FC<{ state: State; issues: Issue[] }> = ({
  state,
  issues,
}) => (
  <div className="w-64 flex-shrink-0">
    <h2 className="mb-2 font-semibold" style={{ color: state.color }}>
      {state.name}
    </h2>
    <Droppable droppableId={state.id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="min-h-[200px] rounded-md bg-secondary p-2"
        >
          {issues.map((issue, index) => (
            <IssueCard key={issue.id} issue={issue} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
    <Button
      variant="ghost"
      size="sm"
      className="mt-2 w-full"
      onClick={() => {
        /* TODO: Implement add issue */
      }}
    >
      <Plus className="mr-1 h-4 w-4" /> Add Issue
    </Button>
  </div>
);

export default function KanbanBoard() {
  const { issues, fetchIssues, updateIssue } = useIssueStore();
  const { states, fetchStates } = useProjectStateStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | undefined>(
    undefined,
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchIssues("project-id"),
          fetchStates("project-id"),
        ]);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchIssues, fetchStates]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const issue = issues.find((i) => i.id === draggableId);
    const newState = states.find((s) => s.id === destination.droppableId);

    if (issue && newState) {
      const updatedIssue = { ...issue, state: newState };
      await updateIssue(issue.id, updatedIssue);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Kanban Board</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto">
          {states.map((state) => (
            <StateColumn
              key={state.id}
              state={state}
              issues={issues.filter((issue) => issue.state.id === state.id)}
            />
          ))}
        </div>
      </DragDropContext>
      <IssueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        issue={selectedIssue}
      />
    </div>
  );
}
