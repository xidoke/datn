export interface IProject {
  id: string;
  name: string;
  description: string;
  key: string;
  leadId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectState {
  projects: IProject[];
  setProjects: (projects: IProject[]) => void;
  addProject: (project: IProject) => void;
  updateProject: (updatedProject: IProject) => void;
  deleteProject: (projectId: string) => void;
}
