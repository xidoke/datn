"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Issue, Label, State, TIssuePriorities } from "@/types";
import { Button } from "@/components/ui/button";
import { CreateIssueDialog } from "@/components/issues/create-issue-dialog";
import IssueListItem from "./issue-list-item";
import { Card } from "@/components/ui/card";
import { useFilterStore } from "@/stores/filterStore";
import IssueModal from "../IssueModal";
import { stateGroups, TStateGroups } from "@/components/icons/state/helper";
import { StateGroupIcon } from "@/components/icons";

interface ListViewProps {
  issues: Issue[];
  states: State[];
  labels: Label[];
}

export default function ListView({ issues, states, labels }: ListViewProps) {
  const [collapsedStates, setCollapsedStates] = useState<string[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const {
    statusIds,
    labelIds,
    priorityIds,
    startDate,
    dueDate,
    cycleIds,
    setFilter,
    usersId,
    search,
  } = useFilterStore();

  const toggleState = (stateId: string) => {
    setCollapsedStates((prev) =>
      prev.includes(stateId)
        ? prev.filter((id) => id !== stateId)
        : [...prev, stateId],
    );
  };

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const handleCloseModal = () => {
    setSelectedIssue(null);
  };

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (
        statusIds.length > 0 &&
        !statusIds.includes(issue.state?.id as string)
      ) {
        return false;
      }

      if (
        usersId.length > 0 &&
        !issue.assignees?.some((assignee) =>
          usersId.includes(assignee.workspaceMember.user.id),
        )
      ) {
        return false;
      }

      if (cycleIds.length > 0 && !cycleIds.includes(issue.cycleId as string)) {
        return false;
      }

      if (
        labelIds.length > 0 &&
        !issue.labels?.some((label) => labelIds.includes(label.id))
      ) {
        return false;
      }
      if (
        priorityIds.length > 0 &&
        !priorityIds.includes(issue.priority.toString() as TIssuePriorities)
      ) {
        return false;
      }
      if (
        startDate &&
        issue.startDate &&
        new Date(issue.startDate) < new Date(startDate)
      ) {
        return false;
      }
      if (
        dueDate &&
        issue.dueDate &&
        new Date(issue.dueDate) > new Date(dueDate)
      ) {
        return false;
      }
      if (search && !issue.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [
    issues,
    statusIds,
    labelIds,
    priorityIds,
    startDate,
    dueDate,
    search,
    cycleIds,
    usersId,
  ]);

  const groupedStates = useMemo(() => {
    return stateGroups.map((group) => ({
      group,
      states: states.filter((state) => state.group === group.name),
    }));
  }, [states]);

  return (
    <div className="flex flex-col space-y-4 p-4">
      {groupedStates.map(({ group, states }) => (
        <div key={group.name}>
          <h2 className="mb-2 text-lg font-semibold">{group.label}</h2>
          {states.map((state) => {
            const stateIssues = filteredIssues.filter(
              (issue) => issue.state?.id === state.id,
            );
            return (
              <Card key={state.id} className="mb-4 overflow-hidden">
                <div className="flex items-center justify-between border-b p-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => toggleState(state.id)}
                    >
                      {collapsedStates.includes(state.id) ? (
                        <ChevronRight className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="flex items-center gap-2">
                      <StateGroupIcon
                        stateGroup={state.group as TStateGroups}
                        className="h-5 w-5"
                        color={state.color}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: state.color }}
                      >
                        {state.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {stateIssues.length}
                      </span>
                    </div>
                  </div>
                  <CreateIssueDialog stateId={state.id}>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </CreateIssueDialog>
                </div>
                {!collapsedStates.includes(state.id) && (
                  <div className="divide-y">
                    {stateIssues
                      .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
                      .map((issue) => (
                        <IssueListItem
                          key={issue.id}
                          issue={issue}
                          onClick={() => handleIssueClick(issue)}
                        />
                      ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ))}
      {selectedIssue && (
        <IssueModal issue={selectedIssue} onClose={handleCloseModal} />
      )}
    </div>
  );
}
