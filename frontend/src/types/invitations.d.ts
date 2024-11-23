export interface Invitation {
    id: string;
    email: string;
    role: string;
    status: string;
    workspace: {
        id: string;
        name: string;
        slug: string;
        logoUrl?: string;
    }
    createdAt: string;
    updatedAt: string;
}
export interface InvitationsResponse {
    invitations: Invitation[];
    totalCount: number;
}