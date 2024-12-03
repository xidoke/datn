import { Issue } from "@/types";
import { APIService } from "./api.service";
import { API_BASE_URL } from "@/helpers/common.helper";
export class IssueService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async fetchIssues(workspaceSlug: string, projectId: string, params: any ) : Promise<{ issues: Issue[], pagination: any}> {
    return this.get<{ issues: Issue[], pagination: any}>(`workspaces/${workspaceSlug}/projects/${projectId}/issues`, params).then(
      (response) => response.data.data
    ).catch((error) => {
      throw error?.response.data
  });
  }
}
