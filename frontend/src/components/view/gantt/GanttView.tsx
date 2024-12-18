"use client";

import React, { useMemo, useState } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";
import { Issue, Label, State } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import GanttTimeline from "./GanttTimeline";
import GanttSidebar from "./GanttSidebar";
import { cn } from "@/lib/utils";

interface GanttViewProps {
  issues: Issue[];
  states: State[];
  labels: Label[];
}

type ViewMode = "week" | "month" | "quarter";

export default function GanttView({ issues, states, labels }: GanttViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const dateRange = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">{issues.length} Issues</span>
          <div className="flex items-center rounded-md border bg-background p-1">
            <Button
              variant={viewMode === "week" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("week")}
            >
              Week
            </Button>
            <Button
              variant={viewMode === "month" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("month")}
            >
              Month
            </Button>
            <Button
              variant={viewMode === "quarter" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("quarter")}
            >
              Quarter
            </Button>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleFullscreen}>
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-1 overflow-hidden",
          isFullscreen && "bg-background",
        )}
      >
        <div className="w-1/4 min-w-[300px] border-r">
          <GanttSidebar issues={issues} />
        </div>
        <div className="flex-1 overflow-x-auto">
          <GanttTimeline
            issues={issues}
            dateRange={dateRange}
            viewMode={viewMode}
          />
        </div>
      </div>
    </div>
  );
}
