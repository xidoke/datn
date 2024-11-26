import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { State } from '../_types/kanban'

interface ProjectStateStore {
  states: State[]
  isLoading: boolean
  fetchStates: (projectId: string) => Promise<void>
  addState: (state: Omit<State, 'id'>) => Promise<void>
  updateState: (id: string, updates: Partial<State>) => Promise<void>
  deleteState: (id: string) => Promise<void>
}

export const useProjectStateStore = create<ProjectStateStore>()(
  persist(
    (set, get) => ({
      states: [],
      isLoading: false,

      fetchStates: async (projectId: string) => {
        set({ isLoading: true })
        try {
          const storedStates = get().states
          if (storedStates.length > 0) {
            // Nếu có dữ liệu trong storage, sử dụng nó
            set({ states: storedStates })
          } else {
            // Nếu không có dữ liệu, sử dụng sample data
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 500))
            const sampleStates: State[] = [
              { id: '1', name: 'Backlog', color: '#9333ea', group: 'backlog', icon: '📋' },
              { id: '2', name: 'Todo', color: '#3b82f6', group: 'unstarted', icon: '📝' },
              { id: '3', name: 'In Progress', color: '#eab308', group: 'started', icon: '🏗️' },
              { id: '4', name: 'Done', color: '#22c55e', group: 'completed', icon: '✅' },
            ]
            set({ states: sampleStates })
          }
        } catch (error) {
          console.error('Failed to fetch states:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      addState: async (state) => {
        const newState = { ...state, id: Date.now().toString() }
        set(store => ({ states: [...store.states, newState] }))
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000))
      },

      updateState: async (id, updates) => {
        set(store => ({
          states: store.states.map(state =>
            state.id === id ? { ...state, ...updates } : state
          ),
        }))
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000))
      },

      deleteState: async (id) => {
        set(store => ({
          states: store.states.filter(state => state.id !== id),
        }))
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000))
      },
    }),
    {
      name: 'project-state-storage-dev',
    }
  )
)

