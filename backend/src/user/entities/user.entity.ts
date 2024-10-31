// src/user/entities/user.entity.ts

export class User {
  id: string;
  email: string;
  cognitoId: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
