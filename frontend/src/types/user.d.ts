export interface IUser {
  id: string;
  email: string;
  cognitoId: string;
  role: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isActive: boolean;
  lastWorkspaceSlug?: string;
  createdAt: string;
  updatedAt: string;
}
