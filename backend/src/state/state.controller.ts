import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { StateService } from "./state.service";
import { CognitoAuthGuard } from "src/auth/guards/cognito.guard";

@Controller("/workspaces/:workspaceSlug/projects/:projectId/states")
@UseGuards(CognitoAuthGuard)
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get()
  async getAllStates(
    @Param("workspaceSlug") workspaceSlug: string,
    @Param("projectId") projectId: string,
  ) {
    return this.stateService.getAllStates(workspaceSlug, projectId);
  }
}
