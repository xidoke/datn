/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { Plus } from "lucide-react";
import { Column as ColumnType, Issue, State } from "@/types";
import { Button } from "@/components/ui/button";
import IssueCard from "./IssueCard";
import { CreateIssueDialog } from "@/components/issues/create-issue-dialog";
import { Card } from "@/components/ui/card";

interface ColumnProps {
  column: ColumnType & { state: State };
  onIssueClick: (issue: Issue) => void;
}

export default function Column({ column, onIssueClick }: ColumnProps) {
  const Icon = column.icon;

  return (
    <Card className="flex h-full min-w-[320px] flex-col bg-muted/50">
      <div className="mb-2 flex items-center justify-between px-2 py-1">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon className="h-4 w-4" style={{ color: column.state.color }} />
          )}
          <h2
            className="text-sm font-medium"
            style={{ color: column.state.color }}
          >
            {column.state.name}
          </h2>
          <span className="text-xs font-medium text-gray-500">
            {column.issues.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <CreateIssueDialog stateId={column.state.id}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-gray-300"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </CreateIssueDialog>

          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-gray-300"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>
                xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 space-y-2 overflow-y-auto px-2"
          >
            {column.issues.map((issue, index) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                index={index}
                onClick={() => onIssueClick(issue)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Card>
  );
}
