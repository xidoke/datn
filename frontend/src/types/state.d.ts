export type StateGroup = "backlog" | "unstarted" | "started" | "completed" | "cancelled";

export interface State {
  id: string;
  name: string;
  color: string;
  // projectId: string;p`
  isDefault?: boolean;
  description?: string;
  group: StateGroup;
  createdAt?: string;
  updatedAt?: string;
}
