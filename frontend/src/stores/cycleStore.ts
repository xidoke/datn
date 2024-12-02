import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { ICycle } from '@/types/cycle';

interface CycleState {
  cycles: Record<string, ICycle>;
  activeCycleId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCycles: (workspaceSlug: string, projectId: string) => Promise<void>;
  createCycle: (workspaceSlug: string, projectId: string, cycleData: Partial<ICycle>) => Promise<void>;
  updateCycle: (workspaceSlug: string, projectId: string, cycleId: string, cycleData: Partial<ICycle>) => Promise<void>;
  deleteCycle: (workspaceSlug: string, projectId: string, cycleId: string) => Promise<void>;
  setActiveCycle: (cycleId: string) => void;

  // Computed (helper functions)
  getCycleById: (cycleId: string) => ICycle | undefined;
  getActiveCycle: () => ICycle | undefined;
  getFilteredCycles: (filter: (cycle: ICycle) => boolean) => ICycle[];
}

// Helper function to simulate API calls
const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
};

export const useCycleStore = create<CycleState>()(
  devtools(persist(
    immer((set, get) => ({
      cycles: {},
      activeCycleId: null,
      isLoading: false,
      error: null,

      fetchCycles: async (workspaceSlug: string, projectId: string) => {
        set({ isLoading: true });
        try {
          // Simulated API call
          const cycles = await simulateApiCall<ICycle[]>([
            { id: '1', name: 'Cycle 1', startDate: '2023-01-01', dueDate: '2023-01-31' },
            { id: '2', name: 'Cycle 2', startDate: '2023-02-01', dueDate: '2023-02-28' },
          ]);
          set((state) => {
            state.cycles = cycles.reduce((acc: Record<string, ICycle>, cycle: ICycle) => {
              acc[cycle.id] = cycle;
              return acc;
            }, {});
            state.isLoading = false;
            state.activeCycleId = cycles[0]?.id || null;
          });
        } catch (error) {
          set({ error: 'Failed to fetch cycles', isLoading: false });
        }
      },

      createCycle: async (workspaceSlug: string, projectId: string, cycleData: Partial<ICycle>) => {
        set({ isLoading: true });
        try {
          // Simulated API call
          const newCycle = await simulateApiCall<ICycle>({
            id: Date.now().toString(),
            ...cycleData,
          } as ICycle);
          set((state) => {
            state.cycles[newCycle.id] = newCycle;
            state.isLoading = false;
          });
        } catch (error) {
          set({ error: 'Failed to create cycle', isLoading: false });
        }
      },

      updateCycle: async (workspaceSlug: string, projectId: string, cycleId: string, cycleData: Partial<ICycle>) => {
        set({ isLoading: true });
        try {
          // Simulated API call
          const updatedCycle = await simulateApiCall<ICycle>({
            ...get().cycles[cycleId],
            ...cycleData,
          });
          set((state) => {
            state.cycles[cycleId] = updatedCycle;
            state.isLoading = false;
          });
        } catch (error) {
          set({ error: 'Failed to update cycle', isLoading: false });
        }
      },

      deleteCycle: async (workspaceSlug: string, projectId: string, cycleId: string) => {
        set({ isLoading: true });
        try {
          // Simulated API call
          await simulateApiCall(null);
          set((state) => {
            delete state.cycles[cycleId];
            if (state.activeCycleId === cycleId) {
              state.activeCycleId = null;
            }
            state.isLoading = false;
          });
        } catch (error) {
          set({ error: 'Failed to delete cycle', isLoading: false });
        }
      },

      setActiveCycle: (cycleId: string) => {
        set({ activeCycleId: cycleId });
      },

      getCycleById: (cycleId: string) => {
        return get().cycles[cycleId];
      },

      getActiveCycle: () => {
        const { activeCycleId, cycles } = get();
        return activeCycleId ? cycles[activeCycleId] : undefined;
      },

      getFilteredCycles: (filter: (cycle: ICycle) => boolean) => {
        return Object.values(get().cycles).filter(filter);
      },
    })),
    { name: 'cycle-store' }
  ), 
  )
);


