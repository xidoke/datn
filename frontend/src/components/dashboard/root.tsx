"use client";

import Header from "./header";
import Stats from "./stats";
import AssignedIssues from "./assigned-issues";
import CreatedIssues from "./created-issues";
import { useDashboardData } from "@/hooks/useDashboard";
import { useParams } from "next/navigation";
import { IssuesByStatePieChart } from "./pie-chart-state";
import { IssuesByPriorityChart } from "./priority-chart";

export const DashBoardWorkspace = () => {
  const { workspaceSlug } = useParams();
  const date = new Date();

  const formattedDate = date.toLocaleString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  });

  const { data, error } = useDashboardData(workspaceSlug as string);

  if (error) {
    return <div>Error loading dashboard data</div>;
  }

  const isLoading = !data && !error;

  return (
    <div className="min-h-screen bg-backdrop p-6 text-foreground">
      <Header formattedDate={formattedDate} />
      <Stats data={data} isLoading={isLoading} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AssignedIssues isLoading={isLoading} data={data} />
        <CreatedIssues isLoading={isLoading} data={data} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <IssuesByStatePieChart data={data?.issuesByStateGroup ?? []} />
        <IssuesByPriorityChart data={data?.issuesByPriority ?? []} />
      </div>
    </div>
  );
};
