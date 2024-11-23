"use client";

import React, { useEffect } from "react";
import { useIssueStore } from "@/stores/issue/issueStore";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";

const IssueListPage: React.FC = () => {
  const params = useParams();
  const { workspaceSlug, projectId } = params;
  const { issues, isLoading, error, fetchIssues } = useIssueStore();

  useEffect(() => {
    fetchIssues(workspaceSlug as string, projectId as string);
  }, [fetchIssues, workspaceSlug, projectId]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Issues List */}
      <div className="flex-1 overflow-auto px-4">
        {Object.values(issues).length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No issues found
          </div>
        ) : (
          <div className="space-y-1">
            {Object.values(issues).map((issue) => (
              <div
                key={issue.id}
                className="group flex cursor-pointer items-center gap-3 rounded-md p-3 hover:bg-secondary/10"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium">
                    {issue.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{issue.state.name}</span>
                    <span>•</span>
                    <span>
                      Created {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueListPage;
