import { APIService } from "./api.service";
import { ApiResponse, Project } from "@/types";
import { API_BASE_URL } from "@/helpers/common.helper";
import axios from 'axios';

export class ProjectService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async fetchProjects(workspaceSlug: string): Promise<ApiResponse<Project[]>> {
    try {
      const response = await this.get<Project[]>(`/workspaces/${workspaceSlug}/projects`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw error;
    }
  }

  async fetchProjectDetails(workspaceSlug: string, projectId: string): Promise<ApiResponse<Project>> {
    try {
      const response = await this.get<Project>(`/workspaces/${workspaceSlug}/projects/${projectId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw error;
    }
  }

  async createProject(workspaceSlug: string, data: Partial<Project>): Promise<ApiResponse<Project>> {
    try {
      const response = await this.post<Project>(`/workspaces/${workspaceSlug}/projects`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw error;
    }
  }

  async updateProject(workspaceSlug: string, projectId: string, data: Partial<Project>): Promise<ApiResponse<Project>> {
    try {
      const response = await this.patch<Project>(`/workspaces/${workspaceSlug}/projects/${projectId}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw error;
    }
  }

  async deleteProject(workspaceSlug: string, projectId: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.delete<void>(`/workspaces/${workspaceSlug}/projects/${projectId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw error;
    }
  }
}