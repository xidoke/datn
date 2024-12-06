"use client";

import React from "react";
import { Issue, Label, State } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Một component hiển thị avatar
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Circle } from "lucide-react";
import { API_BASE_URL } from "@/helpers/common.helper";
import { Tooltip } from "@/components/ui/tooltip-plane";

interface ListViewProps {
  issues: Issue[];
  states: State[];
  labels: Label[];
  onIssueClick: (issue: Issue) => void;
}

export default function ListView({
  issues,
  states,
  labels,
  onIssueClick,
}: ListViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-lg font-medium">Issues List</h2>
      </div>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              Title
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              State
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              Assignees
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              Labels
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              Dates
            </th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr
              key={issue.id}
              className="cursor-pointer border-b hover:bg-gray-50"
              onClick={() => onIssueClick(issue)}
            >
              <td className="px-4 py-2">
                <span className="text-sm font-medium text-gray-800">
                  {issue.title}
                </span>
              </td>
              <td className="px-4 py-2">
                <Badge
                  style={{ backgroundColor: issue.state?.color || "#ddd" }}
                >
                  {issue.state?.name}
                </Badge>
              </td>
              <td className="flex gap-2 px-4 py-2">
                {issue.assignees.map((assignee) => (
                  <Tooltip key={assignee.id} tooltipContent={assignee.email}>
                    <Avatar>
                      <AvatarImage src={API_BASE_URL + assignee.avatarUrl} />
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                  </Tooltip>
                ))}
              </td>
              <td className="px-4 py-2">
                <div className="flex flex-wrap gap-2">
                  {issue.labels.map((label) => (
                    <Badge
                      key={label.id}
                      style={{
                        backgroundColor: label.color || "#ddd",
                        color: "white",
                      }}
                    >
                      {label.name}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="px-4 py-2">
                <div className="text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />{" "}
                    {issue.startDate ? issue.startDate : "N/A"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />{" "}
                    {issue.dueDate ? issue.dueDate : "N/A"}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
