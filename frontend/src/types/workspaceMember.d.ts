export interface WorkspaceMember {
  id: string;
  userId: string;
  role: string;
  workspaceSlug: string;
  joinedAt: Date;
  user: UserLite;
}

export interface InvitationUser {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}
export interface UserLite {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}