export type Priority = "urgent" | "high" | "medium" | "low" | "none";

export interface IssueLabel {
  id: string;
  name: string;
  color: string;
}

export interface IssueAssignee {
  id: string;
  name: string;
  avatar?: string;
}

export interface Issue {
  id: string;
  projectId: string;
  title: string;
  description: string;
  state: {
    id: string;
    name: string;
    color: string;
    group: string;
  };
  priority: Priority;
  assignees: IssueAssignee[];
  labels: IssueLabel[];
  labelIds: string[];
  fullIdentifier: string;
  startDate?: string;
  dueDate?: string;
  estimate?: number;
  parentId?: string;
  moduleId?: string;
  cycleId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  order: number;
}

export interface IssueFilters {
  state?: string[];
  assignees?: string[];
  labels?: string[];
  priority?: Priority[];
  startDate?: [Date | null, Date | null];
  dueDate?: [Date | null, Date | null];
  createdBy?: string[];
}

export type IssueView = "list" | "kanban" | "calendar" | "gantt";

export type GroupBy = "state" | "priority" | "assignee" | "label" | "none";

export type OrderBy =
  | "manual"
  | "title"
  | "priority"
  | "startDate"
  | "dueDate"
  | "createdAt";
