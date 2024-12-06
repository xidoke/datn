import { Suspense } from "react";
import IssueDetail from "./issueDetails";
import Comments from "@/components/comment/comments";

export default function IssuePage({ params } : { params: { workspaceSlug: string, projectId: string, issueId: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading comments...</div>}>
        <Comments
          issueId={params.issueId}
          projectId={params.projectId}
          workspaceSlug={params.workspaceSlug}
        />
      </Suspense>
    </div>
  );
}
