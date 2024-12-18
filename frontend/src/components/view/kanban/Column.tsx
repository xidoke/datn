"use client";

import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Column as ColumnType, Issue, State } from "@/types";
import { Button } from "@/components/ui/button";
import IssueCard from "./IssueCard";
import { CreateIssueDialog } from "@/components/issues/create-issue-dialog";
import { Card } from "@/components/ui/card";
import { useColumnStore } from "@/stores/columnStore";
import { cn } from "@/lib/utils";

interface ColumnProps {
  column: ColumnType & { state: State };
  onIssueClick: (issue: Issue) => void;
}

export default function Column({ column, onIssueClick }: ColumnProps) {
  const Icon = column.icon;
  const { isColumnCollapsed, toggleColumn } = useColumnStore();
  const collapsed = isColumnCollapsed(column.id);

  return (
    <Card
      className={cn(
        "flex h-full flex-col bg-muted/50 transition-all duration-200",
        collapsed ? "w-10 min-w-[2.5rem]" : "min-w-[300px]",
      )}
    >
      <div
        className={cn(
          "mb-2 flex items-center justify-between px-2 py-1",
          collapsed && "flex-col gap-4",
        )}
      >
        <div className={cn("flex items-center gap-2", collapsed && "flex-col")}>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-transparent"
            onClick={() => toggleColumn(column.id)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          {Icon && (
            <Icon
              className={cn("h-4 w-4", collapsed && "h-5 w-5")}
              style={{ color: column.state.color }}
            />
          )}
          {!collapsed && (
            <>
              <h2
                className="text-sm font-medium"
                style={{ color: column.state.color }}
              >
                {column.state.name}
              </h2>
              <span className="text-xs font-medium text-gray-500">
                {column.issues.length}
              </span>
            </>
          )}
        </div>
        {!collapsed && (
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
          </div>
        )}
      </div>
      {!collapsed && (
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="scrollbar-thumb-primary-500 scrollbar-track-primary-200 flex-1 space-y-2 overflow-y-auto px-1 scrollbar-none"
            >
              {column.issues
                .sort(
                  (issueA, issueB) =>
                    issueA.sequenceNumber - issueB.sequenceNumber,
                )
                .map((issue, index) => (
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
      )}
    </Card>
  );
}
