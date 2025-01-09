/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { ICycle } from '@/types/cycle';
import { CycleService } from '@/services/cycle.service';
import { mutate } from 'swr';

interface CycleState {
  cycles: Record<string, ICycle>;
  activeCycleId: string | null;
  completedCycleIds: string[];
  upcomingCycleIds: string[];
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
  fetchCycleProgress: (workspaceSlug : string, projectId: string, cycleId: string) => Promise<number>;
  reset: () => void;
}

const cycleService = new CycleService();
export const useCycleStore = create<CycleState>()(
  devtools(persist(
    immer((set, get) => ({
      cycles: {},
      activeCycleId: null,
      completedCycleIds: [],
      upcomingCycleIds: [],
      isLoading: false,
      error: null,

      reset: () => {
        set({ cycles: {}, activeCycleId: null, completedCycleIds: [], upcomingCycleIds: [], isLoading: false, error: null });
    },

      fetchCycles: async (workspaceSlug: string, projectId: string) => {
        set({ isLoading: true });
        try {
          
          const cycles = await cycleService.fetchCycles(workspaceSlug, projectId);
          // active cycle là cycle là cycle đang diễn ra (có startDate < currentDate < dueDate)
          // 1. lấy tất cả các cycle
          // 2. lọc ra cycle đang diễn ra (chỉ có 1 cycle đang diễn ra)
          // 3. set activeCycleId = cycle đó
          // 4. set cycles = tất cả
          // 5. isLoading = false

          const activeCycle = cycles.find((cycle) => {
            const currentDate = new Date();
            const leftBound = new Date(cycle.startDate);
            const rightBound = new Date(cycle.dueDate);
            return currentDate >= leftBound && currentDate <= rightBound;
          });

          const completedCycles = cycles.filter((cycle) => {
            if (!cycle.dueDate) {
              return false;
            }
            const currentDate = new Date();
            const rightBound = new Date(cycle.dueDate);
            return currentDate > rightBound;
          });
          const completedCycleIds = completedCycles.map((cycle) => cycle.id);

          // upcoming cycle là các cycle còn lại
          const upcomingCycles = cycles.filter((cycle) => {
            if (completedCycleIds.includes(cycle.id)) {
              return false;
            }
            if (activeCycle && activeCycle.id === cycle.id) {
              return false;
            }
            return true;
          }
          );

          const upcomingCycleIds = upcomingCycles.map((cycle) => cycle.id);

          set((state) => {
            state.cycles = cycles.reduce((acc: Record<string, ICycle>, cycle: ICycle) => {
              acc[cycle.id] = cycle;
              return acc;
            }, {});
            state.activeCycleId = activeCycle?.id || null;
            state.isLoading = false;
            state.completedCycleIds = completedCycleIds;
            state.upcomingCycleIds = upcomingCycleIds;

          });
        } catch (error) {
          set({ error: 'Failed to fetch cycles', isLoading: false });
          throw error;
        }
      },

      fetchCycleProgress: async (workspaceSlug: string, projectId: string,cycleId: string) => {
        try {
          const cycleProgress = await cycleService.fetchCycleProgress(workspaceSlug, projectId, cycleId);
          set((state) => {
            state.cycles[cycleId].progress = cycleProgress;
          });
          return cycleProgress.progress;
        } catch (error) {
          set({ error: 'Failed to fetch cycle progress' });
          throw error;
        }
      },

      createCycle: async (workspaceSlug: string, projectId: string, cycleData: Partial<ICycle>) => {
        set({ isLoading: true });
        try {
          const cycle = await cycleService.createCycle(workspaceSlug, projectId, cycleData);
          set((state) => {
            state.cycles[cycle.id] = cycle;
            state.isLoading = false;
          });
          mutate(`PROJECT_CYCLES_${workspaceSlug}_${projectId}`);
        } catch (error: any) {
          const errorMessage = error?.message || "Fail to create new cycle. Please try again.";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw new Error(errorMessage);
        }
      },

      updateCycle: async (workspaceSlug: string, projectId: string, cycleId: string, cycleData: Partial<ICycle>) => {
        set({ isLoading: true });
        try {
          const updatedCycle = await cycleService.updateCycle(workspaceSlug, projectId, cycleId, cycleData);
          set((state) => {
            state.cycles[cycleId] = updatedCycle;
            state.isLoading = false;
          });
          mutate(`PROJECT_CYCLES_${workspaceSlug}_${projectId}`);
        } catch (error) {
          
          set({ error: 'Failed to update cycle', isLoading: false });
          throw error;
        }
      },

      deleteCycle: async (workspaceSlug: string, projectId: string, cycleId: string) => {
        set({ isLoading: true });
        try {
          
          await cycleService.deleteCycle(workspaceSlug, projectId, cycleId);
          set((state) => {
            delete state.cycles[cycleId];
            if (state.activeCycleId === cycleId) {
              state.activeCycleId = null;
            }
            state.isLoading = false;
          });
        } catch (error) {
          set({ error: 'Failed to delete cycle', isLoading: false });
          throw error;
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
    { name: 'cycle-store',
      partialize: (state) => ({
          cycles: state.cycles,
          activeCycleId: state.activeCycleId,
          completedCycleIds: state.completedCycleIds,
          upcomingCycleIds: state.upcomingCycleIds,
        }),
     }
  ), 
  )
);


