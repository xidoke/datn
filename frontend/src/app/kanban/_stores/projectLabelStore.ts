import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Label } from '../_types/kanban'

interface ProjectLabelStore {
  labels: Label[]
  isLoading: boolean
  fetchLabels: (projectId: string) => Promise<void>
  addLabel: (label: Omit<Label, 'id'>) => Promise<void>
  updateLabel: (id: string, updates: Partial<Label>) => Promise<void>
  deleteLabel: (id: string) => Promise<void>
}

export const useProjectLabelStore = create<ProjectLabelStore>()(
  persist(
    (set, get) => ({
      labels: [], // Initialize with empty array
      isLoading: false,

      fetchLabels: async (projectId: string) => {
        set({ isLoading: true })
        try {
          const storedLabels = get().labels
          if (storedLabels.length > 0) {
            set({ labels: storedLabels })
          } else {
            await new Promise(resolve => setTimeout(resolve, 500))
            const sampleLabels: Label[] = [
              { id: '1', name: 'Bug', color: '#F87171' },
              { id: '2', name: 'Feature', color: '#60A5FA' },
              { id: '3', name: 'Enhancement', color: '#34D399' },
              { id: '4', name: 'Documentation', color: '#A78BFA' },
              { id: '5', name: 'Design', color: '#F472B6' }
            ]
            set({ labels: sampleLabels })
          }
        } catch (error) {
          console.error('Failed to fetch labels:', error)
          set({ labels: [] }) // Ensure we always have an array even on error
        } finally {
          set({ isLoading: false })
        }
      },

      addLabel: async (label) => {
        const newLabel = { ...label, id: Date.now().toString() }
        set(state => ({ labels: [...state.labels, newLabel] }))
        await new Promise(resolve => setTimeout(resolve, 1000))
      },

      updateLabel: async (id, updates) => {
        set(state => ({
          labels: state.labels.map(label =>
            label.id === id ? { ...label, ...updates } : label
          ),
        }))
        await new Promise(resolve => setTimeout(resolve, 1000))
      },

      deleteLabel: async (id) => {
        set(state => ({
          labels: state.labels.filter(label => label.id !== id),
        }))
        await new Promise(resolve => setTimeout(resolve, 1000))
      },
    }),
    {
      name: 'project-label-storage',
    }
  )
)