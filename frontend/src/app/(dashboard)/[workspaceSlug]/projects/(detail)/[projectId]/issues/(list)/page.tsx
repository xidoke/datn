"use client";
import { useIssueStore } from "@/stores/issue/issueStore";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { workspaceSlug, projectId } = useParams();
  const { getIssues, issues, error } = useIssueStore();
  useEffect(() => {
    getIssues(workspaceSlug as string, projectId as string);
  }, [workspaceSlug, projectId, getIssues]);
  return (
    <div>
      {error && <div>{error}</div>}
      {issues.map((issue) => (
        <div key={issue.id}>{issue.title}</div>
      ))}
    </div>
  );
};
export default Page;
