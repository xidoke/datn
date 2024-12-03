import { User } from "./user";

// Define the priority types
type TIssuePriorities = '0' | '1' | '2' | '3' | '4';
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


interface Issue {
  id: string;
  title: string;
  description?: string;
  fullIdentifier: string;
  sequenceNumber: number;
  project: {
  title: string;
  description?: string;
  stateId: string;
  state: State;
    id: string;
    name: string;
    token: string;
  };
  stateId: string;
  state: {
    id: string;
    name: string;
    color: string;
    group: string;
  };
  creator: User;
  assignees: IssueAssignee[];
  labelIds: string[];
  labels: Label[];
  priority: number;
  startDate?: Date;
  dueDate?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface IssueAssignee {
  id: string;
  user: User;
  userId: string;
  issueId: string;
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

  export interface Column {
  id: string;
  title: string;
  issues: Issue[];
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

export interface Board {
  columns: Column[];
}
