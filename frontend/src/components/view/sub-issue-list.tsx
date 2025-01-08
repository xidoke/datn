import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { StateDropdown } from "@/components/dropdown/state";
import useIssueStore from "@/stores/issueStore";
import { useParams } from "next/navigation";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { AssigneeDropdown } from "../dropdown/assignees";
import { PriorityDropdown } from "../dropdown/priority";
import { TIssuePriorities } from "@/types/issue";

interface SubIssuesListProps {
  parentIssueId: string;
}

export function SubIssuesList({ parentIssueId }: SubIssuesListProps) {
  const { issues, getIssueById } = useIssueStore();
  const { projectId, workspaceSlug } = useParams();
  const parentIssue = getIssueById(parentIssueId);
  const subIssues =
    issues?.filter((issue) => issue.parentId === parentIssueId) || [];
  const { updateIssue } = useIssueStore();

  return (
    <Disclosure
      as="div"
      className="z-auto flex flex-shrink-0 flex-col bg-backdrop"
      defaultOpen={false}
    >
      {({ open }) => (
        <>
          <DisclosureButton className="sticky top-0 w-full flex-shrink-0 cursor-pointer border-b border-border bg-background p-2 hover:bg-accent">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {open ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">Sub-issues</span>
                <Badge variant="secondary" className="text-xs">
                  {subIssues.length}
                </Badge>
              </div>
            </div>
          </DisclosureButton>
          <DisclosurePanel>
            <ScrollArea className="h-full">
              <ul className="space-y-1 p-2">
                {subIssues.map((subIssue) => (
                  <li
                    key={subIssue.id}
                    className="flex items-center justify-between rounded-md p-2 hover:bg-accent"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {subIssue.fullIdentifier}
                      </span>
                      <span className="text-sm">{subIssue.title}</span>
                    </div>
                    <StateDropdown
                      size="sm"
                      projectId={projectId as string}
                      value={subIssue.stateId}
                      onChange={async (value) => {
                        // Update the sub-issue state
                        // You'll need to implement this in your issueStore
                        await updateIssue(
                          workspaceSlug as string,
                          projectId as string,
                          subIssue.id,
                          { stateId: value },
                        );
                      }}
                    />

                    <AssigneeDropdown
                      size="icon"
                      projectId={projectId as string}
                      values={subIssue.assignees.map(
                        (assignee) => assignee?.workspaceMember?.user?.id,
                      )}
                      onChange={async (values) => {
                        await updateIssue(
                          workspaceSlug as string,
                          projectId as string,
                          subIssue.id,
                          { assigneeIds: values },
                        );
                      }}
                    />

                    <PriorityDropdown
                      size="sm"
                      onChange={async (newPriority) => {
                        await updateIssue(
                          workspaceSlug as string,
                          projectId as string,
                          subIssue.id,
                          { priority: +newPriority },
                        );
                      }}
                      value={subIssue.priority+"" as TIssuePriorities}
                    />
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
