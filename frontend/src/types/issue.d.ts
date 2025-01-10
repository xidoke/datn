import { ICycle } from "./cycle";
import { User } from "./user";

// Define the priority types
type TIssuePriorities = '0' | '1' | '2' | '3' | '4';
export interface IssueLabel {
  id: string;
  name: string;
  color: string;
}

export interface IFileAsset {
  id: string;
  asset: string;
  attributes: {
    name: string;
    type: string;
    size: number;
  };
  size: number;
  entityType: string;
  entityId: string;
  workspaceId: string;
  isUploaded: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Issue {
  id: string;
  title: string;
  description?: string;
  fullIdentifier: string;
  sequenceNumber: number;
  project: {
  title: string;
  description?: string;
  stateId: string;
  state: State;
    id: string;
    name: string;
    token: string;
  };
  FileAssets: IFileAsset[];
  parentId?: string | null;
  stateId: string;
  state: {
    id: string;
    name: string;
    color: string;
    group: string;
  };
  creator: User;
  assigneeIds: string[];
  assignees: IssueAssignee[];
  labelIds: string[];
  labels: Label[];
  priority: number;
  startDate?: string | null;
  dueDate?: stringv | null;
  createdAt: string;
  updatedAt: string;
  cycleId?: string | null;
  cycle: ICycle;
}

export interface IssueAssignee {
  id: string;
  workspaceMember: {
    user: User;
  };
  memberId: string;
  issueId: string;
}

  export interface Column {
  id: string;
  title: string;
  issues: Issue[];
  icon: React.FC<IStateGroupIcon>;
}

interface IStateGroupIcon {
  className?: string;
  color?: string;
  stateGroup: TStateGroups;
  height?: string;
  width?: string;
}

export interface Board {
  columns: Column[];
}
