"use client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttMarker,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
} from "@/components/roadmap-ui/gantt";
import { toast } from "@/hooks/use-toast";
import { Issue, State, TIssuePriorities } from "@/types";
import { EyeIcon, LinkIcon, PencilIcon } from "lucide-react";
import groupBy from "lodash.groupby";
import { useCycleStore } from "@/stores/cycleStore";
import { AssigneeDropdown } from "@/components/dropdown/assignees";
import { useParams } from "next/navigation";
import useIssueStore from "@/stores/issueStore";
import { PriorityDropdown } from "@/components/dropdown/priority";

interface IssueGanttChartProps {
  issues: Issue[];
  states: State[];
  range: "daily" | "monthly" | "quarterly";
  onIssueSelect: (issue: Issue) => void;
}

export function IssueGanttChart({
  issues,
  states,
  onIssueSelect,
  range,
}: IssueGanttChartProps) {
  const { projectId, workspaceSlug } = useParams();
  const { updateIssue } = useIssueStore();
  // Group issues by state
  const { cyclesMap } = useCycleStore();
  const cycles = Object.values(cyclesMap);
  //   tạo marker cho start date và due date của cycle, với mỗi cycle sẽ tạo ra 2 marker
  const markers = cycles.flatMap((cycle) => [
    {
      id: `start-${cycle.id}`,
      date: new Date(cycle.startDate),
      label: cycle.title,
      type: "start",
    },
    {
      id: `due-${cycle.id}`,
      date: new Date(cycle.dueDate),
      label: cycle.title,
      type: "due",
    },
  ]);

  const groupedIssues = groupBy(issues, "state.name");

  const handleMoveIssue = async (
    id: string,
    startDate: Date,
    dueDate: Date | null,
  ) => {
    if (!dueDate) return;

    try {
      // Here you would typically call your API to update the issue dates
      updateIssue(workspaceSlug as string, projectId as string, id, {
        startDate: startDate.toISOString(),
        dueDate: dueDate.toISOString(),
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to move issue. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = (issue: Issue) => {
    const url = `${window.location.origin}/${workspaceSlug}/projects/${projectId}/issues/${issue.id}`;
    navigator.clipboard.writeText(url);
    console.log("Link copied to clipboard");
  };

  return (
    <GanttProvider range={range} zoom={100}>
      <GanttSidebar>
        {states.map((state) => (
          <GanttSidebarGroup
            color={state.color}
            key={state.id}
            name={state.name}
            group={state.group}
          >
            {(groupedIssues[state.name] || []).map((issue) => (
              <GanttSidebarItem
                key={issue.id}
                feature={{
                  id: issue.id,
                  name: issue.fullIdentifier + " " + issue.title,
                  startAt: issue.startDate
                    ? new Date(issue.startDate)
                    : new Date(),
                  endAt: issue.dueDate ? new Date(issue.dueDate) : new Date(),
                  status: issue.state,
                }}
                onSelectItem={() => onIssueSelect(issue)}
              />
            ))}
          </GanttSidebarGroup>
        ))}
      </GanttSidebar>

      <GanttTimeline>
        <GanttHeader />
        <GanttFeatureList>
          {states.map((state) => (
            <GanttFeatureListGroup key={state.id}>
              {(groupedIssues[state.name] || []).map((issue) => (
                <div className="flex" key={issue.id}>
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <button
                        type="button"
                        onClick={() => onIssueSelect(issue)}
                      >
                        <GanttFeatureItem
                          id={issue.id}
                          name={issue.title}
                          startAt={
                            issue.startDate
                              ? new Date(issue.startDate)
                              : new Date()
                          }
                          endAt={
                            issue.dueDate ? new Date(issue.dueDate) : new Date()
                          }
                          status={issue.state}
                          onMove={handleMoveIssue}
                        >
                          <div className="flex w-full items-center gap-2">
                            <PriorityDropdown
                              disabled
                              size="icon"
                              value={
                                issue.priority.toString() as TIssuePriorities
                              }
                              onChange={async (newPriority) => {
                                await updateIssue(
                                  workspaceSlug as string,
                                  projectId as string,
                                  issue.id,
                                  {
                                    priority: +newPriority,
                                  },
                                );
                              }}
                            />
                            <p className="flex-1 truncate text-xs">
                              {issue.title}
                            </p>
                            {issue.assignees.length > 0 && (
                              <AssigneeDropdown
                                disabled
                                size="sm"
                                projectId={projectId as string}
                                values={issue.assignees.map(
                                  (assignee) =>
                                    assignee?.workspaceMember?.user?.id,
                                )}
                                onChange={async (values) => {
                                  await updateIssue(
                                    workspaceSlug as string,
                                    projectId as string,
                                    issue.id,
                                    { assigneeIds: values },
                                  );
                                }}
                              />
                            )}
                          </div>
                        </GanttFeatureItem>
                      </button>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => onIssueSelect(issue)}
                      >
                        <EyeIcon size={16} className="text-muted-foreground" />
                        View issue
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleCopyLink(issue)}
                      >
                        <LinkIcon size={16} className="text-muted-foreground" />
                        Copy link
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => onIssueSelect(issue)}
                      >
                        <PencilIcon
                          size={16}
                          className="text-muted-foreground"
                        />
                        Edit issue
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </div>
              ))}
            </GanttFeatureListGroup>
          ))}
        </GanttFeatureList>
        {markers.map((marker) => (
          <GanttMarker
            key={marker.id}
            {...marker}
            className={marker.type === "start" ? "bg-green-300" : "bg-red-300"}
          />
        ))}
        <GanttToday className="bg-primary/20" />
      </GanttTimeline>
    </GanttProvider>
  );
}
