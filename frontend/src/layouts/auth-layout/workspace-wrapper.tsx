"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/stores/userStore";
import { useWorkspace } from "@/stores/workspaceStore";
import { CircleOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { useProject } from "@/stores/projectStore";
import { useAppRouter } from "@/hooks/use-app-router";
import { useMemberStore } from "@/stores/member/memberStore";

interface WorkspaceWrapperProps {
  children: React.ReactNode;
}

const WorkspaceWrapper: React.FC<WorkspaceWrapperProps> = ({ children }) => {
  const router = useAppRouter();
  const params = useParams();
  const workspaceSlug = params?.workspaceSlug as string | undefined;
  const {
    workspaces = [],
    loader: workspacesLoading,
    fetchWorkspaces,
  } = useWorkspace();
  const {
    lastWorkspaceSlug,
    updateLastWorkspaceSlug,
    isLoading: userLoading,
  } = useUser();

  const currentWorkspace = workspaces.find((w) => w.slug === workspaceSlug);
  const { fetchProjects } = useProject();

  const { fetchWorkspaceMembers } = useMemberStore();
  // fetching workspace projects
  useSWR(
    workspaceSlug && currentWorkspace
      ? `WORKSPACE_PROJECTS_${workspaceSlug}`
      : null,
    workspaceSlug && currentWorkspace
      ? () => fetchProjects(workspaceSlug.toString())
      : null,
    { revalidateIfStale: false, revalidateOnFocus: false },
  );

  // fetch workspace members
  useSWR(
    workspaceSlug && currentWorkspace
      ? `WORKSPACE_MEMBERS_${workspaceSlug}`
      : null,
    workspaceSlug && currentWorkspace
      ? () => fetchWorkspaceMembers(workspaceSlug.toString())
      : null,
    { revalidateIfStale: false, revalidateOnFocus: false },
  );

  useEffect(() => {
    // Fetch workspaces if not already loaded
    if (workspaces.length === 0 && !workspacesLoading) {
      fetchWorkspaces();
    }
  }, [fetchWorkspaces, workspaces.length, workspacesLoading]);

  useEffect(() => {
    const handleWorkspaceSelection = async () => {
      const urlWorkspaceSlug = params?.workspaceSlug as string | undefined;

      // If there's a workspace slug in the URL, check if user has access
      if (urlWorkspaceSlug) {
        const workspaceExists = workspaces.some(
          (w) => w.slug === urlWorkspaceSlug,
        );
        if (!workspaceExists) {
          // Don't redirect, show the "Workspace not found" UI instead
          return;
        }
        await updateLastWorkspaceSlug(urlWorkspaceSlug);
        return;
      }

      // If no workspace in URL, handle default workspace selection
      if (!currentWorkspace) {
        if (lastWorkspaceSlug) {
          const workspaceExists = workspaces.some(
            (w) => w.slug === lastWorkspaceSlug,
          );
          if (workspaceExists) {
            router.push(`/${lastWorkspaceSlug}`);
            return;
          }
        }

        if (workspaces.length > 0) {
          const newWorkspaceSlug = workspaces[0].slug;
          await updateLastWorkspaceSlug(newWorkspaceSlug);
          router.push(`/${newWorkspaceSlug}`);
          return;
        }

        if (!workspacesLoading && !userLoading) {
          router.push("/create-workspace");
        }
      }
    };

    handleWorkspaceSelection();
  }, [
    currentWorkspace,
    lastWorkspaceSlug,
    workspaces,
    updateLastWorkspaceSlug,
    workspacesLoading,
    userLoading,
    router,
    params,
  ]);

  // Show loading state while initializing
  if (workspacesLoading || userLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show error state if workspace not found or unauthorized
  const urlWorkspaceSlug = params?.workspaceSlug as string | undefined;
  if (
    urlWorkspaceSlug &&
    !workspaces.some((w) => w.slug === urlWorkspaceSlug)
  ) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-8 bg-background">
        <div className="relative flex items-center justify-center">
          <div className="rounded-full bg-muted p-8">
            <CircleOff className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold">Workspace not found</h1>
          <p className="text-muted-foreground">
            No workspace found with the URL. It may not exist or you lack
            authorization to view it.
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => router.push("/")} variant="default">
            Go Home
          </Button>
          <Button onClick={() => router.push("/profile")} variant="outline">
            Visit Profile
          </Button>
        </div>
      </div>
    );
  }

  // Show error state if no workspaces and not loading
  if (!workspacesLoading && !userLoading && workspaces.length === 0) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">No Workspace Found</h1>
          <p className="text-muted-foreground">
            You don&apos;t have access to any workspaces. Create one to get
            started.
          </p>
        </div>
        <Button
          onClick={() => router.push("/create-workspace")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Create Workspace
        </Button>
      </div>
    );
  }

  // Render children only if we have a valid workspace context
  if (currentWorkspace) {
    return <>{children}</>;
  }

  // Fallback loading state
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default WorkspaceWrapper;
