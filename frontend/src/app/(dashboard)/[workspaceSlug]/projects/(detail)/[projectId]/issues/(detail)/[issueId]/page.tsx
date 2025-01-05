import { Suspense } from "react";
import IssueDetail from "./issueDetails";
import Comments from "@/components/comment/comments";
import IssueDetailsHeader from "./header";

export default function IssuePage({
  params,
}: {
  params: { workspaceSlug: string; projectId: string; issueId: string };
}) {
  return (
    <div>
      <IssueDetailsHeader />
      <div className="container mx-auto px-4 py-8">
        {/* issue properties */}
        <IssueDetail
          workspaceSlug={params.workspaceSlug}
          projectId={params.projectId}
          issueId={params.issueId}
        />
        <Suspense fallback={<div>Loading comments...</div>}>
          <Comments
            issueId={params.issueId}
            projectId={params.projectId}
            workspaceSlug={params.workspaceSlug}
          />
        </Suspense>
      </div>
    </div>
  );
}
