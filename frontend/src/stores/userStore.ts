/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api/api-client";
import { UserService } from "@/services/user.service";
import { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useWorkspace, useWorkspaceStore } from "./workspaceStore";

interface UserState {
  isLoading: boolean;
  error: string | undefined;
  data: User | undefined;
  lastWorkspaceSlug: string | undefined;
  isLoadingWorkspaceSlug: boolean;
  errorWorkspaceSlug: string | undefined;
}

interface UserActions {
  fetchCurrentUser: () => Promise<User | undefined>;
  updateLastWorkspaceSlug: (slug: string) => Promise<string | undefined>;
  updateUser: (firstName: string, lastName: string) => any;
  updateUserAvatar: (avatarFile: File) => any;
  reset: () => void;
}

export type UserStore = UserState & UserActions;

const initialState: UserState = {
  isLoading: false,
  error: undefined,
  data: undefined,
  lastWorkspaceSlug: undefined,
  isLoadingWorkspaceSlug: false,
  errorWorkspaceSlug: undefined,
};
const userService = new UserService();
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      fetchCurrentUser: async () => {
        set({ isLoading: true, error: undefined });
        try {
          const user = await userService.currentUser();
          if (user && user.id) {
            await useWorkspaceStore.getState().fetchWorkspaces();
            set({
              data: user,
              isLoading: false,
              lastWorkspaceSlug: user.lastWorkspaceSlug,
            });
          } else {
            set({
              isLoading: false,
            });
          }
          return user;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch user";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      updateLastWorkspaceSlug: async (slug) => {
        const currentSlug = get().lastWorkspaceSlug;
        if (slug === currentSlug) return currentSlug;

        set({ isLoading: true, error: undefined });

        try {
          const lastWorkspaceSlug =
            await userService.updateLastWorkspaceSlug(slug);

          set((state) => ({
            lastWorkspaceSlug: lastWorkspaceSlug,
            isLoading: false,
            data: state.data ? { ...state.data, lastWorkspaceSlug } : undefined,
          }));
          return lastWorkspaceSlug;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to update last workspace slug";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      updateUser: async (firstName: string, lastName: string) => {
        set({ isLoading: true, error: undefined });

        try {
          const user = await userService.updateUser(firstName, lastName);

          set({
            data: user,
            isLoading: false,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to update user";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },
      updateUserAvatar: async (file: File) => {
        set({ isLoading: true, error: undefined });
        try {
          const updatedUser = await userService.updateUserAvatar(file);
          set((state) => ({
            data: state.data
              ? { ...state.data, avatarUrl: updatedUser.avatarUrl }
              : undefined,
            isLoading: false,
          }));
          return updatedUser;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to update user avatar";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },
      reset: () => set(initialState),
    }),

    {
      name: "user-storage",
    },
  ),
);

export const useUser = () => useUserStore();
