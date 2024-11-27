"use client";

import { FC, ReactNode } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";

// components
import { Spinner } from "@/components/ui/spinner";

// hooks
import { useProject } from "@/stores/projectStore";
import { useWorkspace } from "@/stores/workspaceStore";
import { useUser } from "@/stores/userStore";

// types
import { Project, Workspace, User } from "@/types";
import { useProjectLabelStore } from "@/stores/projectLabelStore";
import { useProjectStateStore } from "@/stores/projectStateStore";

interface ProjectWrapperProps {
  children: ReactNode;
}

export const ProjectWrapper: FC<ProjectWrapperProps> = ({ children }) => {
  const { workspaceSlug, projectId } = useParams();
  const { fetchProjectDetails, projects } = useProject();
  const { fetchWorkspaces } = useWorkspace();
  const { fetchCurrentUser } = useUser();
  const { fetchLabels } = useProjectLabelStore();
  const { fetchStates } = useProjectStateStore();

  const { data: projectData, error: projectError } = useSWR<Project>(
    workspaceSlug && projectId
      ? `PROJECT_DETAILS_${workspaceSlug}_${projectId}`
      : null,
    () => fetchProjectDetails(workspaceSlug as string, projectId as string),
  );

  const { data: workspaceData, error: workspaceError } = useSWR<Workspace[]>(
    "WORKSPACES",
    fetchWorkspaces,
  );

  const { data: userData, error: userError } = useSWR<User>(
    "CURRENT_USER",
    fetchCurrentUser,
  );

  //   fetch labels for the project
  useSWR(
    workspaceSlug && projectId
      ? `PROJECT_LABELS_${workspaceSlug}_${projectId}`
      : null,
    workspaceSlug && projectId
      ? () => fetchLabels(workspaceSlug as string, projectId as string)
      : null,
    { revalidateIfStale: false, revalidateOnFocus: false },
  );

  //   fetch state of the project
 useSWR(
    workspaceSlug && projectId
      ? `PROJECT_STATE_${workspaceSlug}_${projectId}`
      : null,
    () => fetchStates(workspaceSlug as string, projectId as string),
  );
  

  if (projectError || workspaceError || userError) {
    return <div>Error loading project data. Please try again.</div>;
  }

  if (!projectData || !workspaceData || !userData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    return <div>Project not found.</div>;
  }

  // You can add more checks here for user permissions, etc.

  return <>{children}</>;
};
