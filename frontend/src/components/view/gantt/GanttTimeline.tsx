"use client";

import React from "react";
import { format, isToday } from "date-fns";
import { Issue } from "@/types";
import { cn } from "@/lib/utils";

interface GanttTimelineProps {
  issues: Issue[];
  dateRange: Date[];
  viewMode: "week" | "month" | "quarter";
}

export default function GanttTimeline({
  issues,
  dateRange,
  viewMode,
}: GanttTimelineProps) {
  return (
    <div className="relative">
      {/* Timeline Header */}
      <div className="sticky top-0 z-10 bg-background">
        <div className="flex border-b">
          {dateRange.map((date) => (
            <div
              key={date.toISOString()}
              className={cn(
                "flex-1 border-r p-2 text-center",
                isToday(date) && "bg-primary/5",
              )}
            >
              <div className="text-xs text-muted-foreground">
                {format(date, "EEE")}
              </div>
              <div className="font-medium">{format(date, "d")}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="relative">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="relative flex border-b"
            style={{ height: "40px" }}
          >
            {dateRange.map((date) => (
              <div
                key={date.toISOString()}
                className={cn(
                  "flex-1 border-r",
                  isToday(date) && "bg-primary/5",
                )}
              >
                {issue.startDate &&
                  issue.dueDate &&
                  format(date, "yyyy-MM-dd") >=
                    format(new Date(issue.startDate), "yyyy-MM-dd") &&
                  format(date, "yyyy-MM-dd") <=
                    format(new Date(issue.dueDate), "yyyy-MM-dd") && (
                    <div
                      className="absolute inset-y-0 bg-primary/20"
                      style={{
                        left: `${
                          dateRange.findIndex(
                            (d) =>
                              format(d, "yyyy-MM-dd") ===
                              format(new Date(issue.startDate ?? ""), "yyyy-MM-dd"),
                          ) * 100
                        }%`,
                        width: `${
                          (dateRange.findIndex(
                            (d) =>
                              format(d, "yyyy-MM-dd") ===
                              format(new Date(issue.dueDate ?? ""), "yyyy-MM-dd"),
                          ) -
                            dateRange.findIndex(
                              (d) =>
                                format(d, "yyyy-MM-dd") ===
                                format(new Date(issue.startDate ?? ""), "yyyy-MM-dd"),
                            ) +
                            1) *
                          100
                        }%`,
                      }}
                    />
                  )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
