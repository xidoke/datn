export interface User {
  id: string;
  email: string;
  cognitoId: string;
  role: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
