/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api/api-client";
import { UserService } from "@/services/user.service";
import { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
          set({
            error: "Failed to fetch user",
            isLoading: false,
          });
          throw error;
        }
      },

      updateLastWorkspaceSlug: async (slug) => {
        if (slug === get().lastWorkspaceSlug)
          return get().lastWorkspaceSlug;
        set({ isLoadingWorkspaceSlug: true, errorWorkspaceSlug: undefined });
        try {
          const user = await apiClient.patch<User>("/users/me", {
            lastWorkspaceSlug: slug,
          });
          set({
            lastWorkspaceSlug: user.lastWorkspaceSlug,
            isLoadingWorkspaceSlug: false,
          });
          return user.lastWorkspaceSlug;
        } catch (error: any) {
          set({
            errorWorkspaceSlug:
              error.response?.data?.message ||
              "Failed to update last workspace slug",
            isLoadingWorkspaceSlug: false,
          });
          return undefined;
        }
      },
      updateUser: async (firstName, lastName) => {
        set({ isLoading: true, error: undefined });
        try {
          const user = await apiClient.patch<User>("/users/me", {
            firstName,
            lastName,
          });
          set({ data: user, isLoading: false });
          return { success: true, user };
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to update user";
          set({
            error: errorMessage,
            isLoading: false,
          });
          return { success: false, error: errorMessage };
        }
      },
      updateUserAvatar: async (file: File) => {
        try {
          const formData = new FormData();
          formData.append("avatar", file);

          const response: User = await apiClient.post(
            "/users/me/avatar",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );

          set((state) => ({
            data: state.data
              ? {
                  ...state.data,
                  avatarUrl: response.avatarUrl,
                }
              : undefined,
          }));
        } catch (error) {
          console.error("Failed to update user avatar:", error);
          throw new Error("Failed to update avatar. Please try again.");
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
