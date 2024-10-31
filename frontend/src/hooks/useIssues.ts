import useSWR from "swr";
import { useIssueStore } from "@/store/issueStore";
import { useCallback, useEffect } from "react";
import { IIssue } from "@/types/issue";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetcher = async (url: string): Promise<IIssue[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the issues.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export function useIssues(projectId: string) {
  const {
    data: issues,
    error,
    isLoading,
    mutate,
  } = useSWR<IIssue[]>(
    `${API_BASE_URL}/api/projects/${projectId}/issues`,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const setIssues = useIssueStore((state) => state.setIssues);

  useEffect(() => {
    if (issues) setIssues(issues);
  }, [issues, setIssues]);

  const addIssue = useCallback(
    async (newIssue: Omit<IIssue, "id">) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/projects/${projectId}/issues`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newIssue),
          },
        );
        if (!response.ok) throw new Error("Failed to add issue");
        const addedIssue: IIssue = await response.json();
        mutate(
          (currentIssues) => [...(currentIssues || []), addedIssue],
          false,
        );
        return addedIssue;
      } catch (error) {
        console.error("Error adding issue:", error);
        throw error;
      }
    },
    [projectId, mutate],
  );

  const updateIssue = useCallback(
    async (updatedIssue: IIssue) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/issues/${updatedIssue.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedIssue),
          },
        );
        if (!response.ok) throw new Error("Failed to update issue");
        const updated: IIssue = await response.json();
        mutate(
          (currentIssues) =>
            currentIssues?.map((i) => (i.id === updated.id ? updated : i)) ||
            [],
          false,
        );
        return updated;
      } catch (error) {
        console.error("Error updating issue:", error);
        throw error;
      }
    },
    [mutate],
  );

  const deleteIssue = useCallback(
    async (issueId: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/issues/${issueId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete issue");
        mutate(
          (currentIssues) =>
            currentIssues?.filter((i) => i.id !== issueId) || [],
          false,
        );
      } catch (error) {
        console.error("Error deleting issue:", error);
        throw error;
      }
    },
    [mutate],
  );

  return {
    issues: issues || [],
    isLoading,
    isError: !!error,
    error,
    addIssue,
    updateIssue,
    deleteIssue,
    mutate,
  };
}
