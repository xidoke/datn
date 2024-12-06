import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import { Label } from "@/types";

export class LabelService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async fetchLabels(workspaceSlug: string, projectId: string): Promise<Label[]> {
    return this.get(`/workspaces/${workspaceSlug}/projects/${projectId}/labels`)
      .then((response) => response?.data.data as Label[])
      .catch((error) => {
        console.error(error);
        if (error.response) {
          throw new Error(error.response.data.message || "Failed to fetch labels");
        } else if (error.request) {
          throw new Error("No response received from server");
        } else {
          throw new Error("Error setting up the request");
        }
      });
  }

  async addLabel(workspaceSlug: string, projectId: string, label: Omit<Label, "id">): Promise<Label> {
    return this.post(`/workspaces/${workspaceSlug}/projects/${projectId}/labels`, label)
      .then((response) => response?.data.data as Label)
      .catch((error) => {
        if (error.response) {
          throw new Error(error.response.data.message || "Failed to add label");
        } else if (error.request) {
          throw new Error("No response received from server");
        } else {
          throw new Error("Error setting up the request");
        }
      });
  }

  async updateLabel(workspaceSlug: string, projectId: string, labelId: string, updates: Partial<Label>): Promise<Label> {
    return this.patch(`/workspaces/${workspaceSlug}/projects/${projectId}/labels/${labelId}`, updates)
      .then((response) => response?.data.data as Label)
      .catch((error) => {
        if (error.response) {
          throw new Error(error.response.data.message || "Failed to update label");
        } else if (error.request) {
          throw new Error("No response received from server");
        } else {
          throw new Error("Error setting up the request");
        }
      });
  }

  async deleteLabel(workspaceSlug: string, projectId: string, labelId: string): Promise<void> {
    return this.delete(`/workspaces/${workspaceSlug}/projects/${projectId}/labels/${labelId}`)
      .then(() => {})
      .catch((error) => {
        if (error.response) {
          throw new Error(error.response.data.message || "Failed to delete label");
        } else if (error.request) {
          throw new Error("No response received from server");
        } else {
          throw new Error("Error setting up the request");
        }
      });
  }
}