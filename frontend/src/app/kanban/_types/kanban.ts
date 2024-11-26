export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface State {
  id: string;
  name: string;
  color: string;
  group: 'backlog' | 'unstarted' | 'started' | 'completed' | 'cancelled';
  description?: string;
  icon?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  state: State;
  labels: Label[];
  assignee?: string;
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  issues: Issue[];
}

export interface Board {
  columns: Column[];
}

