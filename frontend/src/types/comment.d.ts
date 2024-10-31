export interface IComment {
  id: string;
  content: string;
  authorId: string;
  issueId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentState {
  comments: IComment[];
  setComments: (comments: IComment[]) => void;
  addComment: (comment: IComment) => void;
  updateComment: (updatedComment: IComment) => void;
  deleteComment: (commentId: string) => void;
}
