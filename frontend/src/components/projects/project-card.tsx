"use client";

import Link from "next/link";
import { format } from "date-fns";
import { MoreHorizontal, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProjectCardProps {
  id: string;
  name: string;
  token: string;
  description: string;
  createdAt: Date;
  workspaceSlug: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  token,
  description,
  createdAt,
  workspaceSlug,
}) => {
  return (
    <Card className="group w-[300px] transition-colors hover:border-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="flex items-center justify-center bg-primary/85">
            <span className="p-1 text-xs font-medium text-primary-foreground">
              {token}
            </span>
          </div>
          <Link
            href={`/${workspaceSlug}/projects/${id}/issues`}
            className="hover:underline"
          >
            {name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Created on {format(createdAt, "MMM dd, yyyy")}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
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
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
