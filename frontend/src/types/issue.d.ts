export interface Issue {
  id: string;
  title: string;
  description?: string;
  stateId?: string;
  projectId: string;
  creatorId: string;
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
