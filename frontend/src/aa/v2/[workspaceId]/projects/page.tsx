"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/hooks/useProjects";

export default function ProjectsPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { projects, isLoading } = useProjects(params.workspaceId);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="created">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Created date</SelectItem>
              <SelectItem value="updated">Last updated</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/${params.workspaceId}/projects/${project.id}`}
            className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
          >
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={project.coverImage || "/placeholder.svg"}
                alt={project.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 p-4">
              <h3 className="mb-1 text-lg font-semibold text-white">
                {project.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span>{project.key}</span>
                <span>•</span>
                <span>
                  Created on {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
