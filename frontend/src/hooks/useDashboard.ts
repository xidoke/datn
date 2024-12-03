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
      user: User
    }>
  }>
  issuesByStateGroup: Array<{
    group: string
    count: number
  }>
}

const workspaceService = new WorkspaceService()
const fetchDashboardData = async (workspaceSlug: string): Promise<DashboardData> => {
  return workspaceService.getWorkspaceDashboard(workspaceSlug) as Promise<DashboardData>
}

export const useDashboardData = (workspaceSlug: string) => {
  return useSWR(['dashboardData', workspaceSlug], () => fetchDashboardData(workspaceSlug), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 5 * 60 * 1000, // 5 minutes
  })
}

