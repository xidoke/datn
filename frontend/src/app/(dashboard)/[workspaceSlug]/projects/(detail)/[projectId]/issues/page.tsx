"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { API_BASE_URL } from "@/helpers/common.helper";

const fetcher = (url: string, options = {}) =>
  fetch(url, { credentials: "include", ...options }).then((res) => res.json());

export default function IssuesPage() {
  const { workspaceSlug, projectId } = useParams();
  const { data: issues, mutate } = useSWR(
    `${API_BASE_URL}/workspaces/${workspaceSlug}/projects/${projectId}/issues`,
    fetcher,
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newIssue, setNewIssue] = useState({ title: "", description: "" });
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `${API_BASE_URL}/workspaces/${workspaceSlug}/projects/${projectId}/issues`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newIssue),
    };

    const response = await fetcher(url, options);
    if (response) {
      mutate();
      setIsCreateDialogOpen(false);
      setNewIssue({ title: "", description: "" });
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const updatedIssue = {
        ...issues.find((issue: any) => issue.id === draggableId),
        state: destination.droppableId,
      };

      const url = `${API_BASE_URL}/workspaces/${workspaceSlug}/projects/${projectId}/issues/${draggableId}`;
      const options = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: destination.droppableId }),
      };

      await fetcher(url, options);
      mutate();
    }
  };

  const groupedIssues = issues?.reduce((acc: any, issue: any) => {
    const state = issue.state?.name || "No State";
    if (!acc[state]) {
      acc[state] = [];
    }
    acc[state].push(issue);
    return acc;
  }, {});

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Issues</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "kanban" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("kanban")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Issue
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Issue</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateIssue} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newIssue.title}
                    onChange={(e) =>
                      setNewIssue({ ...newIssue, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newIssue.description}
                    onChange={(e) =>
                      setNewIssue({ ...newIssue, description: e.target.value })
                    }
                  />
                </div>
                <Button type="submit">Create Issue</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === "table" ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Assignees</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues?.map((issue: any) => (
              <TableRow key={issue.id}>
                <TableCell>{issue?.title}</TableCell>
                <TableCell>{issue?.state?.name}</TableCell>
                <TableCell>
                  {issue.assignees
                    ?.map((assignee: any) => assignee?.user?.email)
                    .join(", ")}
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Object.entries(groupedIssues || {}).map(
              ([state, stateIssues]: [string, any]) => (
                <div key={state} className="rounded-lg bg-gray-100 p-4">
                  <h2 className="mb-4 text-lg font-semibold">{state}</h2>
                  <Droppable droppableId={state}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {stateIssues.map((issue: any, index: number) => (
                          <Draggable
                            key={issue.id}
                            draggableId={issue.id}
                            index={index}
                          >
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <CardContent className="p-4">
                                  <h3 className="font-medium">{issue.title}</h3>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {issue.description}
                                  </p>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ),
            )}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
