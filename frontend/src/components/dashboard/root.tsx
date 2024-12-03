"use client";
import { CalendarIcon } from "lucide-react";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupList, AvatarImage, AvatarOverflowIndicator } from "../ui/avatar";
import { useUserStore } from "@/stores/userStore";
import { useDashboardData } from "@/hooks/useDashboard";
import { useParams } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { PriorityIcon } from "../icons/priority-icon";
import { TIssuePriorities } from "@/types";
import { IssuesByStatePieChart } from "./pie-chart";
import { API_BASE_URL } from "@/helpers/common.helper";
import Image from "next/image";

export const DashBoardWorkspace = () => {
  const { data: user } = useUserStore();

  const { workspaceSlug } = useParams();
  const date = new Date();

  const formattedDate = date.toLocaleString("en-US", {
    weekday: "long", // "Sunday"
    month: "short", // "Dec"
    day: "numeric", // "1"
    hour: "2-digit", // "20"
    minute: "2-digit", // "53"
    timeZone: "Asia/Ho_Chi_Minh", // Đặt múi giờ cho Việt Nam
  });

  const { data, error } = useDashboardData(workspaceSlug as string);

  if (error) {
    return <div>Error loading dashboard data</div>;
  }

  const isLoading = !data && !error;
  return (
    <>
      <div className="min-h-screen bg-background p-6 text-foreground">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold">
            Wellcome, {user?.firstName ?? ""} {user?.lastName ?? ""}
          </h1>
          <p className="text-muted-foreground">{formattedDate}</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            { label: "Issues assigned", value: data?.stats.assignedCount },
            { label: "Issues overdue", value: data?.stats.overdueCount },
            { label: "Issues created", value: data?.stats.createdCount },
            { label: "Issues completed", value: data?.stats.completedCount },
          ].map((stat) => (
            <Card key={stat.label} className="p-6">
              {isLoading ? (
                <Skeleton className="mb-2 h-8 w-20" />
              ) : (
                <h3 className="mb-2 text-3xl font-bold">{stat.value}</h3>
              )}
              <p className="text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Assigned Issues */}
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Last assigned to you</h2>
              {/* <select className="rounded-md border bg-background px-2 py-1">
                <option>All time</option>
                <option>This week</option>
                <option>This month</option>
              </select> */}
            </div>

            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Marked completed</TabsTrigger>
              </TabsList>
              <TabsContent value="pending">
                <div className="space-y-4">
                  {isLoading
                    ? Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))
                    : data?.recentAssignedIssues
                        .filter((issue) => issue.state.group !== "completed")
                        .map((issue) => (
                          <div
                            key={issue.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground">
                                {issue.project.token}-{issue.sequenceNumber}
                              </span>
                              <span>{issue.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <PriorityIcon
                                priority={
                                  issue?.priority?.toString() as TIssuePriorities
                                }
                              />
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <CalendarIcon className="h-4 w-4" />
                                {new Date(issue.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                </div>
              </TabsContent>
              <TabsContent value="completed">
                <div className="space-y-4">
                  {isLoading
                    ? Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))
                    : data?.recentAssignedIssues
                        .filter((issue) => issue.state.group === "completed")
                        .map((issue) => (
                          <div
                            key={issue.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground">
                                {issue.project.token}-{issue.sequenceNumber}
                              </span>
                              <span>{issue.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <PriorityIcon
                                priority={
                                  issue?.priority?.toString() as TIssuePriorities
                                }
                              />
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <CalendarIcon className="h-4 w-4" />
                                {new Date(issue.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Created Issues */}
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Last created by you</h2>
              {/* <select className="rounded-md border bg-background px-2 py-1">
                <option>All time</option>
                <option>This week</option>
                <option>This month</option>
              </select> */}
            </div>

            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Marked completed</TabsTrigger>
              </TabsList>
              <TabsContent value="pending">
                <div className="space-y-4">
                  {isLoading
                    ? Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))
                    : data?.recentCreatedIssues
                        .filter((issue) => issue.state.group !== "completed")
                        .map((issue) => (
                          <div
                            key={issue.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground">
                                {issue.project.token}-{issue.sequenceNumber}
                              </span>
                              <span>{issue.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <PriorityIcon
                                priority={
                                  issue?.priority?.toString() as TIssuePriorities
                                }
                              />
                              {issue.assignees && (
                                <AvatarGroup limit={3}>
                                  <AvatarGroupList>
                                    {issue.assignees.map((assignee, i) => (
                                      <Avatar key={i}>
                                        <AvatarImage
                                          src={
                                            API_BASE_URL +
                                            assignee.user?.avatarUrl
                                          }
                                          alt={assignee.user?.email}
                                        />
                                        <AvatarFallback>
                                          {assignee.user?.email?.charAt(0) ?? "U"}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                  </AvatarGroupList>
                                  <AvatarOverflowIndicator />
                                </AvatarGroup>
                              )}
                            </div>
                          </div>
                        ))}
                </div>
              </TabsContent>
              <TabsContent value="completed">
                <div className="space-y-4">
                  {isLoading
                    ? Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))
                    : data?.recentCreatedIssues
                        .filter((issue) => issue.state.group === "completed")
                        .map((issue) => (
                          <div
                            key={issue.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground">
                                {issue.project.token}-{issue.sequenceNumber}
                              </span>
                              <span>{issue.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <PriorityIcon
                                priority={
                                  issue?.priority?.toString() as TIssuePriorities
                                }
                              />
                              {issue.assignees && (
                                <AvatarGroup limit={3}>
                                  <AvatarGroupList>
                                    {issue.assignees.map((assignee, i) => (
                                      <Avatar key={i}>
                                        <AvatarImage
                                          src={
                                            API_BASE_URL +
                                            assignee.user?.avatarUrl
                                          }
                                          alt={assignee.user?.email}
                                        />
                                        <AvatarFallback>
                                          {assignee.user?.email.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                  </AvatarGroupList>
                                  <AvatarOverflowIndicator />
                                </AvatarGroup>
                              )}
                            </div>
                          </div>
                        ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="">
          <IssuesByStatePieChart data={data?.issuesByStateGroup ?? []} />
        </div>
      </div>
    </>
  );
};
