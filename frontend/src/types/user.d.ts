export interface IUser {
    id: string;
    email: string;
    cognitoId: string;
    role: string;
    firstName: string | undefined;
    lastName: string | undefined;
    avatarUrl: string | undefined;
    isActive: boolean;
    lastWorkspaceSlug: string | undefined;
    createdAt: Date;
    updatedAt: Date;
}
