"use client";

import React from "react";
import { Issue } from "@/types";
import { cn } from "@/lib/utils";

interface GanttSidebarProps {
  issues: Issue[];
}

export default function GanttSidebar({ issues }: GanttSidebarProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 bg-background p-4 font-medium">
        Issues
      </div>
      <div className="space-y-1 p-2">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="flex items-center gap-2 rounded-sm p-2 hover:bg-muted/50"
          >
            <span className="text-xs text-muted-foreground">
              {issue.fullIdentifier}
            </span>
            <span className="line-clamp-1 flex-1 text-sm">
              {issue.title}
            </span>
            {issue.startDate && issue.dueDate && (
              <span className="text-xs text-muted-foreground">
                {Math.ceil(
                  (new Date(issue.dueDate).getTime() -
                    new Date(issue.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

