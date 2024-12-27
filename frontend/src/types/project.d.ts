export interface Project {
  id: string;
  name: string;
  token: string;
  description?: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

