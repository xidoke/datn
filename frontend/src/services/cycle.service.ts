/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICycle } from "@/types/cycle";
import { APIService } from "./api.service";
import { API_BASE_URL } from "@/helpers/common.helper";
import { ApiResponse } from "@/types";
export class CycleService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }


  async createCycle(workspaceSlug: string, projectId: string, data: Partial<ICycle>) : Promise<ICycle> {
    return this.post<ICycle>(`workspaces/${workspaceSlug}/projects/${projectId}/cycles`, data).then(
      (response) => response.data.data
    ).catch((error) => {
      throw error?.response.data
  });
  }
}
