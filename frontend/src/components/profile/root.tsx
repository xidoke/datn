"use client";

import Stats from "./stats";
import { useParams } from "next/navigation";
import { IssuesByStatePieChart } from "./pie-chart-state";
import { IssuesByPriorityChart } from "./priority-chart";
import { useProfile } from "@/hooks/useProfile";
import { useMemberStore } from "@/stores/member/memberStore";
import AssignedIssues from "../dashboard/assigned-issues";
import CreatedIssues from "../dashboard/created-issues";

export const WorkspaceMemberDashboard = () => {
  const { workspaceSlug, memberId } = useParams();
  const { workspacesMemberMap: workspaceMemberMap } = useMemberStore();
  const member =
    workspaceMemberMap[workspaceSlug as string]?.[memberId as string];
  const userId = member.userId;
  const { data, error } = useProfile(workspaceSlug as string, userId as string);

  if (error) {
    return <div>Error loading member dashboard data</div>;
  }

  const isLoading = !data && !error;

  return (
    <div className="min-h-screen bg-backdrop p-6 text-foreground">
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
