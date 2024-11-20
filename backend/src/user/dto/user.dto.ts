export class UserDto {
  id: string;
  email: string;
  cognitoId: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  lastWorkspaceSlug: string | null;
}
