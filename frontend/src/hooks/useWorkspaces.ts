import useSWR from "swr";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useCallback, useEffect } from "react";
import { IWorkspace } from "@/types/workspace";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetcher function for SWR
const fetcher = async (url: string): Promise<IWorkspace[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the workspaces.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export function useWorkspaces() {
  const {
    data: workspaces,
    error,
    isLoading,
    mutate,
  } = useSWR<IWorkspace[]>(`${API_BASE_URL}/api/workspaces`, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const setWorkspaces = useWorkspaceStore((state) => state.setWorkspaces);

  useEffect(() => {
    if (workspaces) setWorkspaces(workspaces);
  }, [workspaces, setWorkspaces]);

  const addWorkspace = useCallback(
    async (newWorkspace: Omit<IWorkspace, "id">) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/workspaces`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newWorkspace),
        });
        if (!response.ok) throw new Error("Failed to add workspace");
        const addedWorkspace: IWorkspace = await response.json();
        mutate(
          (currentWorkspaces) => [...(currentWorkspaces || []), addedWorkspace],
          false,
        );
        return addedWorkspace;
      } catch (error) {
        console.error("Error adding workspace:", error);
        throw error;
      }
    },
    [mutate],
  );

  const updateWorkspace = useCallback(
    async (updatedWorkspace: IWorkspace) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/workspaces/${updatedWorkspace.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedWorkspace),
          },
        );
        if (!response.ok) throw new Error("Failed to update workspace");
        const updated: IWorkspace = await response.json();
        mutate(
          (currentWorkspaces) =>
            currentWorkspaces?.map((w) =>
              w.id === updated.id ? updated : w,
            ) || [],
          false,
        );
        return updated;
      } catch (error) {
        console.error("Error updating workspace:", error);
        throw error;
      }
    },
    [mutate],
  );

  const deleteWorkspace = useCallback(
    async (workspaceId: string) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/workspaces/${workspaceId}`,
          {
            method: "DELETE",
          },
        );
        if (!response.ok) throw new Error("Failed to delete workspace");
        mutate(
          (currentWorkspaces) =>
            currentWorkspaces?.filter((w) => w.id !== workspaceId) || [],
          false,
        );
      } catch (error) {
        console.error("Error deleting workspace:", error);
        throw error;
      }
    },
    [mutate],
  );

  return {
    workspaces: workspaces || [],
    isLoading,
    isError: !!error,
    error,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
    mutate,
  };
}
