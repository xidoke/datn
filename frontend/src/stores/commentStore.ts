import { CommentService, Comment } from '@/services/comment.service';
import {create} from 'zustand';

interface CommentStore {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  fetchComments: (workspaceSlug: string, projectId: string, issueId: string) => Promise<void>;
  addComment: (workspaceSlug: string, projectId: string, issueId: string, content: string) => Promise<void>;
  deleteComment: (workspaceSlug: string, projectId: string, issueId: string,commentId: string) => Promise<void>;
  updateComment: (workspaceSlug: string, projectId: string, issueId: string,commentId: string, content: string) => Promise<void>;
  reset: () => void;
}

const commentService = new CommentService();
export const useCommentStore = create<CommentStore>((set, get) => ({
  comments: [],
  isLoading: false,
  error: null,
  reset: () => set({ comments: [], isLoading: false, error: null }),
  fetchComments: async (workspaceSlug: string, projectId: string, issueId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await commentService.getCommentsByIssue(workspaceSlug, projectId, issueId);
      set({ comments: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch comments', isLoading: false });
    }
  },
  addComment: async (workspaceSlug: string, projectId: string, issueId: string, content: string) => {
    try {
      const response = await commentService.createComment(workspaceSlug, projectId, issueId, content);
      set((state) => ({ comments: [response.data, ...state.comments] }));
    } catch (error) {
      set({ error: 'Failed to add comment' });
    }
  },
  deleteComment: async (workspaceSlug: string, projectId: string, issueId: string,commentId: string) => {
    try {
      await commentService.deleteComment(workspaceSlug, projectId, issueId, commentId);
      set((state) => ({
        comments: state.comments.filter((comment) => comment.id !== commentId),
      }));
    } catch (error) {
      set({ error: 'Failed to delete comment' });
    }
  },
  updateComment: async (workspaceSlug: string, projectId: string, issueId: string,commentId: string, content: string) => {
    try {
      const response = await commentService.updateComment(workspaceSlug, projectId, issueId, commentId, content);
      set((state) => ({
        comments: state.comments.map((comment) =>
          comment.id === commentId ? { ...comment, content: response.data.content } : comment,
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to update comment' });
    }
  },
}));

