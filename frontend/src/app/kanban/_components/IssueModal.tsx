import React from "react";
import { X } from "lucide-react";
import { Issue } from "../_types/kanban";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface IssueModalProps {
  issue: Issue;
  onClose: () => void;
}

export default function IssueModal({ issue, onClose }: IssueModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              {issue.id}: {issue.title}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="mb-2 text-lg font-semibold">Details</h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Assignee:</span>
              {issue.assignee && (
                <div className="mt-1 flex space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt={issue.assignee}
                    />
                    <AvatarFallback>{issue.assignee[0]}</AvatarFallback>
                  </Avatar>
                  <span>{issue.assignee}</span>
                </div>
              )}
            </div>
            <div>
              <span className="font-medium">Labels:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {issue.labels?.map((label) => (
                  <Badge
                    key={label.id}
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="font-medium">State:</span>
              <span className="ml-2">{issue.state.name}</span>
            </div>
            <div>
              <span className="font-medium">Priority:</span>
              <span className="ml-2">{issue.priority}</span>
            </div>
            <div>
              <span className="font-medium">Created:</span>
              <span className="ml-2">
                {new Date(issue.createdAt).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="font-medium">Updated:</span>
              <span className="ml-2">
                {new Date(issue.updatedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}