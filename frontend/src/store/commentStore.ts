import { create } from "zustand";
import { IComment, CommentState } from "@/types/comment";

export const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  setComments: (comments) => set({ comments }),
  addComment: (comment) =>
    set((state) => ({ comments: [...state.comments, comment] })),
  updateComment: (updatedComment) =>
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment,
      ),
    })),
  deleteComment: (commentId) =>
    set((state) => ({
      comments: state.comments.filter((comment) => comment.id !== commentId),
    })),
}));
