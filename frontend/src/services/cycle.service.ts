/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICycle } from "@/types/cycle";
import { APIService } from "./api.service";
import { API_BASE_URL } from "@/helpers/common.helper";
import { ApiResponse } from "@/types";
export class CycleService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async fetchCycles(workspaceSlug: string, projectId: string): Promise<ICycle[]> {
    return this.get<ICycle[]>(`workspaces/${workspaceSlug}/projects/${projectId}/cycles`).then(
      (response) => response.data.data
    ).catch((error) => {
      throw error?.response?.data
  });
  }

  async createCycle(workspaceSlug: string, projectId: string, data: Partial<ICycle>) : Promise<ICycle> {
    return this.post<ICycle>(`workspaces/${workspaceSlug}/projects/${projectId}/cycles`, data).then(
      (response) => response.data.data
    ).catch((error) => {
      throw error?.response?.data
  });
  }

  async updateCycle(workspaceSlug: string, projectId: string, cycleId: string, data: Partial<ICycle>) : Promise<ICycle> {
    return this.patch<ICycle>(`workspaces/${workspaceSlug}/projects/${projectId}/cycles/${cycleId}`, data).then(
      (response) => response.data.data
    ).catch((error) => {
      throw error?.response?.data
  });
  }

  async deleteCycle(workspaceSlug: string, projectId: string, cycleId: string) : Promise<ApiResponse<null>> {
    return this.delete<null>(`workspaces/${workspaceSlug}/projects/${projectId}/cycles/${cycleId}`).then(
      (response) => response.data
    ).catch((error) => {
      throw error?.response?.data
  });
  }

  async fetchCycleProgress(workspaceSlug: string, projectId: string, cycleId: string) {
    return this.get<{
      totalIssues: number;
    incompleteIssues: number;
    progress: number;
    }>(`workspaces/${workspaceSlug}/projects/${projectId}/cycles/${cycleId}/progress`).then(
      (response) => response.data.data
    ).catch((error) => {
      throw error?.response?.data
  });
  }
}
