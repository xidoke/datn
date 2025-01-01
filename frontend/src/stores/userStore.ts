import { UserService } from "@/services/user.service";
import {  User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useWorkspaceStore } from "./workspaceStore";

interface UserState {
  isLoading: boolean;
  error: string | undefined;
  data: User | undefined;
  lastWorkspaceSlug: string | undefined;
}

interface UserActions {
  fetchCurrentUser: () => Promise<User>;
  updateLastWorkspaceSlug: (slug: string) => Promise<string | undefined>;
  updateUser: (firstName: string, lastName: string) => Promise<User | undefined>;
  updateUserAvatar: (avatarFile: File) => Promise<User | undefined>;
  reset: () => void;
}

export type UserStore = UserState & UserActions;

const initialState: UserState = {
  isLoading: false,
  error: undefined,
  data: undefined,
  lastWorkspaceSlug: undefined,
};

const userService = new UserService();

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      fetchCurrentUser: async () => {
        set({ isLoading: true, error: undefined });
        try {
          const result = await userService.currentUser();
          const user = result.data;
          if (user && user.id) {
            await useWorkspaceStore.getState().fetchWorkspaces();
            set({
              data: user,
              isLoading: false,
              lastWorkspaceSlug: user.lastWorkspaceSlug,
            });
          } else {
            set({ isLoading: false });
          }
          return user;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch user";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      updateLastWorkspaceSlug: async (slug) => {
        const currentSlug = get().lastWorkspaceSlug;
        if (slug === currentSlug) return currentSlug;

        set({ isLoading: true, error: undefined });

        try {
          const result = await userService.updateLastWorkspaceSlug(slug);
          const lastWorkspaceSlug = result.data.lastWorkspaceSlug;

          set((state) => ({
            lastWorkspaceSlug,
            isLoading: false,
            data: state.data ? { ...state.data, lastWorkspaceSlug } : undefined,
          }));
          return lastWorkspaceSlug;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update last workspace slug";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      updateUser: async (firstName: string, lastName: string) => {
        set({ isLoading: true, error: undefined });

        try {
          const result = await userService.updateUser(firstName, lastName);
          const updatedUser = result.data;
          set({ data: updatedUser, isLoading: false });
          return updatedUser;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update user";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      updateUserAvatar: async (file: File) => {
        set({ isLoading: true, error: undefined });
        try {
          const result = await userService.updateUserAvatar(file);
          const updatedUser = result.data;
          set((state) => ({
            data: state.data ? { ...state.data, avatarUrl: updatedUser.avatarUrl } : undefined,
            isLoading: false,
          }));
          return updatedUser;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update user avatar";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        data: state.data,
        lastWorkspaceSlug: state.lastWorkspaceSlug,
      }),
    },
  ),
);

export const useUser = () => useUserStore();