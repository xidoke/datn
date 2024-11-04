export interface Project {
  id: string;
  name: string;
  description?: string;
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
