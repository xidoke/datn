export interface WorkspaceMember {
  id: string;
  userId: string;
  role: string;
  workspaceSlug: string;
  joinedAt: Date;
  user: UserLite;
}