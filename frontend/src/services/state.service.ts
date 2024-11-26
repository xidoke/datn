import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import { State } from "@/types";

export class StateService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async fetchStates(workspaceSlug: string, projectId: string): Promise<State[]> {
    return this.get(`/workspaces/${workspaceSlug}/projects/${projectId}/states`)
      .then((response) => response?.data)
      .catch((error) => {
        console.error(error);
        if (error.response) {
          throw new Error(error.response.data.message || "Failed to fetch states");
        } else if (error.request) {
          throw new Error("No response received from server");
        } else {
          throw new Error("Error setting up the request");
        }
      });
  }

  async addState(workspaceSlug: string, projectId: string, state: Omit<State, "id">): Promise<State> {
    return this.post(`/workspaces/${workspaceSlug}/projects/${projectId}/states`, state)
      .then((response) => response?.data)
      .catch((error) => {
        if (error.response) {
          throw new Error(error.response.data.message || "Failed to add state");
        } else if (error.request) {
          throw new Error("No response received from server");
        } else {
          throw new Error("Error setting up the request");
        }
      });
  }

  async updateState(workspaceSlug: string, projectId: string, stateId: string, updates: Partial<State>): Promise<State> {
    return this.patch(`/workspaces/${workspaceSlug}/projects/${projectId}/states/${stateId}`, updates)
      .then((response) => response?.data)
      .catch((error) => {
        if (error.response) {
          throw new Error(error.response.data.message || "Failed to update state");
        } else if (error.request) {
          throw new Error("No response received from server");
        } else {
          throw new Error("Error setting up the request");
        }
      });
  }

  async deleteState(workspaceSlug: string, projectId: string, stateId: string): Promise<void> {
    return this.delete(`/workspaces/${workspaceSlug}/projects/${projectId}/states/${stateId}`)
      .then(() => {})
      .catch((error) => {
        if (error.response) {
          throw new Error(error.response.data.message || "Failed to delete state");
        } else if (error.request) {
          throw new Error("No response received from server");
        } else {
          throw new Error("Error setting up the request");
        }
      });
  }

  async setDefaultState(workspaceSlug: string, projectId: string, stateId: string): Promise<State> {
    return this.patch(`/workspaces/${workspaceSlug}/projects/${projectId}/states/${stateId}/set-default`)
      .then((response) => response?.data)
      .catch((error) => {
        if (error.response) {
          throw new Error(error.response.data.message || "Failed to set default state");
        } else if (error.request) {
          throw new Error("No response received from server");
        } else {
          throw new Error("Error setting up the request");
        }
      });
  }
}

