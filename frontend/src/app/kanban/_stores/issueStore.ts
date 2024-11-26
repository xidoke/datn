import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Issue, State } from '../_types/kanban'

interface IssueStore {
  issues: Issue[]
  isLoading: boolean
  fetchIssues: (projectId: string) => Promise<void>
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateIssue: (id: string, updates: Partial<Issue>) => Promise<void>
  deleteIssue: (id: string) => Promise<void>
}

export const useIssueStore = create<IssueStore>()(
  persist(
    (set, get) => ({
      issues: [],
      isLoading: false,

      fetchIssues: async (projectId: string) => {
        set({ isLoading: true })
        try {
          const storedIssues = get().issues
          if (storedIssues.length > 0) {
            // Nếu có dữ liệu trong storage, sử dụng nó
            set({ issues: storedIssues })
          } else {
            // Nếu không có dữ liệu, sử dụng sample data
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            const sampleIssues: Issue[] = [
              {
                id: 'ISSUE-1',
                title: 'Implement user authentication',
                description: 'Set up user authentication system using JWT',
                state: { id: '2', name: 'Todo', color: '#3b82f6', group: 'unstarted' },
                labels: [
                  { id: '1', name: 'Feature', color: '#4bce97' },
                  { id: '2', name: 'Backend', color: '#f87171' }
                ],
                priority: 'high',
                createdAt: '2023-06-01T10:00:00Z',
                updatedAt: '2023-06-01T10:00:00Z',
              },
              {
                id: 'ISSUE-2',
                title: 'Design landing page',
                description: 'Create a responsive design for the landing page',
                state: { id: '3', name: 'In Progress', color: '#eab308', group: 'started' },
                labels: [
                  { id: '3', name: 'Design', color: '#a78bfa' },
                  { id: '4', name: 'Frontend', color: '#60a5fa' }
                ],
                priority: 'medium',
                createdAt: '2023-06-02T09:00:00Z',
                updatedAt: '2023-06-02T14:00:00Z',
              },
              {
                id: 'ISSUE-3',
                title: 'Optimize database queries',
                description: 'Improve performance of slow database queries',
                state: { id: '2', name: 'Todo', color: '#3b82f6', group: 'unstarted' },
                labels: [
                  { id: '2', name: 'Backend', color: '#f87171' },
                  { id: '5', name: 'Performance', color: '#fbbf24' },
                  { id: '6', name: 'Database', color: '#34d399' }
                ],
                priority: 'high',
                createdAt: '2023-06-03T11:00:00Z',
                updatedAt: '2023-06-03T11:00:00Z',
              },
              {
                id: 'ISSUE-4',
                title: 'Implement dark mode',
                description: 'Add dark mode support to the application',
                state: { id: '3', name: 'In Progress', color: '#eab308', group: 'started' },
                labels: [
                  { id: '4', name: 'Frontend', color: '#60a5fa' },
                  { id: '7', name: 'UI/UX', color: '#f472b6' }
                ],
                priority: 'low',
                createdAt: '2023-06-04T13:00:00Z',
                updatedAt: '2023-06-04T15:00:00Z',
              },
              {
                id: 'ISSUE-5',
                title: 'Write API documentation',
                description: 'Create comprehensive documentation for the API endpoints',
                state: { id: '4', name: 'Done', color: '#22c55e', group: 'completed' },
                labels: [
                  { id: '8', name: 'Documentation', color: '#94a3b8' }
                ],
                priority: 'medium',
                createdAt: '2023-06-05T09:00:00Z',
                updatedAt: '2023-06-05T16:00:00Z',
              },
              {
                id: 'ISSUE-6',
                title: 'Implement file upload feature',
                description: 'Add ability to upload and manage files in the application',
                state: { id: '2', name: 'Todo', color: '#3b82f6', group: 'unstarted' },
                labels: [
                  { id: '1', name: 'Feature', color: '#4bce97' },
                  { id: '2', name: 'Backend', color: '#f87171' },
                  { id: '4', name: 'Frontend', color: '#60a5fa' }
                ],
                priority: 'high',
                createdAt: '2023-06-06T10:00:00Z',
                updatedAt: '2023-06-06T10:00:00Z',
              },
              {
                id: 'ISSUE-7',
                title: 'Refactor authentication middleware',
                description: 'Improve and optimize the authentication middleware',
                state: { id: '3', name: 'In Progress', color: '#eab308', group: 'started' },
                labels: [
                  { id: '2', name: 'Backend', color: '#f87171' },
                  { id: '9', name: 'Refactoring', color: '#c084fc' },
                  { id: '10', name: 'Security', color: '#f43f5e' }
                ],
                priority: 'high',
                createdAt: '2023-06-07T11:00:00Z',
                updatedAt: '2023-06-07T14:00:00Z',
              }
            ]
            set({ issues: sampleIssues })
          }
        } catch (error) {
          console.error('Failed to fetch issues:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      addIssue: async (issue) => {
        const newIssue: Issue = {
          ...issue,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set(state => ({ issues: [...state.issues, newIssue] }))
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000))
      },

      updateIssue: async (id, updates) => {
        set(state => ({
          issues: state.issues.map(issue =>
            issue.id === id
              ? { ...issue, ...updates, updatedAt: new Date().toISOString() }
              : issue
          ),
        }))
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000))
      },

      deleteIssue: async (id) => {
        set(state => ({
          issues: state.issues.filter(issue => issue.id !== id),
        }))
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000))
      },
    }),
    {
      name: 'issue-storage-dev',
    }
  )
)

