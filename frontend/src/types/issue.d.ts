export interface IIssue {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  assigneeId: string | null;
  reporterId: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IssueState {
  issues: IIssue[];
  setIssues: (issues: IIssue[]) => void;
  addIssue: (issue: IIssue) => void;
  updateIssue: (updatedIssue: IIssue) => void;
  deleteIssue: (issueId: string) => void;
}
