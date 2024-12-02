export interface Workspace {
  id: string;
  slug: string;
  name: string;
  ownerId: string;
  logoUrl: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  projectCount: number;
  permissions: string[];
}

