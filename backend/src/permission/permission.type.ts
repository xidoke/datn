export { WorkspaceRole } from "@prisma/client";

export enum WorkspacePermission {
  // Existing permissions
  VIEW_WORKSPACE = "VIEW_WORKSPACE",
  UPDATE_WORKSPACE = "UPDATE_WORKSPACE",
  DELETE_WORKSPACE = "DELETE_WORKSPACE",

  VIEW_INVITATIONS = "VIEW_INVITATIONS",
  CANCEL_INVITATION = "CANCEL_INVITATION",

  INVITE_MEMBER = "INVITE_MEMBER",
  ADD_MEMBER = "ADD_MEMBER",
  UPDATE_MEMBER_ROLE = "UPDATE_MEMBER_ROLE",
  REMOVE_MEMBER = "REMOVE_MEMBER",
   
  //permissions for projects
  VIEW_PROJECT = "VIEW_PROJECT",
  CREATE_PROJECT = "CREATE_PROJECT",
  UPDATE_PROJECT = "UPDATE_PROJECT",
  DELETE_PROJECT = "DELETE_PROJECT",

  // Permissions for labels
  CREATE_LABEL = "CREATE_LABEL",
  VIEW_LABEL = "VIEW_LABEL",
  UPDATE_LABEL = "UPDATE_LABEL",
  DELETE_LABEL = "DELETE_LABEL",

  // Permissions for issues
  CREATE_ISSUE = "CREATE_ISSUE",
  VIEW_ISSUE = "VIEW_ISSUE",
  UPDATE_ISSUE = "UPDATE_ISSUE",
  DELETE_ISSUE = "DELETE_ISSUE",
  ASSIGN_ISSUE = "ASSIGN_ISSUE",

  // Permissions for comments
  CREATE_COMMENT = "CREATE_COMMENT",
  VIEW_COMMENT = "VIEW_COMMENT",
  UPDATE_COMMENT = "UPDATE_COMMENT",
  DELETE_COMMENT = "DELETE_COMMENT",

  // Permissions for attachments
  UPLOAD_ATTACHMENT = "UPLOAD_ATTACHMENT",
  VIEW_ATTACHMENT = "VIEW_ATTACHMENT",
  DELETE_ATTACHMENT = "DELETE_ATTACHMENT",

  // Permissions for project settings
  MANAGE_PROJECT_SETTINGS = "MANAGE_PROJECT_SETTINGS",

  // Permissions for reporting
  VIEW_REPORTS = "VIEW_REPORTS",
  GENERATE_REPORTS = "GENERATE_REPORTS",

  // Permissions for integrations
  MANAGE_INTEGRATIONS = "MANAGE_INTEGRATIONS",

  // Permissions for workflow
  MANAGE_WORKFLOW = "MANAGE_WORKFLOW",

  // Permissions for time tracking (if applicable)
  TRACK_TIME = "TRACK_TIME",
  VIEW_TIME_LOGS = "VIEW_TIME_LOGS",

  // Permissions for API access (if applicable)
  API_ACCESS = "API_ACCESS",
}
