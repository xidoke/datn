export interface WorkspaceMember {
  id: string;
  userId: string;
  role: string;
  workspaceSlug: string;
  joinedAt: Date;
  user: UserLite;
}

export interface UserLite {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}