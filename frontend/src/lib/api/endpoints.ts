import api from "./index";
import {
  User,
  Workspace,
  Project,
  Issue,
  IssueComment,
  Label,
  State,
} from "@/types";

// Authentication endpoints
export const login = (email: string, password: string) =>
  api.post<{ user: User; token: string }>("/auth/login", { email, password });

export const register = (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) =>
  api.post<{ user: User; token: string }>("/auth/register", {
    email,
    password,
    firstName,
    lastName,
  });

export const logout = () => api.post("/auth/logout");

export const refreshToken = () =>
  api.post<{ token: string }>("/auth/refresh-token");

export const forgotPassword = (email: string) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = (token: string, newPassword: string) =>
  api.post("/auth/reset-password", { token, newPassword });

export const changePassword = (oldPassword: string, newPassword: string) =>
  api.post("/auth/change-password", { oldPassword, newPassword });

// User endpoints
export const fetchCurrentUser = () => api.get<User>("/users/me");
export const updateUser = (userId: string, data: Partial<User>) =>
  api.put<User>(`/users/${userId}`, data);

// Workspace endpoints
export const fetchWorkspaces = () => api.get<Workspace[]>("/workspaces");
export const createWorkspace = (data: Partial<Workspace>) =>
  api.post<Workspace>("/workspaces", data);
export const updateWorkspace = (
  workspaceId: string,
  data: Partial<Workspace>,
) => api.put<Workspace>(`/workspaces/${workspaceId}`, data);

// Project endpoints
export const fetchProjects = (workspaceId: string) =>
  api.get<Project[]>(`/workspaces/${workspaceId}/projects`);
export const createProject = (workspaceId: string, data: Partial<Project>) =>
  api.post<Project>(`/workspaces/${workspaceId}/projects`, data);
export const updateProject = (projectId: string, data: Partial<Project>) =>
  api.put<Project>(`/projects/${projectId}`, data);

// Issue endpoints
export const fetchIssues = (projectId: string) =>
  api.get<Issue[]>(`/projects/${projectId}/issues`);
export const createIssue = (projectId: string, data: Partial<Issue>) =>
  api.post<Issue>(`/projects/${projectId}/issues`, data);
export const updateIssue = (issueId: string, data: Partial<Issue>) =>
  api.put<Issue>(`/issues/${issueId}`, data);

// Comment endpoints
export const fetchComments = (issueId: string) =>
  api.get<IssueComment[]>(`/issues/${issueId}/comments`);
export const createComment = (issueId: string, data: Partial<IssueComment>) =>
  api.post<IssueComment>(`/issues/${issueId}/comments`, data);

// Label endpoints
export const fetchLabels = (projectId: string) =>
  api.get<Label[]>(`/projects/${projectId}/labels`);
export const createLabel = (projectId: string, data: Partial<Label>) =>
  api.post<Label>(`/projects/${projectId}/labels`, data);

// State endpoints
export const fetchStates = (projectId: string) =>
  api.get<State[]>(`/projects/${projectId}/states`);
export const createState = (projectId: string, data: Partial<State>) =>
  api.post<State>(`/projects/${projectId}/states`, data);
