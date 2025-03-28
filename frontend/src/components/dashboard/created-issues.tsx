import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PriorityIcon } from "../icons/priority-icon";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";
import { Issue, TIssuePriorities } from "@/types";

const CreatedIssues = ({
  isLoading,
  data,
}: {
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any; // TODO: fix this
}) => {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Last 10 created by you</h2>
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
                  .map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
              : data?.recentCreatedIssues
                  .filter((issue: Issue) => issue.state.group !== "completed")
                  .map((issue: Issue) => (
                    <div
                      key={issue.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <Link
                        href={`projects/${issue.project.id}/issues/${issue.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground">
                            {issue.project.token}-{issue.sequenceNumber}
                          </span>
                          <span>{issue.title}</span>
                        </div>
                      </Link>

                      <div className="flex items-center gap-4">
                        <PriorityIcon
                          priority={
                            issue?.priority?.toString() as TIssuePriorities
                          }
                        />
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
                  .map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
              : data?.recentCreatedIssues
                  .filter((issue: Issue) => issue.state.group === "completed")
                  .map((issue: Issue) => (
                    <div
                      key={issue.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <Link
                        href={`projects/${issue.project.id}/issues/${issue.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground">
                            {issue.project.token}-{issue.sequenceNumber}
                          </span>
                          <span>{issue.title}</span>
                        </div>
                      </Link>

                      <div className="flex items-center gap-4">
                        <PriorityIcon
                          priority={
                            issue?.priority?.toString() as TIssuePriorities
                          }
                        />
                      </div>
                    </div>
                  ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default CreatedIssues;
