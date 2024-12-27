export interface ICycle {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO date string
  dueDate: string; // ISO date string
  creatorId: string; // User ID
  creator: {
    id: string; // User ID
    firstName: string; // User name
    lastName: string; // User name
    email: string;
    avatarUrl?: string;
  };
   //progress
  progress: {
    totalIssues : number,
      incompleteIssues : number,
      progress : number,
  }; // 0-100
//   status: 'draft' | 'upcoming' | 'active' | 'completed';
//   projectId: string;
//   createdAt: string; // ISO date string
//   updatedAt: string; // ISO date string
//   createdBy: string; // User ID
//   progress: number; // 0-100
//   issueCount: number;
//   completedIssueCount: number;
//   isActive: boolean;
//   isFavorite: boolean;
//   sortOrder: number;
}

export type TCyclePlotType = 'burndown' | 'burnup';

export type TCycleEstimateType = 'issues' | 'points';

export interface ICycleFilters {
  status?: ICycle['status'][];
  startDate?: [string, string]; // [startDate, endDate]
  endDate?: [string, string]; // [startDate, endDate]
  createdBy?: string[];
}