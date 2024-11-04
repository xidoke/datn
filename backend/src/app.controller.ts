import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/api/me")
  getUserInfo() {
    const currentUser = {
      id: "1",
      avatar: "https://github.com/shadcn.png",
      display_name: "Xidoke",
      email: "user@example.com",
      first_name: "John",
      last_name: "Doe",
      last_workspace_id: "2",
      username: "user123",
      // ... other attributes
    };
    return currentUser;
  }

  @Get("/api/workspaces/")
  getUserWorkspaces() {
    const workspaces = [
      {
        id: "1",
        name: "Workspace 1",
        logo: "alarm-clock-plus",
      },
      {
        id: "2",
        name: "Workspace 2",
        logo: "settings",
      },
    ];
    return workspaces;
  }

  // New endpoints for issues
  @Get("/api/projects/:projectId/issues")
  getIssues(@Param("projectId") projectId: string) {
    return [
      {
        id: "1",
        title: "Fix login bug",
        description: "Users are unable to log in using their Google accounts",
        status: "TODO",
        priority: "HIGH",
        assigneeId: "1",
        reporterId: "2",
        projectId: projectId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Implement dark mode",
        description: "Add a dark mode option to improve user experience",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        assigneeId: "2",
        reporterId: "1",
        projectId: projectId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  @Post("/api/projects/:projectId/issues")
  createIssue(@Param("projectId") projectId: string, @Body() issueData: any) {
    const newIssue = {
      id: Math.random().toString(36).substr(2, 9),
      ...issueData,
      projectId: projectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newIssue;
  }

  @Put("/api/issues/:issueId")
  updateIssue(@Param("issueId") issueId: string, @Body() issueData: any) {
    return {
      ...issueData,
      id: issueId,
      updatedAt: new Date().toISOString(),
    };
  }

  @Delete("/api/issues/:issueId")
  deleteIssue(@Param("issueId") issueId: string) {
    return { success: true, message: `Issue ${issueId} deleted successfully` };
  }

  @Get("/api/workspaces/:workspaceId/projects")
  getProjects(@Param("workspaceId") workspaceId: string) {
    return [
      {
        id: "1",
        name: "Learn NestJS",
        icon: "rocket",
        description: "Learning NestJS framework",
        leadId: "1",
        workspaceId: workspaceId,
        subProjects: [
          {
            id: "1-1",
            name: "NestJS",
            icon: "folder",
            description: "Core NestJS concepts",
            leadId: "1",
            workspaceId: workspaceId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Jira Clone Development",
        icon: "code",
        description: "Main development project",
        leadId: "2",
        workspaceId: workspaceId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  @Post("/api/workspaces/:workspaceId/projects")
  createProject(
    @Param("workspaceId") workspaceId: string,
    @Body() projectData: any,
  ) {
    const newProject = {
      id: Math.random().toString(36).substr(2, 9),
      ...projectData,
      workspaceId: workspaceId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newProject;
  }

  @Put("/api/projects/:projectId")
  updateProject(
    @Param("projectId") projectId: string,
    @Body() projectData: any,
  ) {
    return {
      ...projectData,
      id: projectId,
      updatedAt: new Date().toISOString(),
    };
  }

  @Delete("/api/projects/:projectId")
  deleteProject(@Param("projectId") projectId: string) {
    return {
      success: true,
      message: `Project ${projectId} deleted successfully`,
    };
  }

  // New endpoints for comments
  @Get("/api/issues/:issueId/comments")
  getComments(@Param("issueId") issueId: string) {
    return [
      {
        id: "1",
        content: "This is a critical issue, we should prioritize it.",
        authorId: "1",
        issueId: issueId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        content: "I agree, I'll start working on it right away.",
        authorId: "2",
        issueId: issueId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  @Post("/api/issues/:issueId/comments")
  createComment(@Param("issueId") issueId: string, @Body() commentData: any) {
    const newComment = {
      id: Math.random().toString(36).substr(2, 9),
      ...commentData,
      issueId: issueId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newComment;
  }

  @Put("/api/comments/:commentId")
  updateComment(
    @Param("commentId") commentId: string,
    @Body() commentData: any,
  ) {
    return {
      ...commentData,
      id: commentId,
      updatedAt: new Date().toISOString(),
    };
  }

  @Delete("/api/comments/:commentId")
  deleteComment(@Param("commentId") commentId: string) {
    return {
      success: true,
      message: `Comment ${commentId} deleted successfully`,
    };
  }

  // New endpoints for notifications
  @Get("/api/notifications")
  getNotifications() {
    return [
      {
        id: "1",
        type: "ISSUE_ASSIGNED",
        content: 'You have been assigned to the issue "Fix login bug"',
        userId: "1",
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        type: "COMMENT_ADDED",
        content: 'New comment on the issue "Implement dark mode"',
        userId: "1",
        read: true,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  @Put("/api/notifications/:notificationId/read")
  markNotificationAsRead(@Param("notificationId") notificationId: string) {
    return {
      id: notificationId,
      read: true,
      updatedAt: new Date().toISOString(),
    };
  }

  @Delete("/api/notifications/:notificationId")
  deleteNotification(@Param("notificationId") notificationId: string) {
    return {
      success: true,
      message: `Notification ${notificationId} deleted successfully`,
    };
  }
}
