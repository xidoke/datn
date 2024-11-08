export interface IssueComment {
  id: string;
  content: string;
  issueId: string;
  userId: string;
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
