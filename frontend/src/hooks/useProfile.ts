import useSWR from 'swr'
import { WorkspaceService } from '@/services/workspace.service'
import { User } from '@/types'

interface DashboardData {
  stats: {
    assignedCount: number
    overdueCount: number
    createdCount: number
    completedCount: number
  }
  recentAssignedIssues: Array<{
    id: string
    name: string
    priority: number
    dueDate: string
    sequenceNumber: number
    state: {
      name: string
      group: string
    }
    project: {
      id: string
      name: string
      token: string
    }
  }>
  recentCreatedIssues: Array<{
    id: string
    name: string
    priority: number
    sequenceNumber: number
    state: {
      name: string
      group: string
    }
    project: {
      id: string
      name: string
      token: string
    }
    assignees: Array<{
      workspaceMember: {
        user: User
      }
    }>
  }>
  issuesByStateGroup: Array<{
    group: string
    count: number
  }>
  issuesByPriority: Array<{  // Add this type
    priority: number
    count: number
  }>
}

const workspaceService = new WorkspaceService()
const fetchMemberDashboardData = async (workspaceSlug: string, userId: string): Promise<DashboardData> => {
  return workspaceService.getWorkspaceMemberDashboard(workspaceSlug, userId) as Promise<DashboardData>
}

export const useProfile = (workspaceSlug: string, userId: string) => {
  return useSWR(['profile', workspaceSlug, userId], () => fetchMemberDashboardData(workspaceSlug, userId), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 5 * 60 * 1000, // 5 minutes
  })
}

