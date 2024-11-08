"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIssues } from "@/hooks/useIssues";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

const issueStates = [
  { id: "backlog", name: "Backlog", count: 17 },
  { id: "todo", name: "Todo", count: 1 },
  { id: "in_progress", name: "In Progress", count: 3 },
  { id: "done", name: "Done", count: 4 },
];

export default function BoardPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { issues, isLoading, updateIssue } = useIssues(params.projectId);
  const [columns, setColumns] = useState(issueStates);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    // Update issue state
    updateIssue({
      id: draggableId,
      status: destination.droppableId,
    });
  };

  return (
    <div className="h-full overflow-x-auto p-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-full gap-4">
          {columns.map((column) => (
            <div key={column.id} className="flex w-80 flex-none flex-col">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{column.name}</h3>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                    {column.count}
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col gap-2"
                  >
                    {issues
                      .filter((issue) => issue.status === column.id)
                      .map((issue, index) => (
                        <Draggable
                          key={issue.id}
                          draggableId={issue.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="rounded-lg border bg-card p-3"
                            >
                              <div className="mb-2 text-sm font-medium">
                                {issue.title}
                              </div>
                              <div className="flex items-center gap-2">
                                {issue.labels?.map((label) => (
                                  <span
                                    key={label.id}
                                    className="rounded-full bg-primary/10 px-2 py-0.5 text-xs"
                                    style={{
                                      backgroundColor: label.color + "20",
                                    }}
                                  >
                                    {label.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
