import useSWR from "swr";
import { useCommentStore } from "@/stores/commentStore";
import { useCallback, useEffect } from "react";
import { IComment } from "@/types/comment";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetcher = async (url: string): Promise<IComment[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the comments.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export function useComments(issueId: string) {
  const {
    data: comments,
    error,
    isLoading,
    mutate,
  } = useSWR<IComment[]>(
    `${API_BASE_URL}/api/issues/${issueId}/comments`,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const setComments = useCommentStore((state) => state.setComments);

  useEffect(() => {
    if (comments) setComments(comments);
  }, [comments, setComments]);

  const addComment = useCallback(
    async (newComment: Omit<IComment, "id">) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/issues/${issueId}/comments`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newComment),
          },
        );
        if (!response.ok) throw new Error("Failed to add comment");
        const addedComment: IComment = await response.json();
        mutate(
          (currentComments) => [...(currentComments || []), addedComment],
          false,
        );
        return addedComment;
      } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
      }
    },
    [issueId, mutate],
  );

  const updateComment = useCallback(
    async (updatedComment: IComment) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/comments/${updatedComment.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedComment),
          },
        );
        if (!response.ok) throw new Error("Failed to update comment");
        const updated: IComment = await response.json();
        mutate(
          (currentComments) =>
            currentComments?.map((c) => (c.id === updated.id ? updated : c)) ||
            [],
          false,
        );
        return updated;
      } catch (error) {
        console.error("Error updating comment:", error);
        throw error;
      }
    },
    [mutate],
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/comments/${commentId}`,
          {
            method: "DELETE",
          },
        );
        if (!response.ok) throw new Error("Failed to delete comment");
        mutate(
          (currentComments) =>
            currentComments?.filter((c) => c.id !== commentId) || [],
          false,
        );
      } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
      }
    },
    [mutate],
  );

  return {
    comments: comments || [],
    isLoading,
    isError: !!error,
    error,
    addComment,
    updateComment,
    deleteComment,
    mutate,
  };
}
