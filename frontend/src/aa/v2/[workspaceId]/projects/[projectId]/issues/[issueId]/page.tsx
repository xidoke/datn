"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Link2, Paperclip, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function IssuePage() {
  const params = useParams();
  const [issue, setIssue] = useState({
    id: params.issueId,
    title: "Xây dựng giao diện đăng nhập/đăng ký",
    description:
      "Thiết kế và phát triển giao diện đăng nhập/đăng ký người dùng. Sử dụng React, Material UI (hoặc thư viện UI khác).",
    state: "Done",
    priority: "None",
    assignees: [],
    createdBy: "do.pd200154",
    startDate: "Oct 09, 2024",
    dueDate: "Oct 16, 2024",
    modules: ["Authentication"],
    labels: [],
  });

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto border-r p-6">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-semibold">{issue.title}</h1>
          <p className="text-sm text-muted-foreground">{issue.description}</p>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add sub-issue
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add relation
          </Button>
          <Button variant="outline" size="sm">
            <Link2 className="mr-2 h-4 w-4" />
            Add link
          </Button>
          <Button variant="outline" size="sm">
            <Paperclip className="mr-2 h-4 w-4" />
            Attach
          </Button>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-medium">Activity</h2>
          <div className="space-y-4">
            {/* Activity items */}
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{issue.createdBy}</span>
                  <span className="text-muted-foreground">
                    created the issue
                  </span>
                  <span className="text-muted-foreground">28 days ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Add a comment..."
                  className="min-h-[100px]"
                />
                <div className="mt-2">
                  <Button>Comment</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-80 flex-none space-y-6 p-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Properties</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">State</label>
              <Select defaultValue={issue.state}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Backlog">Backlog</SelectItem>
                  <SelectItem value="Todo">Todo</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Priority</label>
              <Select defaultValue={issue.priority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Assignees</label>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add assignee
              </Button>
            </div>

            <div className="grid gap-2">
              <label className="text-sm text-muted-foreground">Dates</label>
              <Input type="date" defaultValue={issue.startDate} />
              <Input type="date" defaultValue={issue.dueDate} />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Labels</label>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add label
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
