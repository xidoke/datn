import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { useUserStore, UserStore } from './userStore'
// Import other stores as needed

interface RootStore {
  user: UserStore
  // Add other stores here

  resetOnSignOut: () => void
}

export const useRootStore = create<RootStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: useUserStore.getState(),
        // Initialize other stores

        resetOnSignOut: () => {
          useUserStore.getState().reset()
          // Reset other stores

          set({
            user: useUserStore.getState(),
            // Update other stores
          })
        },
      }),
      {
        name: 'root-store',
        partialize: (state) => ({
          user: state.user,
          // Specify which parts of the state to persist
        }),
      }
    )
  )
)

// Helper functions to access specific stores
export const useUser = () => useRootStore((state) => state.user)
// Add other helper functions for remaining stores

// Helper function to reset all stores
export const useResetStores = () => useRootStore((state) => state.resetOnSignOut)