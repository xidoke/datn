export interface ICycle {
  id: string;
  title: string;
  description?: string;
  startDate: Date | undefined; // ISO date string
  dueDate: Date | undefined; // ISO date string
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