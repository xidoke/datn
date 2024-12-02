"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Copy, Link2, MoreHorizontal, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

interface ProjectCardProps {
  id: string;
  name: string;
  identifier: string;
  coverImage?: string;
  createdAt: Date;
  workspaceSlug: string;
}

export function ProjectCard({
  id,
  name,
  identifier,
  coverImage,
  createdAt,
  workspaceSlug,
}: ProjectCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary">
      <Link href={`/${workspaceSlug}/projects/${id}/issues`} className="block">
        <div className="relative h-[140px] w-full overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={name}
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <PlaceholderImage width={270} height={140} />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20 backdrop-blur-sm">
                <span className="text-xs font-medium text-primary-foreground">
                  {identifier.charAt(0)}
                </span>
              </div>
              <h3 className="line-clamp-1 text-sm font-medium text-white">
                {name}
              </h3>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between border-t bg-card/50 p-2 backdrop-blur-sm">
        <span className="text-xs text-muted-foreground">
          Created on {format(createdAt, "MMM dd, yyyy")}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Link2 className="h-4 w-4" />
            <span className="sr-only">Copy project link</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy project ID</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/${workspaceSlug}/projects/${id}/settings`}
                  className="flex items-center"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
